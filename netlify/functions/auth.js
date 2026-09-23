export async function handler() {
  return {
    statusCode: 503,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ ok: false, error: 'El registro está temporalmente desactivado.' }),
  };
}
