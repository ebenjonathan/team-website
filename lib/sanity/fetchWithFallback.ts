import { hasSanityConfig, sanityClient } from './client'

export async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  params?: Record<string, unknown>,
): Promise<T> {
  if (!hasSanityConfig) {
    return fallback
  }

  try {
    if (!sanityClient) {
      return fallback
    }

    const data = await sanityClient.fetch<T>(query, params ?? {})

    if (Array.isArray(data) && data.length === 0) {
      return fallback
    }

    if (!data) {
      return fallback
    }

    return data
  } catch {
    return fallback
  }
}
