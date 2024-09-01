import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Bundle node_modules into a separate 'vendor' chunk
          }
          // You can add more logic here to split other parts of your code into different chunks if needed
        },
      },
    },
    chunkSizeWarningLimit: 2000, 
  },
})
