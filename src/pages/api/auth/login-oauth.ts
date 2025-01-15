import { createClient } from "../../../lib/supabase";
import type { APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";

// API endpoint to handle OAuth login requests (Google, GitHub, etc.)
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Initialize Supabase client with server-side configuration
    const supabase = createClient.server(cookies);
    
    // Get the request URL origin (protocol + domain)
    const requestOrigin = new URL(request.url).origin;

    // Get the OAuth provider (e.g., 'google', 'github') from the form data
    const formData = await request.formData();
    const provider = formData.get("provider")?.toString();

    if (provider) {
      // Initiate OAuth flow with the specified provider
      // skipBrowserRedirect: true means we'll handle the redirect manually
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${requestOrigin}/api/auth/callback`,
          skipBrowserRedirect: true
        },
      });

      // Handle OAuth setup errors
      if (error) {
        return new Response(error.message, { status: 500 });
      }

      // Ensure we received a valid authorization URL
      if (!data.url) {
        return new Response("Failed to get authorization URL", { status: 500 });
      }

      // Redirect user to the OAuth provider's login page
      return Response.redirect(data.url);
    }

    return new Response("Provider is required", { status: 400 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
};