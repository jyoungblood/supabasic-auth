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

// Browser client - use this for client-side operations
export const createClient = {
  browser: () => {
    return createBrowserClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    )
  },
  
  // Server client with explicit cookies - use this for middleware/API routes
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

  // Astro-specific server client - use this only in .astro files
  astro: (request: Request) => {
    return createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(request.headers.get('Cookie') ?? '')
          },
          setAll(cookiesToSet) {
            // Note: You'll need to handle setting cookies via Astro.cookies in the .astro file
            cookiesToSet.forEach(({ name, value, options }) => {
              // Can't set cookies here because no access to Astro.cookies
              console.warn('Cookie setting not supported in this context. Use Astro.cookies in your .astro file.')
            })
          },
        },
      }
    )
  }
}