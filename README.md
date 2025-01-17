








# Basestar

Basic Astro theme for handling auth with Supabase.

SSR components for handling "full" auth flows: registration, login, forgot/reset pw, logout, and Google oAuth login

Basic templates for auth forms, and API routes for processing them

Middleware handling auth state and managing refresh tokens

Focus on security and accessibility

Aims to provide a realistic starting point for building a server-rendered Astro app with full authentication flows integrated.


- SSR only
	- you can do client stuff if you want, but that's all up to you. get off my lawn.







* [ ] "boilerplate auth flows for supabase in astro with SSR"

  * SB server-side libs (auth not being done or checked on client)
  * includes 1 social/oauth provider example (google)

    * PKCE flow w/ ssr
  * designed to work with the LATEST version of supabase sdk (x.x.x)
  * VANILLA implementation w/ supabase sdk (ssr), astro, & tailwind ... nothing more

    * mostly unopinionated, but does nice ux stuff like ajax, friendly errors, nice-looking login flow
    * still using basic "brutalist" styles (generic vercel looking shit)
    * full "normal" auth flow (including forgot process)
  * just auth (no saas stuff) ... looks good and provides a good base, but it's just auth

    * important part is to provide all the routes/templates for auth flow & app frame, making it look and feel REALLY nice (same quality as nextjs starter)
    * has very obvious "skeleton" placeholders for where the dashboard, etc could go
    * cleaned up version of what i'm doing for HSDS
  * "supabasic auth"


  * MIDDLEWARE for globally checking auth state, setting protected routes, etc
    * with global isAuthenticated variable



  * adds a new ".astro()" client abstraction that makes the SB client easily available in astro templates with minimal overhead/incantation. see examples in index.astro & dashboard.astro

  * note this is designed for 'server' output (see astro.config)
  * in typescript, you're welcome nerds



  * features: CSP
    * .env site_domain is just for the CSP
    * CSP only for production
    * shit randomly not working? check this part first

  * preconfigured handlers for client in browser, server, and astro components


  * boilerplate auth flow has aria roles!
    * they may not be perfect, but they're there 👍
















## Installation

1. Make a new directory for your project, then run:
```sh
npx degit https://github.com/jyoungblood/basestar
```

2. Install the dependencies:

```sh
npm install
```

3. Copy the `.env.example` file to `.env` and fill in the values with your Supabase keys:

```sh
cp .env.example .env
```













## Supabase config

* [ ] checklist for setting up supabase (change project vars, email links) - 



  * note - sb email prefs, change the markup/links

    * ```
      <h2>Confirm your signup</h2>

      <p>Follow this link to confirm your user:</p>
      <p><a href="{{ .SiteURL }}/auth/confirm-email?token_hash={{ .TokenHash }}&type=email">Confirm your mail</a></p>
      ```
    * email prefs update the url too


* [ ] note sb auth email parameters

  * template style
    * cool to have nice copy/paste components
    * w/ the correct
  * note where to change "from" variables & address
  * instructions for how to set up oauth (using google as an example, but could do it for any of them)

    * https://supabase.com/docs/guides/auth/social-login

    * if you add more oauth providers, you'll want to add them to the CSP


  * note that you should set up the smtp for SB auth emails too - set up 3rd party smtp w/ supabase

    * https://supabase.com/docs/guides/auth/auth-smtp











## Project Structure

- [ ] document what we've set up
  - astro.config.mjs
    - check out that CSP!
  - everything in src/pages/ (tried to namespace 'auth' as much as possible)
  - src/lib/supabase.ts
  - src/layouts/Layout.astro
  - src/middleware/index.ts
  - env.d.ts (locals type for app)
  - .env


```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```





## Usage


  * PLEASE look at the source (index, dashboard), we have demos for initializing all this shit and doing normal stuff





  * all cookie settings are in the lib/supabase.ts client setup thing
    * note if you're on safari: set secure to `false` ... safari sucks and this is not my problem
    
  * define protected & redirect routes in the middleware file















