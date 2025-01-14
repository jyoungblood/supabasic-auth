import { createClient, setAuthCookies } from "../../../lib/supabase";
import type { APIRoute } from "astro";

// This endpoint handles the OAuth callback after a user signs in
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  // Extract the authorization code from the URL parameters
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Return error if no authorization code is present
  if (!code) {
    return new Response(JSON.stringify({ 
      error: 'Authentication code missing from provider. Please try logging in again.' 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    })
  }

  // Initialize Supabase client with server-side configuration
  const supabase = createClient.server(cookies)

  // Exchange the temporary authorization code for a permanent session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  // Handle any errors during session exchange
  if (error) {
    console.error('Error exchanging code for session:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred' 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    })
  }

  // Store the session data in cookies for subsequent requests
  setAuthCookies(cookies, data.session)
  
  // Redirect to dashboard after successful authentication
  return redirect('/dashboard')
}