import type { APIRoute } from "astro";

// API endpoint to handle user logout
export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Remove authentication cookies
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  
  // Redirect to home page after logout
  return redirect("/");
};