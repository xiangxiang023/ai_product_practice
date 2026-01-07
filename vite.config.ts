import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 让应用支持离线查看
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
      },
      // 这里的配置决定了 App 安装到手机上的样子
      manifest: {
        name: 'MY OOTD NOTE', // 手机上显示的全名
        short_name: 'OOTD Note', // 图标下的短名字
        description: '记录衣物与心情日记的个人应用',
        theme_color: '#ffffff', // 状态栏颜色
        background_color: '#ffffff', // 启动页背景色
        display: 'standalone', // 像原生 App 一样全屏运行，没有浏览器地址栏
        icons: [
          {
            src: 'ootd-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'ootd-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'ootd-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // 让图标在不同手机上自动适配形状
          }
        ]
      }
    })
  ]
})