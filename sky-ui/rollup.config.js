import esbuild from 'rollup-plugin-esbuild'
import vue from 'rollup-plugin-vue'
import dartSass from 'sass'
import {terser} from 'rollup-plugin-terser'

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