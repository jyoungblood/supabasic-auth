// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createClient.server(cookies);
    
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get("origin")}/auth/callback?redirect_to=/dashboard/reset-password`,
    });

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