import { createClient, setAuthCookies } from "../../../lib/supabase";
import type { APIRoute } from "astro";

// API endpoint for email/password registration
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Initialize Supabase client with server-side configuration
    const supabase = createClient.server(cookies);
    
    // Extract registration details from form data
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Validate required fields
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Attempt to create new user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // If email confirmation is not required, set session cookies
    if (data.session) {
      setAuthCookies(cookies, data.session);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // If email confirmation is required, return appropriate response
    return new Response(JSON.stringify({ success: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error registering user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};