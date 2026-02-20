import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import pxtorem from 'postcss-pxtorem';


// https://vite.dev/config/
export default defineConfig({
  // base:"/agent",
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') 
    }
  },
  css: {
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 37.5,
          unitPrecision: 3,
          propList: ['*'],
        })
      ]
    }
  },
  // server: {
  //   host: "10.130.173.77",
  //   port:5100,
  // }
})
