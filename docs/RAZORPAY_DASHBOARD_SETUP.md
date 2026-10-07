# Razorpay test setup through dashboards

Current checkpoint: customer invoice is saved, but Razorpay server functions and secrets are not configured. No successful test checkout has been verified.

## 1. Generate test keys privately

Open https://dashboard.razorpay.com and create/sign in to your account. Select **Test Mode**, then **Account & Settings → Website and app settings → API Keys → Generate Key**. Save the Key ID and Key Secret privately. The app accepts only IDs starting with `rzp_test_`.

Do not send secrets in chat or place them in the frontend. Follow Razorpay's actual onboarding prompts; do not invent business information.

Source: https://razorpay.com/docs/payments/dashboard/account-settings/api-keys/

## 2. Supabase server secrets

In project rmkcdtjvuhdczxivjmgy, open Edge Functions → Secrets. Add:

| Name | Value |
| --- | --- |
| RAZORPAY_KEY_ID | The generated test Key ID |
| RAZORPAY_KEY_SECRET | The generated test Key Secret |
| RAZORPAY_WEBHOOK_SECRET | A separate private random secret, reused for the Razorpay webhook |
| APP_ORIGINS | http://127.0.0.1:5173,http://localhost:5173 |

Supabase provides its own server environment variables. Do not replace or paste a service_role key into frontend files.

Source: https://supabase.com/docs/guides/functions/secrets

## 3. Deploy prepared functions

The canonical functions are in supabase/functions. Generated single-file copies for the dashboard editor are in supabase/dashboard-functions. Regenerate with `node scripts/prepare-dashboard-functions.mjs` after changing the canonical functions.

In Supabase Edge Functions, choose **Deploy a new function → Via Editor**:

1. Name the first function **payments**. Replace the editor's index.ts contents with supabase/dashboard-functions/payments.ts and deploy. It checks the user session and active profile itself before accessing invoices.
2. Name the second function **payment-webhook**. Replace index.ts with supabase/dashboard-functions/payment-webhook.ts and deploy. Disable gateway JWT verification for this webhook, because Razorpay authenticates with its HMAC signature rather than a Supabase session. The function rejects invalid signatures.

If gateway JWT verification rejects valid customer sessions on payments, report the exact non-secret error before changing settings. No checkout should be recorded as paid until the provider is verified.

Source: https://supabase.com/docs/guides/functions/quickstart-dashboard

## 4. Razorpay webhook and acceptance

Create a Test Mode webhook for:

`https://rmkcdtjvuhdczxivjmgy.supabase.co/functions/v1/payment-webhook`

Use the same private RAZORPAY_WEBHOOK_SECRET and subscribe to payment.captured. Configure automatic capture for this test integration.

Then test the separate customer's labelled INR 100 invoice: successful test payment, cancellation, failure, reload and duplicate webhook delivery. Confirm invoice and payment status are recorded only once. Keep Test Mode throughout these checks.

This is a setup guide, not evidence that deployment or checkout has passed. Real refunds and live payment processing remain unavailable.
