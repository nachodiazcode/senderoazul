import { getNewsPayload } from '../../src/news-feed.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { Allow: 'GET', 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ ok: false, error: 'Método no permitido' }),
    };
  }

  const payload = getNewsPayload(event.rawUrl || `https://senderoazul.cl/api/news?${event.rawQuery || ''}`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(payload),
  };
}
