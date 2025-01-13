// With `output: 'static'` configured:
// export const prerender = false;
import { createClient, setAuthCookies } from "../../../lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create server-side Supabase client with cookies
    const supabase = createClient.server(cookies);
    
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }), 
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    setAuthCookies(cookies, data.session);

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};