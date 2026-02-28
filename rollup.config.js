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
const del = require('rollup-plugin-delete').default;
const autoprefixer = require('autoprefixer');
const terserPlugin = require('@rollup/plugin-terser');
const copy = require('rollup-plugin-copy');
const dev = require('rollup-plugin-dev');
const typescriptPlugin = require('@rollup/plugin-typescript');

const terser = terserPlugin.terser || terserPlugin;
const typescript = typescriptPlugin.default || typescriptPlugin;

const production = (process.env.NODE_ENV || '').trim() === 'production';

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
        del({ targets: ['dist/*'] }),
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
        copy({ targets: [{ src: 'public/*', dest: 'dist' }] }),
        production ? terser() : dev('dist'),
    ],
};

