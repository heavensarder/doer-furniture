import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'doer_jwt_secret_key_8492049102948210948210948120';
export const AUTH_COOKIE_NAME = 'doer_admin_session';

export interface AdminUserPayload {
  id: number;
  username: string;
  name: string;
}

export function signToken(payload: AdminUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminUserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminUserPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

