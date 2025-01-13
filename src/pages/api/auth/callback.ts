import { createClient, setAuthCookies } from '../../../lib/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return redirect(`/auth/auth-error?error=${encodeURIComponent('Authentication code missing from provider. Please try logging in again.')}`)
  }

  const supabase = createClient.server(cookies)

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('Error exchanging code for session:', error)
    return redirect(`/auth/auth-error?error=${encodeURIComponent(error.message || 'Unknown error occurred')}`)
  }

  setAuthCookies(cookies, data.session)
  
  return redirect('/dashboard')
}