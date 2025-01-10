import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const password = formData.get("password")?.toString();
    const token_hash = formData.get("token_hash")?.toString();

    if (!password) {
      return new Response(
        JSON.stringify({ error: "Password is required" }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
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