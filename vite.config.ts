import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://127.0.0.1/new',
          changeOrigin: true,
        },
        // Proxy dynamically uploaded images from the PHP/Apache server
        '/uploads': {
          target: (env.VITE_BACKEND_URL || 'http://127.0.0.1/new') + '/public',
          changeOrigin: true,
        }
      }
    }
  }
})