## Misc caveats / notes




  * maybe have a note about localhost in safari (it's a known issue, set secure: false in the cookies and you're good) ... seriously fuck safari

    * see sb 'secure' cookie https://supabase.com/docs/guides/auth/server-side/advanced-guide
    * misc cookie BS

      * https://www.reddit.com/r/Supabase/comments/1glqzub/cookies_being_sent_over_localhost_but_not_over/
      * https://www.reddit.com/r/Supabase/comments/169awxh/oauth_works_on_localhost_but_not_on_production/
      * https://www.google.com/search?q=astro+supabase+cookies+login+not+working+safari&sca_esv=ed7e487746667654&rlz=1C5CHFA_enUS1106US1106&ei=-FmEZ9qyEeXMp84PyOLL8Q0&ved=0ahUKEwjajtOutPGKAxVl5skDHUjxMt4Q4dUDCA8&uact=5&oq=astro+supabase+cookies+login+not+working+safari&gs_lp=Egxnd3Mtd2l6LXNlcnAiL2FzdHJvIHN1cGFiYXNlIGNvb2tpZXMgbG9naW4gbm90IHdvcmtpbmcgc2FmYXJpMgUQIRigATIFECEYoAEyBRAhGKABMgUQIRigATIFECEYoAEyBRAhGKsCMgUQIRirAkjED1BYWPkNcAF4AZABAJgBcKABiQWqAQM2LjG4AQPIAQD4AQGYAgigAqAFwgIKEAAYsAMY1gQYR5gDAIgGAZAGCJIHAzcuMaAHkS8&sclient=gws-wiz-serp
      * https://github.com/supabase/ssr/issues/36





  * note using the browser client, be mindful of security

    * Yes, there are several important security considerations when using the browser client:

      * Exposed Queries: Any queries made through the browser client are visible in the browser's network tab and can be inspected by users. This means:
      * The SQL query structure is visible
      * Query parameters are visible
      * Response data is visible
      * Anon Key Exposure: The PUBLIC_SUPABASE_ANON_KEY is exposed in the browser. While this is expected (that's why it's prefixed with "PUBLIC_"), you should:
      * Never use the service_role key in the browser
      * Ensure your Row Level Security (RLS) policies are properly configured
      * Only use the anon key for operations that should be publicly accessible
      * Data Access Control: You must rely entirely on Supabase's Row Level Security (RLS) policies to restrict data access. For example:
        -- Example RLS policy for the countries\_demo table

        CREATE POLICY "Public countries are viewable by everyone"

        ON countries\_demo

        FOR SELECT

        TO anon

        USING (true);  -- This allows anyone to read the data
      * Rate Limiting: Consider implementing rate limiting on your database queries to prevent abuse.

      Best Practices:

      * Use the server client (createClient.server() or createClient.astro()) for sensitive operations
      * Use RLS policies to restrict data access based on user roles/authentication
      * Only expose endpoints and data that are meant to be public
      * Keep sensitive business logic on the server side
      * Monitor your database usage for unusual patterns

      For your current countries demo, if the data is meant to be public, using the browser client is fine. However, if you later add sensitive data to your application, you'll want to carefully consider which client to use for each operation.





  * BTW - pw reset error/warning
    * Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
    * it's bs, known issue, ok to ignore it (not my fault)
      * https://github.com/supabase/auth-js/issues/873
      * https://github.com/supabase/auth-js/pull/895









## Additional Resources



* [ ] links on where to go for more
  * [ ] links to what i followed to set this up


* [ ] readme/home cite sources for how we set things up
  * astro + sb - [https://docs.astro.build/en/guides/backend/supabase/](https://docs.astro.build/en/guides/backend/supabase/)
  * ssr client setup like this - https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=astro&queryGroups=environment&environment=client




  * MIDDLEWARE ref - 
    * https://docs.astro.build/en/guides/middleware/



  * configure cookies to your heart's content, see cookie faq: https://supabase.com/docs/guides/auth/server-side/advanced-guide




  * see "inspo" projects
    - acknowledgements - this project was heavily inspired by:
    * https://github.com/fracalo/astro-supabase-ss
    * https://github.com/kevinzunigacuellar/astro-supabase
    * https://makerkit.dev/next-supabase
    * https://vercel.com/templates/next.js/next-js-saas-starter-1
















