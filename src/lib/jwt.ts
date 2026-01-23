import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sihebat8-secret-key-2025';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  role: string;
  name?: string;
  kelas?: string;
  mapel?: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Decode JWT token without verification (for getting user info)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
