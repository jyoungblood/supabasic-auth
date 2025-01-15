import { createClient, setAuthCookies } from "../../../lib/supabase";
import type { APIRoute } from "astro";

// API endpoint for email/password login
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Initialize Supabase client with server-side configuration
    const supabase = createClient.server(cookies);
    
    // Extract login credentials from form data
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Attempt to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Handle invalid credentials
    if (error) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }), 
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Set cookies before creating the response
    await setAuthCookies(cookies, data.session);

    // Create and return response after cookies are set
    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    // ... existing error handling ...
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};