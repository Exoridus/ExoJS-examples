const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
process.env.SASS_SILENCE_DEPRECATIONS = process.env.SASS_SILENCE_DEPRECATIONS
    ? `${process.env.SASS_SILENCE_DEPRECATIONS},legacy-js-api`
    : 'legacy-js-api';
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const progress = require('rollup-plugin-progress');
const styles = require('rollup-plugin-styles');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const autoprefixer = require('autoprefixer');
const terserPlugin = require('@rollup/plugin-terser');
const dev = require('rollup-plugin-dev');
const typescriptPlugin = require('@rollup/plugin-typescript');

const terser = terserPlugin.terser || terserPlugin;
const typescript = typescriptPlugin.default || typescriptPlugin;

const production = (process.env.NODE_ENV || '').trim() === 'production';
const publicDir = path.resolve(__dirname, 'public');
const distDir = path.resolve(__dirname, 'dist');

const collectPublicFiles = (directory) => {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.resolve(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...collectPublicFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }

    return files;
};

const syncPublicEntries = () => {
    fs.mkdirSync(distDir, { recursive: true });

    for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
        const sourcePath = path.resolve(publicDir, entry.name);
        const targetPath = path.resolve(distDir, entry.name);

        if (entry.isDirectory()) {
            fs.cpSync(sourcePath, targetPath, {
                recursive: true,
                force: true,
                errorOnExist: false,
            });
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
};

const syncPublicAssets = () => {
    let hasCleanedDist = false;

    return {
        name: 'sync-public-assets',
        buildStart() {
            if (!hasCleanedDist) {
                fs.rmSync(distDir, { recursive: true, force: true });
                hasCleanedDist = true;
            }

            for (const publicFile of collectPublicFiles(publicDir)) {
                this.addWatchFile(publicFile);
            }
        },
        writeBundle() {
            syncPublicEntries();
        },
    };
};

module.exports = {
    input: 'src/index.ts',
    output: production ? {
        name: 'Examples',
        file: pkg.browser,
        format: 'iife',
        sourcemap: false,
        assetFileNames: '[name][extname]',
    } : {
        name: 'Examples',
        file: pkg.main,
        format: 'umd',
        sourcemap: false,
        assetFileNames: '[name][extname]',
    },
    plugins: [
        progress(),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
        }),
        syncPublicAssets(),
        nodeResolve({
            browser: true,
            preferBuiltins: false,
        }),
        json(),
        commonjs(),
        styles({
            extensions: ['.scss'],
            use: ['sass'],
            mode: 'extract',
            modules: {
                generateScopedName: '[local]_[hash:8]',
                failOnWrongOrder: true,
                mode: 'local',
            },
            autoModules: true,
            minimize: production,
            import: {
                extensions: ['.scss'],
            },
            url: {
                hash: false,
                inline: true,
            },
            plugins: [autoprefixer],
            onExtract: () => false,
            sourceMap: false,
        }),
        typescript({
            tsconfig: './tsconfig.json',
        }),
        production ? terser() : dev('dist'),
    ],
};

