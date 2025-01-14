import { createClient } from "../../../lib/supabase";
import type { APIRoute } from "astro";

// API endpoint to handle password reset after user clicks email link
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Initialize Supabase client with server-side configuration
    const supabase = createClient.server(cookies);
    
    // Extract new password and token from form data
    const formData = await request.formData();
    const password = formData.get("password")?.toString();

    // Validate password presence
    if (!password) {
      return new Response(
        JSON.stringify({ error: "Password is required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Update user's password in Supabase
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    // Handle password update errors
    if (error) {
      console.error(error.message);
      return new Response(
        JSON.stringify({ error: error.message }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password has been reset successfully." 
      }), 
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