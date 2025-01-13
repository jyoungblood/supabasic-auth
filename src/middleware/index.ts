import { defineMiddleware } from "astro:middleware";
import { supabase } from "../lib/supabase";

// Define routes as simple strings
const protectedRoutes = ['/dashboard'];
const redirectRoutes = ['/login', '/register'];
const protectedAPIRoutes = ['/api/guestbook'];

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    // Initialize default state
    locals.isAuthenticated = false;
    
    // Quick check for non-protected routes
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      if (!error) {
        locals.isAuthenticated = true;
        locals.email = data.user?.email!;
        locals.userId = data.user?.id!;
      }
    }

    // Helper function to check if path matches any pattern in the array
    const matchesAny = (path: string, routes: string[]) => 
      routes.some(route => {
        // Convert route to regex pattern that matches with or without trailing slash
        const pattern = new RegExp(`^${route}\/?$`);
        return pattern.test(path);
      });

    // Check auth only for protected routes
    if (matchesAny(url.pathname, [...protectedRoutes, ...protectedAPIRoutes])) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (!accessToken || !refreshToken) {
        if (matchesAny(url.pathname, protectedRoutes)) {
          return redirect("/login");
        } else {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
          );
        }
      }

      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      if (error) {
        cookies.delete("sb-access-token", { path: "/" });
        cookies.delete("sb-refresh-token", { path: "/" });
        
        if (matchesAny(url.pathname, protectedRoutes)) {
          return redirect("/login");
        } else {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
          );
        }
      }

      locals.isAuthenticated = true;
      locals.email = data.user?.email!;
      locals.userId = data.user?.id!;
      
      // Update tokens
      cookies.set("sb-access-token", data?.session?.access_token!, {
        sameSite: process.env.COOKIE_SAMESITE as "lax" | "strict" | "none",
        path: "/",
        secure: process.env.COOKIE_SECURE === "true",
        httpOnly: true,
      });
      cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
        sameSite: process.env.COOKIE_SAMESITE as "lax" | "strict" | "none",
        path: "/",
        secure: process.env.COOKIE_SECURE === "true",
        httpOnly: true,
      });
    }

    // Handle redirect routes (login/register)
    if (matchesAny(url.pathname, redirectRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (accessToken && refreshToken) {
        return redirect("/dashboard");
      }
    }

    return next();
  },
);
