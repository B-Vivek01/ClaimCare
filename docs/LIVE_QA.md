# Live QA checkpoint — 6 October 2026

Environment: local frontend at http://127.0.0.1:5173 connected to Supabase project rmkcdtjvuhdczxivjmgy. All created policy, claim, file and invoice content is explicitly synthetic QA data. No real insurance adjudication, payment or external support reply was performed.

## Observed successes

| Flow | Evidence |
| --- | --- |
| Owner registration, confirmation and administrator access | Owner confirmed email and opened administrator dashboard; signed in manually in testing browser. |
| Policy create and reload | QA-TEST-20261006-001 retained its dates, premium and coverage. See qa/policy-persisted.jpg. |
| Claim draft, submission, assignment and internal note | CC-2026-71816 persisted; assigned to the signed-in administrator; staff note retained. See qa/claim-reviewed.jpg. |
| Claim closure | Closure checklist and synthetic notes persisted. Migration 009 applied by owner; live claim now shows Closed, 100%, Claim review is complete, with review/escalation actions disabled. See qa/claim-closed.jpg. |
| Private file upload and download | qa-claim-note.txt uploaded against the claim; downloaded signed file SHA-256 matched the fixture byte-for-byte. |
| File replacement | Version 2 persisted after reload; version 1 retained; review reset to Pending. See qa/document-versioned.jpg. |
| Staff document review | Original synthetic document accepted via authenticated staff action. Replacement requires fresh review. |
| Contact submission and support resolution | QA TEST — Support inbox validation saved; staff status Closed and internal note persisted after reload. No email sent. See qa/support-resolved.jpg. |
| Staff invoice creation | INV-cc5242ce-1708-4a87-9151-5621ae36a0d0 saved for separate test customer, INR 100, Pending. See qa/invoice-created.jpg. This is not evidence of a paid checkout. |

## Customer browser access checks

The separate customer signed in manually. Visiting /admin redirected to /dashboard. Direct URLs to the administrator-owned sample claim and document showed Claim Not Found and Document Not Found. The customer saw their own INR 100 invoice without the staff invoice-creation form. See qa/customer-claim-denied.jpg and qa/customer-invoice.jpg. This verifies these browser flows; independent direct API and second-customer storage tests still remain.

## Fixes found during these tests

- Claim wizard Next returned to the saved step because its effect depended on a new claim object each render. Effect now follows scalar draft identifier and saved step.
- Submitted/closed claims had misleading progress and next-step text. Frontend mapping and migration 009 now derive these fields from status. Database rejects direct closed/rejected status changes except a reopen request.
- Document replacement carried forward review metadata. New versions now clear reviewer, time and reason and reset review to Pending.
- Rapid profile preference writes could overwrite prior changes. Serialized writes now compute each update against the latest committed setting; failed writes do not stop later writes.
- Assignment/priority controls could display stale initial values. They now reflect persisted claim values and disable while saving.
- Invoice creation lacked visible success confirmation and unnamed test profiles produced blank customer names. Added confirmation and email fallback.
- A checkout script loaded without its expected global could permanently prevent retries. Failed loads now reset the loader.

## Checks and remaining acceptance

Production build passes. Seven automated tests pass, including actual PostgreSQL ownership, revision, profile role, support/identity review and payment assertions, signature tampering and serialized preference writes. Lint has zero errors and ten Fast Refresh export warnings.

Still pending: broader customer isolation and direct API ownership tests, real Razorpay test capture/cancellation/webhook replay, image/PDF preview, customer reopen flow, recovery email completion, disabled/expired sessions, deployed/mobile/accessibility tests and full specification traceability. Local SQL tests do not replace these live checks.

Migrations 001–009 have been applied by the owner. Combined setup.sql includes them for future empty projects only; do not rerun it on this project.

Keep these labelled QA records for review until cleanup is agreed. Do not use them for business reporting or insurance decisions.

## Customer workflow follow-up

Customer account c2d268f1-11ab-4ed7-90dc-9acc9942300b created policy QA-CUSTOMER-20261006-001 (POL-e4a33d9b-3937-4b5b-9968-a1fc9375f541), submitted claim CC-2026-36747 (CLM-8f62b598-eb3d-4909-bc24-ef09f00ba720), and reloaded it successfully with Submitted status and 25% progress. See qa/customer-claim-submitted.jpg.

Private image qa-synthetic-image.png (DOC-1791281316336-n87yk) uploaded linked to that claim and rendered visually. Signed download SHA-256 matched the fixture: A2F7C98F0B73BBFE3379B77583A01C0BFE174ACA6121DC9AA76B931176E127D2. See qa/customer-image-preview.jpg.

Administrator staff rejection of this fictional image persisted after reload with the QA correction reason. Rejection without a reason is disabled. Review reason is now rendered for the owner in document details; customer-session verification is pending. See qa/customer-document-rejected.jpg.

Synthetic closure of the customer claim persisted at Closed, 100%, with disabled direct status-change actions. No actual insurance outcome or payment. Customer reopen and replacement remain pending. See qa/customer-claim-closed.jpg.

Further fixes: signed-in navigation now shows Dashboard/My profile; policy associated claims derive from actual same-owner claim records and link to detail (qa/policy-linked-claim.jpg); unknown claim amount is not represented as zero; wizard navigation/submission disables while saving; customer dashboard uses shared reactive profile and actual policy/claim summaries rather than independent one-time profile lookup and empty placeholders. Full dashboard task/activity implementation is still incomplete.

Razorpay setup explicitly deferred by owner; do not connect their existing account. A new account will be configured later. Checkout remains unavailable until server configuration and acceptance tests.

7 October: Customer reopen request was observed at Reopen Requested, 25%, with staff-review next-step text. Browser reconnection is currently blocked by URL security policy; customer replacement and notification browser checks require manual verification. Migration 010 adds document review notifications; cloud application pending. Razorpay remains deferred.

7 October follow-up: Owner reported migration 010 applied. Owner screenshot confirms document DOC-1791281316336-n87yk at version 3, Pending, with retained versions 1 (PNG) and 2 (TXT), and both previous-version download controls. This is screenshot-based manual acceptance; historical downloads and post-010 staff review notification remain unverified live.

Notification actions now return their persistence promises; opening a notification waits for Read status to save before navigation. Failed saves show an error, and bulk/delete controls disable during saves. Closure rating buttons disable for customers because this screen cannot persist customer feedback; the full feedback flow remains unfinished. Closure success wording now covers reopen requests. Browser testing remains blocked by the earlier URL-policy rejection; no alternate browser workaround was used.

Deployment preparation: Added Vercel/Netlify SPA routing, disabled unconfigured Razorpay checkout by default, replaced staff-only customer report link with own-account report/export, made custom report success await persistence, replaced fabricated system uptime with on-demand probes, and derived six-month claim trends from actual records. Build and seven tests pass; lint zero errors with ten export warnings. Static ZIP release/claimcare-website-2026-10-07.zip verified to contain index.html and _redirects, without private configuration. Not published; browser/deployed acceptance and remaining feature gaps are still pending.
