/**
 * Node.js-only password hashing using scrypt (built-in crypto).
 * Do NOT import from Edge middleware — use only in Node.js API routes.
 *
 * Hash format: "<salt_hex>:<hash_hex>"
 * Generate with: node scripts/hash-password.mjs <yourpassword>
 */

import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LEN = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P })
  return `${salt}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hashHex] = stored.split(':')
    if (!salt || !hashHex) return false
    const stored_hash = Buffer.from(hashHex, 'hex')
    const derived = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P })
    if (stored_hash.length !== derived.length) return false
    return timingSafeEqual(stored_hash, derived)
  } catch {
    return false
  }
}
