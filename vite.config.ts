import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      '@':'/src'
    }
  },
  css:{
    preprocessorOptions:{
      scss:{
        additionalData:'@import "src/assets/styles/var.scss";'
      }
    }
  },
  plugins: [react(),mkcert()],
})
