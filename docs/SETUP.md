# ClaimCare setup checkpoint

The backend is Supabase; payment checkout is restricted to Razorpay test keys. The frontend is connected to project `rmkcdtjvuhdczxivjmgy`. The owner ran the SQL setup successfully. Live API checks confirm profiles, records, audit_events, payment_orders and support_requests exist and reject anonymous reads. Edge functions have not been deployed. Use test data until acceptance testing is complete.

## 1. Create Supabase

1. Sign in at https://supabase.com/dashboard and create a project named ClaimCare in an Indian region. Keep the database password private.
2. In the project's Connect dialog or API settings, copy its Project URL and publishable key. These public identifiers may be shared with the developer. Never share the secret/service_role key or database password in chat.
3. Copy `.env.example` to `.env.local`, fill in those two values, then restart `npm run dev -- --host 127.0.0.1`.
4. In SQL Editor, run `supabase/setup.sql` **once against a new, empty project**. It creates tables, private file storage, access rules and database functions. Existing installations should apply only unapplied numbered migrations in order. Do not rerun the combined script on an existing database.
5. Under Authentication URL settings, set Site URL to `http://127.0.0.1:5173`. Add `http://127.0.0.1:5173/login` and `http://127.0.0.1:5173/reset-password`, plus their localhost equivalents, to allowed redirect URLs. Configure the final HTTPS domain before deployment.
6. Enable Email/Password sign-in. Configure custom SMTP for signup confirmations, password emails and email changes. Supabase's default email service is restricted and is not suitable for unrestricted customer signup. SMS verification requires a separate configured phone provider.
7. Optional: enable Realtime on `records` and `profiles`. The application also polls, so basic persistence works without Realtime.

## 2. Establish test roles

Register and confirm distinct customer, operations and administrator test accounts. Every signup starts as customer; a browser cannot grant itself staff access.

After confirming the intended email, run this in SQL Editor for the first administrator:

```sql
update public.profiles
set data = data || '{"role":"admin"}'::jsonb
where id = (select id from auth.users where email = 'YOUR_ADMIN_TEST_EMAIL');
```

Use the same query with `operations` for the operations test account. Refresh or sign in again. Keep a second customer account for isolation testing.

## 3. Connect Razorpay test checkout

1. Create or sign in to your Razorpay account and select Test Mode. Generate test API keys. Do not put the key secret in frontend environment variables or chat.
2. Copy `supabase/functions/secrets.env.example` to `supabase/functions/secrets.env.local` and fill it locally. Use a separate webhook secret. The file is ignored by Git.
3. With the Supabase CLI authenticated and linked to the intended project, run from this frontend directory:

```text
supabase secrets set --env-file supabase/functions/secrets.env.local
supabase functions deploy payments
supabase functions deploy payment-webhook --no-verify-jwt
```

The functions use Supabase's server-provided URL, anon key and service_role key. `payments` independently verifies the signed-in user. The webhook verifies Razorpay's signature and does not use user authentication.

4. Configure a Razorpay Test Mode webhook at `https://YOUR_PROJECT_REF.supabase.co/functions/v1/payment-webhook`, subscribe to `payment.captured`, and set the same webhook secret. Enable automatic capture for the test integration.
5. As staff, create an invoice for the customer in Invoices. Sign in as that customer and open Payment. Test success, cancellation and provider failure. Reload both invoice and payment history. An invoice is marked paid only after server-side signature, ownership, amount and captured-status checks.

No actual refund execution or live payments are implemented. A refund request is a stored request pending an operational process.

## 4. Hosting and verification

Build with `npm run build`; publish `dist` with SPA fallback to `index.html` on a hosting provider selected by the owner. Add the deployed origin to `APP_ORIGINS`, Authentication redirect settings and frontend environment configuration. Never publish server secrets.

Run the acceptance checklist in `docs/DELIVERY_STATUS.md` with real test accounts before declaring delivery complete. Public privacy and terms pages are development drafts requiring operator review.
