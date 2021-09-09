import esbuild from 'rollup-plugin-esbuild'
import vue from 'rollup-plugin-vue'
import dartSass from 'sass'
import {terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'packages/index.ts',
    output: {
        globals: {
            vue: 'Vue'
        },
        name: 'Sky',
        file: 'dist/lib/sky.js',
        format: 'umd',
        plugins: [terser()]
    },
    plugins: [
        scss({
            include: /\.scss$/,
            sass: dartSass
        }),
        esbuild(),
        vue({
            target: 'browser',
            css: false,
            exposeFilename: false,
        }),
        typescript({
          tsconfigOverride: {
            'include': [
              'packages/**/*',
              'typings/vue-shim.d.ts',
            ],
            'exclude': [
              'node_modules',
              'packages/**/__tests__/*',
            ],
          },
          abortOnError: false,
        }),
    ]
}