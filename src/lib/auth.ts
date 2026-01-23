import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Default password for new users
 */
export const DEFAULT_PASSWORD = 'Smkn8bisa2025';

/**
 * Check if password is default
 */
export function isDefaultPassword(password: string): boolean {
  return password === DEFAULT_PASSWORD;
}

/**
 * Validate password strength
 * - Minimum 6 characters
 * - Contains both letters and numbers
 */
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password minimal 6 karakter',
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      valid: false,
      message: 'Password harus kombinasi huruf dan angka',
    };
  }

  return { valid: true };
}
