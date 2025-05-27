import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                server: resolve(__dirname, 'src/server.ts'),
                client: resolve(__dirname, 'public/index.html')
            },
            external: [
                'express',
                'express-rate-limit',
                'socket.io',
                'ws',
                'cors',
                'helmet',
                'dotenv',
                'nanoid',
                '@neondatabase/serverless',
                'drizzle-orm',
                'crypto',
                'buffer',
                '/socket.io/socket.io.js'
            ]
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true
            }
        }
    },
    resolve: {
        alias: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            buffer: 'buffer'
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    }
});
