import { createClient, setAuthCookies } from "../lib/supabase";
import { defineMiddleware } from "astro:middleware";
import type { AstroCookies } from "astro";

// Define protected and redirect routes
const protectedRoutes = ['/dashboard'];
const redirectRoutes = ['/login', '/register'];

// Helper function to check if path matches any pattern in the array
const matchesAny = (path: string, routes: string[]) => 
  routes.some(route => {
    const pattern = new RegExp(`^${route}\/?$`);
    return pattern.test(path);
  });

// Helper function to check and validate session
const validateSession = async (
  cookies: AstroCookies,
  accessToken?: string, 
  refreshToken?: string
) => {
  if (!accessToken || !refreshToken) return null;
  
  const { data, error } = await createClient.server(cookies).auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  });
  
  if (error) return null;
  return data;
};

// Helper to set user data in locals
const setUserData = (locals: App.Locals, data: any) => {
  locals.isAuthenticated = true;
  locals.email = data.user?.email!;
  locals.userId = data.user?.id!;
};


export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {

    locals.isAuthenticated = false;
    
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    // Try to validate session for all routes
    const sessionData = await validateSession(cookies, accessToken, refreshToken);
    if (sessionData) {
      setUserData(locals, sessionData);
    }

    // Handle protected routes
    if (matchesAny(url.pathname, protectedRoutes)) {
      if (!sessionData) {
        cookies.delete("sb-access-token", { path: "/" });
        cookies.delete("sb-refresh-token", { path: "/" });
        return redirect("/login");
      }

      // Refresh cookies
      setAuthCookies(cookies, {
        access_token: sessionData.session?.access_token!,
        refresh_token: sessionData.session?.refresh_token!
      });
    }

    // Handle redirect routes
    if (matchesAny(url.pathname, redirectRoutes) && sessionData) {
      return redirect("/");
    }

    return next();
  }
);
