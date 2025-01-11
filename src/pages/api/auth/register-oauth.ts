// With `output: 'static'` configured:
// export const prerender = false;
import type { Provider } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const provider = formData.get("provider")?.toString();

    if (provider) {
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

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${import.meta.env.SITE_URL}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });

      if (error) {
        console.error("OAuth error:", error);
        return new Response(error.message, { status: 500 });
      }

      if (!data.url) {
        console.error("No URL returned from OAuth setup");
        return new Response("Failed to get authorization URL", { status: 500 });
      }

      console.log("Redirecting to:", data.url);
      return Response.redirect(data.url);
    }

    return new Response("Provider is required", { status: 400 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
};