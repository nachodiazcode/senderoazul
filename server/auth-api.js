import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';

const JWT_SECRET = process.env.SENDERO_JWT_SECRET || 'sendero-azul-dev-secret-change-me';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const users = new Map();

function base64url(value) { return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); }
function signToken(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}
function verifyToken(token) {
  try {
    const [header, body, signature] = String(token || '').split('.');
    if (!header || !body || !signature) return null;
    const expected = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp && payload.exp >= Math.floor(Date.now() / 1000) ? payload : null;
  } catch { return null; }
}
function hashPassword(password, salt = randomBytes(16).toString('hex')) { return { salt, hash: scryptSync(password, salt, 64).toString('hex') }; }
function passwordMatches(password, user) {
  const candidate = Buffer.from(hashPassword(password, user.salt).hash, 'hex');
  const stored = Buffer.from(user.passwordHash, 'hex');
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}
function cleanUser(user) { return { id: user.id, name: user.name, email: user.email }; }
function issue(user) {
  const now = Math.floor(Date.now() / 1000);
  return { token: signToken({ sub: user.id, name: user.name, email: user.email, iat: now, exp: now + TOKEN_TTL_SECONDS }), user: cleanUser(user) };
}

export function handleAuthRequest({ method = 'POST', body = {}, authorization = '' }) {
  if (method === 'GET') {
    const payload = verifyToken(authorization.replace(/^Bearer\s+/i, ''));
    if (!payload) return { status: 401, data: { ok: false, error: 'Sesión expirada o inválida.' } };
    return { status: 200, data: { ok: true, user: { id: payload.sub, name: payload.name, email: payload.email } } };
  }
  if (method !== 'POST') return { status: 405, data: { ok: false, error: 'Método no permitido.' } };
  const action = body.action;
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return { status: 400, data: { ok: false, error: 'Usa un email válido y una contraseña de al menos 6 caracteres.' } };
  if (action === 'register') {
    if (users.has(email)) return { status: 409, data: { ok: false, error: 'Ya existe una cuenta con ese email.' } };
    const name = String(body.name || '').trim().slice(0, 40);
    if (name.length < 2) return { status: 400, data: { ok: false, error: 'Escribe tu nombre o apodo azul.' } };
    const { salt, hash } = hashPassword(password);
    const user = { id: randomUUID(), name, email, salt, passwordHash: hash };
    users.set(email, user);
    return { status: 201, data: { ok: true, ...issue(user) } };
  }
  if (action === 'login') {
    const user = users.get(email);
    if (!user || !passwordMatches(password, user)) return { status: 401, data: { ok: false, error: 'Email o contraseña incorrectos.' } };
    return { status: 200, data: { ok: true, ...issue(user) } };
  }
  return { status: 400, data: { ok: false, error: 'Acción no reconocida.' } };
}
