import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
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
        progress(),
        eslint(),
        del({ targets: ['dist/*'] }),
        resolve(),
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
        ts(),
        copy({ targets: [{ src: 'public/*', dest: 'dist' }] }),
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
        progress(),
        eslint(),
        del({ targets: ['dist/*'] }),
        resolve(),
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
        ts(),
        copy({ targets: [{ src: 'public/*', dest: 'dist' }] }),
        terser(),
    ],
};

export default isProduction ? prodConfig : devConfig;
