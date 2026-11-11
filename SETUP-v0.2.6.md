# SPECCTRL v0.2.6 — Deployment and article migration

## What changed
- Public article cards now link to clean `/guides/<slug>/` URLs.
- The four old hard-coded sample guides are no longer hard-coded public content. They can be imported into Firestore as editable **drafts** using **Admin → Articles → Import sample guides**.
- The public sitemap and static article pages are generated only from **published** Firestore articles during `npm run build`.
- Published article pages include SEO metadata, canonical URLs, and Article structured data.

## Deploy
1. Back up your existing GitHub repository first.
2. Upload the updated project source to GitHub, replacing existing files. Do not upload `node_modules`, `.next`, or `out`.
3. In Cloudflare Pages, confirm the build command is `npm run build` and output directory is `out`. The build must be able to read public published articles from Firestore.
4. After the deployment succeeds, open `/admin/articles/`, click **Import sample guides**, and review the imported drafts. Do not publish unverified research as original hands-on testing.
5. Publish only the guides you want visible, then trigger a new Cloudflare Pages deployment to generate their static URLs and sitemap entries.
6. To remove a published guide, delete it in Admin, then redeploy. Its static HTML will disappear from the new build. The old URL may still remain in Google's index temporarily.
7. Check `/sitemap.xml` and the clean article URL after each deployment. Google Search Console may take time to re-fetch the sitemap.

## Important
Firestore content changes are live in the admin interface, but static HTML and the sitemap only change when the project rebuilds. This version does not add automatic deployment triggers. Old query-string article URLs remain as a compatibility view, not the preferred canonical URLs.
