import esbuild from 'rollup-plugin-esbuild'
import vue from 'rollup-plugin-vue'
import stylus from 'rollup-plugin-stylus'
import dartSass from 'sass'
import {terser} from 'rollup-plugin-terser'

export default {
    input: 'src/lib/index.ts',
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
        stylus({
            include: /\.styl$/,
            sass: dartSass
        }),
        esbuild({
            include: /\.[jt]s$/,
            minify: process.env.NODE_ENV === 'production',
            target: 'es2015'
        }),
        vue({
            include: /\.vue$/,
        })
    ]
}