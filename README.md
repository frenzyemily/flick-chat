# Flick — chat, but brighter 💜

A mobile-first Next.js + Supabase foundation for the Flick messaging app. It includes the Flick UI, account registration/sign-in, profile setup, conversation creation, persistent messages, live message subscriptions, presence, uploads, and a starter database security policy set.

## Important status

This is a **deployable starter**, not a finished WhatsApp replacement. It does not yet implement end-to-end encryption, real voice/video calls, push notifications, full group member invitations, stories, channel/community publishing, read receipts, message reactions, offline outbox/sync, AI provider calls, or production-grade media authorization. The UI must never imply those features are live until implemented and tested. The security SQL is a starting point and needs a professional review before handling sensitive or large-scale traffic.

## Requirements

- Node.js 20+
- A Supabase project
- A hosting account such as Vercel (or another Next.js-compatible host)

## Run locally

1. Install Node.js 20 or later.
2. Extract this folder and open a terminal in it.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. In Supabase, create a project and copy the Project URL and anon/public key into `.env.local`.
6. Open Supabase **SQL Editor**, paste and run `supabase/schema.sql`.
7. In Supabase Authentication settings, configure the site URL and allowed redirect URLs for local development (`http://localhost:3000`) and your deployed domain.
8. Run `npm run dev` and open `http://localhost:3000`.

If email confirmation is enabled, confirm your email before signing in. For production, configure SMTP rather than relying on development email limits.

## Deploy to Vercel

1. Create a private Git repository and push this project.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables for Preview and Production.
4. Deploy.
5. Add the final deployment domain to Supabase Authentication's Site URL and Redirect URLs.
6. Run the SQL schema in the production Supabase project and test with two separate accounts.

A hosting account and project credentials are required. This source bundle does not itself publish a public website.

## Security checklist before real users

- Have a security engineer review all RLS policies, especially conversation creation, membership management, and media access.
- Implement a server-side membership invitation flow. Do not expose service-role credentials in the browser.
- Implement true end-to-end encryption with audited libraries and a key lifecycle before claiming E2EE. TLS and database RLS are not E2EE.
- Use private media storage with short-lived signed URLs and verify conversation membership on every download.
- Add rate limits, spam/abuse reporting, blocking, account deletion/export, retention controls, and moderation flows.
- Add message delivery/read receipt tables and enforce them server-side.
- Implement WebRTC signaling, TURN servers, permissions, and call lifecycle handling before showing calls as functional.
- Connect AI through server-side routes, protect provider keys, and obtain consent before sending private chat content to a model.
- Add automated tests, observability, backups, migration strategy, accessibility testing, and load/security testing.
- Configure CSP, secure headers, SMTP, OAuth providers if needed, and production redirect URLs.
- The initial attachment helper uploads to private storage but currently uses a public URL shape; update it to use signed URLs before enabling media in production.

## Stack

- Next.js App Router + React + TypeScript
- Supabase Auth, Postgres, Realtime, and Storage
- Responsive UI built with custom CSS and Lucide icons

## Commands

- `npm run dev` — local development
- `npm run build` — production build
- `npm start` — serve the production build
