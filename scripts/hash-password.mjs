#!/usr/bin/env node
/**
 * Generate a scrypt password hash for use as ADMIN_PASSWORD_HASH.
 *
 * Usage:
 *   node scripts/hash-password.mjs <yourpassword>
 *
 * Copy the output and paste it as the value of ADMIN_PASSWORD_HASH in .env.local
 */

import { scryptSync, randomBytes } from 'crypto'

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <yourpassword>')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex')
const result = `${salt}:${hash}`

console.log('\nADMIN_PASSWORD_HASH=' + result + '\n')
console.log('Add the line above to your .env.local file.\n')
