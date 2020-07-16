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
import html from '@rollup/plugin-html';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'Examples',
        file: pkg.main,
        format: 'umd',
        sourcemap: true,
        assetFileNames: '[name][extname]',
      },
      {
        name: 'Examples',
        file: pkg.browser,
        format: 'umd',
        sourcemap: true,
        assetFileNames: '[name][extname]',
        plugins: [
          terser(),
        ]
      },
    ],
    plugins: [
      eslint({ fix: true }),
      progress({ clearLine: true }),
      del({ targets: ['dist/*'] }),
      resolve({
        mainFields: ['module', 'main', 'browser'],
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      externals(),
      json(),
      commonjs(),
      styles({
        extensions: ['.scss'],
        use: ['sass'],
        mode: 'extract',
        modules: {
          generateScopedName: '[local]_[hash:8]',
          failOnWrongOrder: true,
        },
        autoModules: true,
        sourcemap: true,
        minimize: true,
        dts: true,
        import: {
          extensions: ['.css', '.scss']
        },
        url: {
          publicPath: './public',
          hash: false,
          inline: true,
        },
        plugins: [
          autoprefixer,
        ],
        onExtract() {
          return false;
        },
      }),
      typescript({ typescript: require('typescript') }),
      html({
        fileName: 'index.html',
        title: 'ExoJS Examples',
        meta: [
          {
            charset: 'utf-8',
          },
          {
            name: 'viewport',
            content: 'initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width, minimal-ui',
          },
          {
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
        ],
      })
    ],
  },
];
