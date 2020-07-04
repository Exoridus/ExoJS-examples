import pkg from './package.json';
import resolve  from '@rollup/plugin-node-resolve';
import cleaner from 'rollup-plugin-cleaner';
import typescript from 'rollup-plugin-typescript2';
import dev from 'rollup-plugin-dev'
import progress from 'rollup-plugin-progress';
import styles from "rollup-plugin-styles";
import litcss from "rollup-plugin-lit-css";

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
        {
            file: pkg.browser,
            format: 'iife',
            name: 'Examples',
            sourcemap: true,
        },
    ],
    plugins: [
        dev(),
        progress({
            clearLine: true,
        }),
        cleaner({
            targets: ['dist'],
        }),
        typescript({
            typescript: require('typescript'),
        }),
        resolve({
            mainFields: ['module', 'main', 'browser'],
        }),
        styles({
            import: true,
            extensions: ['.css', '.scss'],
            include: ['*.scss'],
            mode: 'inject',
            dts: true,
            modules: true,
            autoModules: true,
            sourcemap: true,

        }),
        // litcss(),
        // postcss({
        //     preprocessor: (content, id) => new Promise((resolve, reject) => {
        //         const result = sass.renderSync({ file: id })
        //
        //         console.log('result', result);
        //
        //         resolve({ code: result.css.toString() })
        //     }),
        //     plugins: [
        //         autoprefixer(),
        //     ],
        //     modules: {
        //         localsConvention: 'dashesOnly',
        //     },
        //     extensions: ['.scss'],
        //     extract: true,
        //     sourceMap: true,
        // }),
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
};
