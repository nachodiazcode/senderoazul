import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getNewsPayload } from './src/news-feed.js';

function newsApi() {
  return {
    name: 'sendero-azul-news-api',
    configureServer(server) {
      server.middlewares.use('/api/news', (request, response) => {
        if (request.method !== 'GET') {
          response.statusCode = 405;
          response.setHeader('Allow', 'GET');
          response.end(JSON.stringify({ ok: false, error: 'Método no permitido' }));
          return;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify(getNewsPayload(`http://localhost${request.originalUrl || request.url}`)));
      });
    },
  };
}

export default defineConfig({ plugins: [react(), newsApi()] });
