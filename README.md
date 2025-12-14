# EduNexis Starter

Minimal Next.js + TypeScript starter for EduNexis using Supabase and Stripe Checkout.

## Features
- Next.js frontend with Tailwind CSS
- Supabase for Auth + Postgres + Storage
- Stripe Checkout (hosted) for payments
- YouTube lesson playback
- Webhook handler to record enrollments/payments

## Quick start (local)

1. Clone:
   git clone <your-repo-url>
   cd edunexis-starter
   npm install

2. Create a Supabase project:
   - Note your SUPABASE_URL and SUPABASE_ANON_KEY
   - Create a "Service Role" key (SUPABASE_SERVICE_ROLE_KEY)
   - Run the SQL in `db/schema.sql` in the Supabase SQL editor.

3. Create a Stripe account (test mode) and get:
   - STRIPE_SECRET_KEY
   - STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET (will be generated when you run stripe listen)

4. Create a .env.local file using `.env.example` and fill values:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - NEXT_PUBLIC_BASE_URL (e.g., http://localhost:3000)

5. Start app:
   npm run dev
   Open http://localhost:3000

6. Test Stripe webhooks (local):
   Install Stripe CLI: https://stripe.com/docs/stripe-cli
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   Copy the webhook signing secret into .env.local as STRIPE_WEBHOOK_SECRET

## Deploy
- Push to GitHub and connect the repo to Vercel.
- Set the same env vars in Vercel (including SUPABASE_SERVICE_ROLE_KEY and STRIPE_*).
- Deploy to production.

## Notes & next tasks
- Authentication flows: this scaffold assumes basic Supabase Auth. You'll want protected pages and server-side checks for enrollments.
- Enrollment flow: free-course enrollments currently need client-side auth flow to create enrollment. Paid flow records an enrollment on webhook; improve by linking checkout to authenticated users.
- Deadline handling: add course.deadline_days and set enrollment.access_expires_at at purchase time.
- Improve UX, add instructor admin pages, and secure server endpoints.

If you want, I can:
- Push this scaffold to a GitHub repo for you (tell me the repo name & owner).
- Extend the scaffold to implement authenticated enrollment flows (so the webhook links to the correct user).
- Add a simple instructor dashboard (create/edit courses and lessons).

Tell me which of those you'd like next.
# EduNexis.LMS
Online Platform for Students 
