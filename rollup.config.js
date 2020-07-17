import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import progress from 'rollup-plugin-progress';
import styles from 'rollup-plugin-styles';
import externals from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import autoprefixer from 'autoprefixer';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import dev from 'rollup-plugin-dev';
import prettier from 'rollup-plugin-prettier';
import sizes from 'rollup-plugin-sizes';
import ts from "@wessberg/rollup-plugin-ts";

const isProduction = (process.env.NODE_ENV || '').trim() === 'production';

const devConfig = {
    input: 'src/index.ts',
    output: {
        name: 'Examples',
        file: pkg.main,
        format: 'umd',
        sourcemap: true,
        assetFileNames: '[name][extname]',
    },
    plugins: [
        del({ targets: ['dist/*', 'src/**/*.module.scss.d.ts'] }),
        resolve({ mainFields: ['main'] }),
        externals(),
        json(),
        commonjs(),
        styles({
            extensions: ['.scss'],
            use: ['sass'],
            mode: 'extract',
            modules: { generateScopedName: '[local]_[hash:8]' },
            autoModules: true,
            import: { extensions: ['.css', '.scss'] },
            url: { hash: false, inline: true },
            plugins: [autoprefixer],
            onExtract: () => false,
        }),
        // prettier({
        //     tabWidth: 4,
        //     useTabs: false,
        //     semi: true,
        //     singleQuote: true,
        //     quoteProps: 'as-needed',
        //     trailingComma: 'es5',
        //     bracketSpacing: true,
        //     arrowParens: 'avoid',
        // }),
        typescript({ typescript: require('typescript') }),
        copy({ targets: [{ src: 'public/*', dest: 'dist' }] }),
        eslint({ fix: true }),
        progress(),
        sizes(),
        dev('dist'),
    ],
};

const prodConfig = {
    input: 'src/index.ts',
    output: {
        name: 'Examples',
        file: pkg.browser,
        format: 'iife',
        sourcemap: true,
        assetFileNames: '[name][extname]',
    },
    plugins: [
        del({ targets: ['dist/*', 'src/**/*.module.scss.d.ts'] }),
        resolve({ mainFields: ['browser'] }),
        externals(),
        json(),
        commonjs(),
        styles({
            extensions: ['.scss'],
            use: ['sass'],
            mode: 'extract',
            modules: { generateScopedName: '[local]_[hash:8]' },
            autoModules: true,
            minimize: true,
            import: { extensions: ['.css', '.scss'] },
            url: { hash: false, inline: true },
            plugins: [autoprefixer],
            onExtract: () => false,
        }),
        typescript({ typescript: require('typescript') }),
        copy({ targets: [{ src: 'public/*', dest: 'dist' }] }),
        eslint({ fix: true }),
        terser(),
        progress(),
        sizes(),
    ],
};

export default isProduction ? prodConfig : devConfig;
