// With `output: 'static'` configured:
// export const prerender = false;
import { supabase } from "../../../lib/supabase";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
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

    // Set cookies and return success response
    cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      secure: true,
      httpOnly: true,
    });
    cookies.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      secure: true,
      httpOnly: true,
    });

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