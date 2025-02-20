import jwt from 'jsonwebtoken';
import { H3Event } from 'h3';

const EXPIRES_IN = 60 * 60 * 24; // 1 day

export function signJwt(payload: { id: number }) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: EXPIRES_IN });
}

export function verifyJwt(event: H3Event): { id: number } {
  const token = getCookie(event, 'NuxtNoteJWT');
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    return decoded;
  } catch {
    deleteCookie(event, 'NuxtNoteJWT');
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
}
