import { createClient } from "../../../lib/supabase";
import type { APIRoute } from "astro";

// API endpoint to handle password reset requests
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Initialize Supabase client with server-side configuration
    const supabase = createClient.server(cookies);
    
    // Extract email from form submission
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    // Validate email presence
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Send password reset email via Supabase
    // redirectTo specifies where to send the user after they click the reset link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get("origin")}/auth/callback?redirect_to=/dashboard/reset-password`,
    });

    // Handle any errors from the password reset attempt
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
        message: "Check your email for a link to reset your password."
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