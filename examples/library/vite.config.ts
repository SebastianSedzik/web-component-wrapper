import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const fileName = {
  es: 'index.mjs',
  cjs: 'index.js'
};

export default defineConfig({
  plugins: [
    dts()
  ],
  build: {
    ssr: true,
    lib: {
      entry: './src/index.ts',
      name: 'library-components',
      formats: ["es", "cjs"],
      fileName: (format) => fileName[format]
    }
  }
})
