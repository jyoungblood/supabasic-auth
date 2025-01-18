# Basestar

A minimalist, security-focused authentication starter for Astro + Supabase. Provides complete SSR authentication flows with a focus on best practices and accessibility. Perfect for developers who want a solid auth foundation without the bloat.

## ✨ Features

🔐 **Complete Auth Flows**
- Server-side authentication with registration, login, password reset, and logout
- Google OAuth integration with PKCE flow
- Secure session management with refresh tokens
- Full email verification and password reset flows

🏗️ **Architecture**
- Pure SSR implementation (no client-side auth)
- TypeScript-first approach
- Middleware for global auth state management
- Preconfigured Content Security Policy (CSP)
- Environment-aware security settings

🎨 **Developer Experience**
- Clean, minimal Tailwind styling
- AJAX-powered forms with friendly error handling
- Accessible components with ARIA roles
- Streamlined `.astro()` client abstraction for Supabase
- Brutalist-inspired UI design

🛠️ **Technical Stack**
- Latest Supabase SDK
- Vanilla implementation (just Astro + Supabase + Tailwind)
- Production-ready security configurations
- Environment-aware CSP settings
- Preconfigured handlers for browser, server, and Astro components

💡 **Developer Friendly**
- Clear placeholder structure for dashboard expansion
- Thoroughly documented setup process
- Minimal dependencies, maximum flexibility
- Unopinionated base for easy customization

## Installation

1. Make a new directory for your project, then run:
```sh
npx degit https://github.com/jyoungblood/basestar
```

2. Install the dependencies:
```sh
npm install
```

3. Copy the `.env.example` file to `.env` and fill in your Supabase credentials:
```sh
cp .env.example .env
```

## Supabase Configuration

### Authentication Setup
1. In your Supabase dashboard, update the Site URL and redirect URLs in Authentication > URL Configuration
2. Configure your email templates in Authentication > Email Templates:
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your user:</p>
   <p><a href="{{ .SiteURL }}/auth/confirm-email?token_hash={{ .TokenHash }}&type=email">Confirm your mail</a></p>
   ```

### OAuth Configuration
1. Set up Google OAuth following the [Supabase social login guide](https://supabase.com/docs/guides/auth/social-login)
2. Add any additional OAuth providers to your CSP configuration in `astro.config.mjs`

### Email Provider
- Configure a third-party SMTP provider in Authentication > SMTP Settings for production-ready email delivery

## Project Structure
```
/
├── src/
│   ├── layouts/      # Base layout with auth context
│   ├── pages/        # Auth flows and route handlers
│   ├── lib/          # Supabase client configuration
│   └── middleware/   # Auth state and route protection
├── astro.config.mjs  # CSP and server configuration
├── env.d.ts         # Type definitions
└── .env             # Environment configuration
```

## Available Auth Routes

- `/auth/login` - Login page with email/password and Google OAuth
- `/auth/register` - User registration
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset completion
- `/auth/confirm-email` - Email confirmation handler

## Usage Notes

### Common Issues
- If authentication isn't working in Safari during local development, set `secure: false` in the cookie options (lib/supabase.ts)
- CSP issues? Check your `astro.config.mjs` configuration and ensure your OAuth providers are properly whitelisted
- Auth state not updating? The middleware checks auth on every request - ensure your session is properly initialized

### TypeScript Support
The project includes type definitions for:
- Supabase client configuration
- Auth middleware
- Global auth state in `env.d.ts`

### Security Considerations
- Browser client operations are protected by Row Level Security (RLS)
- Service role key should never be exposed to the client
- CSP is configured for production by default
- Cookie settings can be customized in `lib/supabase.ts`

### Browser Compatibility
- For local development in Safari, set `secure: false` in cookie options
- Production environments should always use secure cookies

### Additional Resources
- [Astro Supabase Guide](https://docs.astro.build/en/guides/backend/supabase/)
- [Supabase Auth Server-Side Guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Astro Middleware Documentation](https://docs.astro.build/en/guides/middleware/)

## Acknowledgements
This project was inspired by:
- [astro-supabase-ss](https://github.com/fracalo/astro-supabase-ss)
- [astro-supabase](https://github.com/kevinzunigacuellar/astro-supabase)
- [next-supabase](https://makerkit.dev/next-supabase)
















