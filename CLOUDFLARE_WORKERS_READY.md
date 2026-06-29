# Cloudflare Workers Deployment Guide

The app is configured for Cloudflare Workers via OpenNext.

## 1) Required Cloudflare setup

1. Create/link a Cloudflare Workers project.
2. Set project name/route in `wrangler.jsonc` if needed.
3. In Cloudflare Dashboard > Workers & Pages > project settings, configure these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MAHABAH_DEV_ADMIN_EMAIL` (optional)
   - `MAHABAH_DEV_ADMIN_PASSWORD` (optional)
4. Add secrets for server-side values in production:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_URL`
   - `MAHABAH_DEV_ADMIN_EMAIL`
   - `MAHABAH_DEV_ADMIN_PASSWORD`

> `NEXT_PUBLIC_*` values are injected during build; keep them in CI environment as well.

## 2) Git-based deploy (recommended)

1. Add GitHub Secrets in the repo:
   - `CF_ACCOUNT_ID`
   - `CF_API_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MAHABAH_DEV_ADMIN_EMAIL` (optional)
   - `MAHABAH_DEV_ADMIN_PASSWORD` (optional)
   - `NEXT_PUBLIC_SUPABASE_URL` (or set as a GitHub variable)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or set as a GitHub variable)
   - `NEXT_PUBLIC_SITE_URL` (or set as a GitHub variable)
2. Push to `main`.
3. Workflow runs `npm run deploy` (`opennextjs-cloudflare build` + `opennextjs-cloudflare deploy`).

You can also use Cloudflare Git integration directly and point build command to:

```bash
npm install && npm run deploy
```

In that case set the same vars/secrets in the project environment there.

## 3) Local worker-style preview

Use:
```bash
npm run preview
```

This builds and runs your app in the Workers runtime locally.

## 4) Useful commands

```bash
npm run preview
npm run deploy
npm run upload
npm run cf:typegen
npm run cf:typegen && npm run verify:backend
```

## 5) Note on repo assets

- `.open-next` and `.wrangler` are ignored.
- `wrangler.jsonc` is tracked and reused by Workers deploys.
