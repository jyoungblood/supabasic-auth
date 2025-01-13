// With `output: 'static'` configured:
// export const prerender = false;
import type { Provider } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create server-side Supabase client with cookies
    const supabase = createClient.server(cookies);
    
    const formData = await request.formData();
    const provider = formData.get("provider")?.toString();

    if (provider) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${import.meta.env.SITE_URL}/api/auth/callback`,
          skipBrowserRedirect: true
        },
      });

      if (error) {
        return new Response(error.message, { status: 500 });
      }

      if (!data.url) {
        return new Response("Failed to get authorization URL", { status: 500 });
      }

      return Response.redirect(data.url);
    }

    return new Response("Provider is required", { status: 400 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
};