# SPECCTRL v0.2.2 Media Library

1. Cloudflare Worker `specctrl-media-api`: open **Edit code**, replace Hello World with the contents of `worker.js`, then Deploy. Keep the R2 binding `MEDIA_BUCKET` pointing to `specctrl-media`, and runtime variables `FIREBASE_PROJECT_ID` and `ADMIN_UID`. Do not expose R2 credentials.
2. Verify `https://specctrl-media-api.mratomicgeek.workers.dev/health` returns `ok: true`.
3. Website: run `npm install` and `npm run build`. Upload source files to GitHub (exclude `node_modules`, `.next`, `out`, `.env`). Cloudflare Pages builds from GitHub.
4. Visit `/admin/media/`, sign in, upload a small WebP image, copy its URL, then go to `/admin/cameras/` and edit a camera. Select the uploaded image and save. Check the public camera page.
5. The API accepts cross-origin requests only from `https://specctrl.pages.dev`. If using a custom domain, add its exact origin to `ORIGINS` in `worker.js` and redeploy.
6. Only upload photographs you have permission to use commercially. Do not delete images in use by published cameras.

## Limitations
- Media list currently shows up to 500 objects; pagination is future work.
- Storage usage is an estimate from listed objects, not Cloudflare account-wide billing data. Email and 70%/90% billing alerts are NOT implemented. Configure billing alerts separately in Cloudflare if available.
- Files are validated for type, signature and size (2 MiB). Uploads are not converted to WebP.
- The Worker uses Google's Firebase public JWK endpoint to verify signed ID tokens and checks the admin UID. The public `/images/` endpoint is read-only.
- New image URLs are stored in Firestore, not copied to GitHub.
- Keep a backup of the Worker code and configuration.
