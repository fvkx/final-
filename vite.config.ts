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
          target: env.VITE_BACKEND_URL || 'http://localhost/Balingasag-Tourism-Guide',
          changeOrigin: true,
        },
        // Proxy dynamically uploaded images from the PHP/Apache server
        '/uploads': {
<<<<<<< HEAD
          target: (env.VITE_BACKEND_URL || 'http://localhost/Balingasag-Tourism-Guide') + '/public',
=======
          target: env.VITE_BACKEND_URL || 'http://localhost/Balingasag-Tourism-Guide',
>>>>>>> 710969a219f4fce336f23b33391cb672357c859d
          changeOrigin: true,
        }
      }
    }
  }
})