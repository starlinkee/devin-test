# devin-test

A small Next.js "hello" app used to demonstrate a dev → preview → production pipeline on Vercel.

## Local development

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run test:e2e       # Playwright; builds and starts the app itself
```

To run the E2E suite against an already deployed URL:

```bash
PLAYWRIGHT_BASE_URL=https://devin-test-git-staging-<team>.vercel.app npm run test:e2e
```

## Authentication

Google sign-in via Auth.js (NextAuth v5). Signed-out visitors see `Hello, world` and a
"Sign in with Google" button; signed-in users see `<their name>, hello`.

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where it comes from |
| --- | --- |
| `AUTH_SECRET` | `npx auth secret` |
| `GOOGLE_CLIENT_ID` | Google Cloud → APIs & Services → Credentials → OAuth 2.0 Web client |
| `GOOGLE_CLIENT_SECRET` | same client |

Set the same three variables in the Vercel project for Production, Preview and Development.
Add every origin the app runs on as an authorized redirect URI on the Google client:

```
http://localhost:3000/api/auth/callback/google
https://<staging-alias>.vercel.app/api/auth/callback/google
https://<production-domain>/api/auth/callback/google
```

Preview deployments get a new URL per branch, so either add the branch alias to the Google
client or test sign-in on the stable staging alias.

## Environments

One Vercel project serves all three environments; there is no separate server per environment.

| Environment | Branch | URL | Purpose |
| --- | --- | --- | --- |
| development | any feature branch | per-PR preview URL from Vercel | fast iteration |
| preview / staging | `staging` | stable branch alias, e.g. `devin-test-git-staging-<team>.vercel.app` | automated E2E + manual testing |
| production | `main` | custom domain | live |

Environment variables are configured per environment in the Vercel project settings
(Production / Preview / Development), so staging can point at staging data.

## Pipeline

1. **Pull request** → `.github/workflows/ci.yml` runs lint, typecheck, build and the Playwright
   suite against a locally built app. Vercel adds a preview deployment for the PR.
2. **Merge into `staging`** → Vercel deploys the preview environment. When that deploy finishes,
   Vercel emits a `deployment_status` event which triggers
   `.github/workflows/e2e-preview.yml`, running Playwright against the live preview URL.
3. **Manual testing** on the staging URL.
4. **Promotion** → run the `Promote to production` workflow (Actions tab → Run workflow, ref
   `staging`). It re-runs the smoke suite against staging and then waits for approval on the
   `production` GitHub Environment before fast-forwarding `main`, which is what Vercel deploys
   to production.

Workflow definitions live in `.github/workflows/`; runs and logs live in the repository's
**Actions** tab.

## One-time setup

### Vercel
1. Import the repository as a Vercel project (framework preset: Next.js).
2. Settings → Git → Production Branch: `main`. Every other branch is automatically a preview.
3. Settings → Git → enable the GitHub deployment integration so `deployment_status` events reach
   GitHub Actions.
4. Add per-environment variables (e.g. `NEXT_PUBLIC_APP_ENV`).
5. Attach the custom domain to production.

### GitHub
1. Settings → Environments → create `production` and add yourself under **Required reviewers**.
   This is the approval gate; without it the promotion workflow deploys unattended.
2. Settings → Variables (or the environment) → add `STAGING_URL` and `PRODUCTION_URL`.
3. Branch protection on `main`: require the CI checks, and allow the promotion workflow to push.
4. Create the long-lived branches:

```bash
git checkout -b dev main && git push -u origin dev
git checkout -b staging main && git push -u origin staging
```
