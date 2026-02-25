import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Alias para imports @server/* nos server routes — funciona no TS e no bundler Vite
      '@server': resolve(__dirname, 'src/server'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ content: ['./src/**/*.{html,ts}'], theme: { extend: {} }, plugins: [] }),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: Number(process.env['PORT']) || 3000,
    host: process.env['VITE_HOST'] || 'localhost',
    strictPort: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'X-Frame-Options': 'ALLOWALL',
    },
  },
  plugins: [
    analog({
      ssr: false,
      nitro: {
        alias: {
          // Alias no Nitro (runtime Node.js) para @server/* também funcionar no servidor gerado
          '@server': resolve(__dirname, 'src/server'),
        },
      },
    }),
    {
      name: 'corp-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('X-Frame-Options', 'ALLOWALL');
          next();
        });
      },
    },
  ],
});