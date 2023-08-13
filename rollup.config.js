import { defineConfig } from 'rollup'
import ts from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'

export default defineConfig({
  input: './src/index.ts',
  plugins: [
    ts(),
    // babel({
    //   presets: ["@babel/preset-env"],
    //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //   exclude: "**/node_modules/**"
    // }),
  ],
})
