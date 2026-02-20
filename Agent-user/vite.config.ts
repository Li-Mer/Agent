import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import pxtorem from 'postcss-pxtorem';
import viteImagemin from "vite-plugin-imagemin";


// https://vite.dev/config/
export default defineConfig({
  // base:"/agent",
  plugins: [vue(),
    viteImagemin({
      // 压缩 png
      optipng: {
        optimizationLevel: 7,
      },
      // 压缩 jpeg
      mozjpeg: {
        quality: 80,
      },
       pngquant: {// png
        quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
        speed: 4, // 压缩速度，1(强力)到11(最快)
      },
      // 压缩 svg
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false,
          },
        ],
      },
      // 生成 webp
      webp: {
        quality: 80,
      },
    }),
  ],
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
  build: {
    // 代码压缩配置(使用 terser 进行代码压缩)
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true, // 移除 debugger
        pure_funcs: ["console.log"], // 移除特定函数
      },
    } as any,

    // 关闭生产环境 sourcemap
    sourcemap: false,

    // Chunk 大小警告限制
    chunkSizeWarningLimit: 1500,

    // 静态资源内联阈值(小于 4KB 的图片转 base64)
    assetsInlineLimit: 4096,

    // Chunk 分割策略
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vue 全家桶打包到一起
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor';
            }
            // Vant UI 组件库单独打包
            if (id.includes('vant')) {
              return 'vant-vendor';
            }
            // 工具库单独打包
            if (id.includes('marked') || id.includes('lodash-es')) {
              return 'utils';
            }
          }
        },
        // 文件名格式
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]",
      },
    }
  }
  // server: {
  //   host: "10.130.173.77",
  //   port:5100,
  // }
})
