# SPECCTRL v0.2.8 | Automatic Article Publishing

## What changed
The Article Manager now requests a Cloudflare Pages rebuild after saving, publishing, archiving, or deleting an article. Draft saves also trigger a build for simplicity. The existing media Worker handles `/deploy` using its existing Firebase administrator ID-token verification. A Pages deploy hook is held only as a Worker secret, never in browser code. If deployment triggering fails, the article still saves to Firestore and the admin displays an error.

## One-time setup

1. In Cloudflare **Workers & Pages > SPECCTRL Pages project > Settings > Builds & deployments**, create a **Deploy Hook** for the production branch. Copy its URL. Keep this URL private.
2. In Cloudflare **Workers & Pages > specctrl-media-api Worker > Settings > Variables and Secrets**, add **PAGES_DEPLOY_HOOK** as an encrypted **Secret**, with the full deploy-hook URL as its value. Do not put it in GitHub or frontend code.
3. Ensure existing Worker variables **FIREBASE_PROJECT_ID** and **ADMIN_UID**, and R2 binding **MEDIA_BUCKET**, remain configured. Do not replace or delete them.
4. Replace the existing **specctrl-media-api Worker** source with `worker.js` from this package, then deploy the Worker. Keep the same Worker URL and R2 binding. The `/deploy` route uses the same admin authentication as `/media`.
5. Upload v0.2.8 source files to your GitHub SPECCTRL repository (do not upload `node_modules`, `.next`, `out`, or `.env` files). Wait for Cloudflare Pages to deploy.
6. Verify the Pages **build command** is `npm run build`, the output directory is `out`, and the production branch is correct. `scripts/sync-articles.mjs` must be able to read published Firestore articles from Cloudflare's build environment. It fails the build if it cannot retrieve them.
7. In SPECCTRL Admin, publish a test article. You should see **Cloudflare rebuild requested**. Watch the Pages Deployments tab for a new build and verify the new article URL and `/sitemap.xml` after it succeeds.

## Notes and limitations
- A successful deploy request means the rebuild was queued, **not** that the article is live. Confirm success in Cloudflare Pages.
- Frequent article edits can trigger multiple builds. Cloudflare Pages free-tier build quotas and Worker free-tier limits apply.
- If a Pages deployment does not start, verify the Worker secret, hook URL, Worker deployment, and browser console/network response.
- A GitHub repository upload alone is not needed for subsequent article publications, as long as the Pages build synchronizes published articles directly from Firestore.
- If a new article is absent from the site, inspect the Cloudflare build logs. Do not commit `out/`.
