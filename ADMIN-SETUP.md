# TEAM website: admin and content setup

This explains how to switch on the admin area, keep associate consultants saved
permanently, and edit the rest of the site's content. Allow about an hour.

## 1. Turn on the admin login (required)

The admin area is at **/admin** (there is also an "Admin login" link in the footer).

1. Choose a strong password, then run:
   `node scripts/hash-password.mjs "your-password"`
2. Add these to your hosting environment variables (and `.env.local` for local use):
   - `ADMIN_EMAIL` – the email you will log in with
   - `ADMIN_PASSWORD_HASH` – the value printed in step 1 (not the password itself)
   - `ADMIN_JWT_SECRET` – 32+ random characters:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Redeploy. Log in at /admin/login. Sessions last 8 hours; five wrong attempts
   lock that address out for 15 minutes.

## 2. Save associates permanently

The **Associates** tab adds, edits, publishes, hides and deletes associate
consultants. Published associates appear on the Leadership page within a minute.
Four drafts from the company profile are preloaded and stay hidden until you
publish them; add a biography and photo first.

Where they are saved depends on your hosting:

| Hosting | Without Sanity | With Sanity |
| --- | --- | --- |
| Your own server (`npm start`) | Saved in `data/associates.json` and `data/uploads/` – back these up | Saved in Sanity |
| Vercel and similar | **Not saved** – the admin shows a warning | Saved in Sanity |

To connect Sanity (free tier is enough):
1. Create a project at sanity.io/manage. Note its **Project ID**.
2. In the project, add an API token with **Editor** permissions.
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`
   and `SANITY_API_TOKEN`. Add your website address under the project's CORS origins.
4. Redeploy. The Associates tab will say "Saved to Sanity".

## 3. Edit everything else (TEAM Studio)

The `studio/` folder is a ready-made editor for services, case stories, FAQs,
partners, articles, team members and settings.

1. `cd studio && npm install`
2. `npm run seed` copies the current site content into Sanity (run once).
3. `npm run deploy` publishes the editor at an address like `team-consulting.sanity.studio`.
4. Set `NEXT_PUBLIC_SANITY_STUDIO_URL` to that address. The admin's
   "Website content" tab then shows an "Open TEAM Studio" button.

Invite colleagues from sanity.io/manage → Members; they log in with their own accounts.

## 4. Make enquiries reach you (required)

Set `WEB3FORMS_ACCESS_KEY` in your hosting environment and in `.env.local` for local
development. The key must be linked to `info@team.co.zw`; it is used only by the
server-side contact API and must not be prefixed with `NEXT_PUBLIC_`.

The contact form keeps its server-side rate limit and honeypot spam checks. Event
notifications use `SUBMISSION_PROVIDER=resend` with `RESEND_API_KEY` and a verified
`RESEND_FROM`, or `SUBMISSION_PROVIDER=sendgrid` with `SENDGRID_API_KEY`. The event
notification recipient is `ADMIN_NOTIFICATION_EMAIL` (which defaults to `ADMIN_EMAIL`).

## 5. Configure shared rate limiting (required in production)

The contact, event, diagnostic, newsletter and admin-login endpoints share a persistent
Upstash Redis rate-limit store in production. To configure it on Vercel:

1. Create an Upstash Redis database and copy its REST URL and REST token.
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as sensitive environment
   variables for every Vercel environment that serves the site (Production and Preview).
3. Redeploy so the functions receive both values. Vercel supplies its `VERCEL=1` marker
   and sanitized `x-vercel-forwarded-for` client-IP header automatically; do not set or
   trust caller-provided forwarding headers.

Existing limits are preserved: contact and event registration allow 5 requests per
minute, admin login 5 per 15 minutes, diagnostics 3 per minute (or 3 per 2 minutes for
the report endpoint), and newsletter subscriptions 3 per minute. Redis uses atomic
fixed-window operations; the request identity is stored as a SHA-256 hash, not a raw IP.

If the store or trusted Vercel IP header is missing/unavailable in production, these
endpoints fail closed with HTTP 503. They never fall back to process memory in production.
Store requests time out after 2.5 seconds and then fail closed. Local development without
Upstash uses a development-only in-memory store.

After deployment, send six malformed contact requests from the same client within one
minute: the first five should fail validation with HTTP 400 and the sixth should return
HTTP 429 with `Retry-After`. This does not invoke Web3Forms. Repeat one request from a
second function instance or after a restart and confirm the shared counter still applies.
