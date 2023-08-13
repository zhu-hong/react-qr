import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  externals: ['react'],
  declaration: true,
  entries: [
    './src/components/qr'
  ],
})
