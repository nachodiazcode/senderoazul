import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getNewsPayload } from './src/news-feed.js';
import { handleAuthRequest } from './server/auth-api.js';

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

function authApi() {
  return { name: 'sendero-azul-auth-api', configureServer(server) {
    server.middlewares.use('/api/auth', (request, response) => {
      const chunks = [];
      request.on('data', (chunk) => chunks.push(chunk));
      request.on('end', () => {
        let body = {};
        try { body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}; } catch { body = {}; }
        const result = handleAuthRequest({ method: request.method, body, authorization: request.headers.authorization || '' });
        response.statusCode = result.status;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify(result.data));
      });
    });
  } };
}

export default defineConfig({ plugins: [react(), newsApi(), authApi()] });
