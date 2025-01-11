import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return redirect(`/auth/auth-error?error=${encodeURIComponent('Authentication code missing from provider. Please try logging in again.')}`)
  }

  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key: string) {
          return cookies.get(key)?.value
        },
        set(key: string, value: string, options: CookieOptions) {
          cookies.set(key, value, options)
        },
        remove(key: string, options: CookieOptions) {
          cookies.delete(key, options)
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('Error exchanging code for session:', error)
    return redirect(`/auth/auth-error?error=${encodeURIComponent(error.message || 'Unknown error occurred')}`)
  }

  // Set session cookies
  cookies.set("sb-access-token", data.session.access_token, {
    path: "/",
    secure: true,
    httpOnly: true,
  });
  cookies.set("sb-refresh-token", data.session.refresh_token, {
    path: "/",
    secure: true,
    httpOnly: true,
  });

  // Redirect to dashboard after successful authentication
  return redirect('/dashboard')
}