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
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // If registration is successful and session is available immediately
    if (data.session) {
      cookies.set("sb-access-token", data.session.access_token, {
        path: "/",
      });
      cookies.set("sb-refresh-token", data.session.refresh_token, {
        path: "/",
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // If email confirmation is required
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