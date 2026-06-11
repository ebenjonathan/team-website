/**
 * Edge-compatible HMAC-SHA256 signed token.
 * Uses the Web Crypto API (available in both Next.js Edge middleware and Node.js 18+).
 * Format: base64url(payload_json) + "." + base64url(hmac_sig)
 */

const SESSION_HOURS = 8

function b64urlEncode(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  return new Uint8Array(binary.split('').map((c) => c.charCodeAt(0)))
}

async function importKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be set and at least 32 characters')
  }
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export interface TokenPayload {
  email: string
  role: 'admin'
  iat: number
  exp: number
}

export async function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  const key = await importKey()
  const now = Date.now()
  const full: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_HOURS * 60 * 60 * 1000,
  }
  const encoded = b64urlEncode(new TextEncoder().encode(JSON.stringify(full)))
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded))
  return `${encoded}.${b64urlEncode(new Uint8Array(sig))}`
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [encoded, sigB64] = parts

    const key = await importKey()
    const signature = Uint8Array.from(b64urlDecode(sigB64))
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(encoded),
    )
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(encoded))) as TokenPayload
    if (Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}
