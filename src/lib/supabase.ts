import { createBrowserClient, createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax",
  secure: true,
  httpOnly: true,
} as const;

export function setAuthCookies(cookies: AstroCookies, session: { access_token: string, refresh_token: string }) {
  cookies.set("sb-access-token", session.access_token, COOKIE_OPTIONS);
  cookies.set("sb-refresh-token", session.refresh_token, COOKIE_OPTIONS);
}

export const createClient = {

  // Browser client - for client-side operations
  browser: () => {
    return createBrowserClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    )
  },
  
  // Server client with explicit cookies - for middleware/API routes
  server: (cookies: AstroCookies) => {
    return createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(key: string) {
            return cookies.get(key)?.value ?? ''
          },
          set(key: string, value: string, options) {
            cookies.set(key, value, options)
          },
          remove(key: string, options) {
            cookies.delete(key, options)
          }
        },
      }
    )
  },

  // Astro-specific server client - for .astro components
  astro: (Astro: any) => {
    return createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(Astro.request.headers.get('Cookie') ?? '')
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              Astro.cookies.set(name, value, options))
          },
        },
      }
    )
  }
}