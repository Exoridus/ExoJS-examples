import pkg from './package.json';
import resolve  from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import progress from 'rollup-plugin-progress';
import styles from "rollup-plugin-styles";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import del from 'rollup-plugin-delete';
import autoprefixer from 'autoprefixer';
import { eslint } from "rollup-plugin-eslint";

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
                assetFileNames: "[name][extname]",
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
                assetFileNames: "[name][extname]",
            },
            {
                file: pkg.browser,
                format: 'iife',
                name: 'Examples',
                sourcemap: true,
                assetFileNames: "[name][extname]",
            },
            {
                file: pkg.minimized,
                format: 'iife',
                name: 'Examples',
                sourcemap: true,
                assetFileNames: "[name][extname]",
            },
        ],
        plugins: [
            progress({ clearLine: true }),
            del({
                targets: [
                    'dist/*',
                    'src/**/*.scss.d.ts',
                ],
            }),
            eslint({
                fix: true,
            }),
            resolve({
                mainFields: ['module', 'main', 'browser'],
                extensions: [".ts", ".mjs", ".js", ".json"],
            }),
            externals(),
            json(),
            commonjs(),
            styles({
                extensions: ['.scss'],
                use: ['sass'],
                mode: ['extract', 'examples.css'],
                modules: {
                    generateScopedName: '[local]_[hash:8]',
                    failOnWrongOrder: true,
                },
                autoModules: true,
                sourcemap: true,
                dts: true,
                import: {
                    extensions: ['.css', '.scss']
                },
                url: {
                    publicPath: './public',
                    hash: false,
                },
                plugins: [
                    autoprefixer,
                ]
            }),
            typescript({ typescript: require('typescript') }),
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
    },
];
