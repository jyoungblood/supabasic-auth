import { type AstroCookies } from 'astro';
import { createClient } from '@supabase/supabase-js';

export function isAuthenticated(cookies: AstroCookies) {
  const accessToken = cookies.get("sb-access-token");
  return !!accessToken;
}

// Add this new function to get user info
export async function getUserEmail(cookies: AstroCookies) {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return null;
  
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );
  
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  return user?.email ?? null;
}

export async function getUserId(cookies: AstroCookies) {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) return null;
  
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY
  );
  
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  return user?.id ?? null;
} 