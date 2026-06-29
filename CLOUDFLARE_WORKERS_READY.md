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
3. Push behavior:
   - `main` and `master` branch: `bun run deploy` (`opennextjs-cloudflare build` + `opennextjs-cloudflare deploy`).
   - Other branches: `bun run upload` for preview-style branch deployments.
4. You can manually trigger the workflow from GitHub Actions -> Run workflow.

You can also use Cloudflare Git integration directly and point build command to:

```bash
bun install --frozen-lockfile && bun run deploy
```

In that case set the same vars/secrets in the project environment there.

### Cloudflare Build & Deploy UI (alternative)

If you are using Cloudflare's dashboard auto-deploy instead of GitHub Actions, use:
- Production branch: `main`
- Build command: `bun install --frozen-lockfile && bun run build`
- Deploy command: `bun run deploy`
- Non-production branch deploy command: `bun run upload`
- Deploy environment variables: same list as above.

If branch auto-deploy is enabled for non-production, every push to non-production branches will run `bun run upload`.

## 3) Local worker-style preview

Use:
```bash
bun run preview
```

This builds and runs your app in the Workers runtime locally.

## 4) Useful commands

```bash
bun install --frozen-lockfile
bun run build
bun run deploy
bun run upload
bun run cf:typegen
bun run verify:backend
```

## 5) Note on repo assets

- `.open-next` and `.wrangler` are ignored.
- `wrangler.jsonc` is tracked and reused by Workers deploys.
