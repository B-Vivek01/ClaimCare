# ClaimCare deployment handoff

This package is a review build, not a claim that all specification requirements are complete. Use synthetic data until the remaining acceptance checklist passes. Razorpay is intentionally disabled pending the owner's new account.

## Build settings

Project directory: frontend. Install: npm ci. Build: npm run build. Publish directory: dist. Use a Node version supported by the installed Vite 8 package. Vercel and Netlify routing files are included so direct application URLs resolve to index.html.

Environment variables for a hosting build:

- VITE_SUPABASE_URL: https://rmkcdtjvuhdczxivjmgy.supabase.co
- VITE_SUPABASE_PUBLISHABLE_KEY: the existing project's public publishable key
- VITE_PAYMENTS_ENABLED: false

These frontend variables are embedded in the public build. Never add a database password, service_role key, Razorpay Key Secret or webhook secret.

## Hosting

Vercel: import the source repository, choose the frontend root, Vite framework, build command npm run build and output dist. Set the above environment variables and deploy. vercel.json supplies the SPA rewrite.

Netlify: import source with build command npm run build and publish dist, or upload the extracted contents of the static build ZIP through manual deployment. netlify.toml and the built _redirects provide SPA routing.

Sources: https://vercel.com/docs/frameworks/frontend/vite and https://docs.netlify.com/build/configure-builds/javascript-spas/

## Supabase after receiving your HTTPS domain

Set Authentication Site URL to the final HTTPS origin. Add that origin's /login and /reset-password URLs to allowed redirects. Keep localhost redirects while local testing continues. Configure custom SMTP before unrestricted public signup; the default email service is restricted. Owner reports migrations 001–010 applied; do not rerun setup.sql.

No payment functions need publishing while checkout is deferred. When configuring the new Razorpay account, add the deployed origin to server APP_ORIGINS and complete provider acceptance before setting VITE_PAYMENTS_ENABLED=true.

## Required deployed verification

Sign in as customer and admin. Reload direct claim/document/profile URLs. Verify private account access, uploads/downloads, document review notification, password confirmation/recovery emails and mobile layouts. Review public terms/privacy and remaining static or incomplete administration, knowledge, communications and workflow controls. Full specification traceability and acceptance remain unfinished; see DELIVERY_STATUS.md and LIVE_QA.md.

The ZIP contains a frontend already built against the selected Supabase project. It does not contain server secrets or a deployable standalone database. Changing environment variables requires rebuilding the source.
