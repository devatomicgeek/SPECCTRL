# SPECCTRL v0.2.7 — Article management

## Changes
- Admin dashboard includes all Firestore articles, including drafts, published, and archived.
- One-time **Import sample guides** action imports the four legacy starter articles as editable **drafts**, without overwriting existing Firestore articles. Review content before publishing.
- Added Archive action and archived status. Archived content is excluded from the public Firestore catalog and next static build. Permanent delete remains available.
- Formatting toolbar supports headings, bold, italic, bullets, numbered lists, links and images.
- Added an unsaved live article-body preview and a dropdown for inserting links to other published articles.
- Existing per-article SEO title, description, canonical URL, Open Graph and Article JSON-LD remain intact.

## Deploy
1. Back up the current GitHub project and Firestore data.
2. Replace project source files with this ZIP's contents, excluding local build artifacts.
3. Run `npm install` and `npm run build` from the project directory. A network connection is needed for the Firestore article export.
4. Commit/push to GitHub, then check the Cloudflare Pages deployment succeeds.
5. Open Admin > Articles. Click **Import sample guides** once, then review and publish each draft as appropriate.
6. After publishing, archiving, or deleting articles, trigger another Cloudflare build to refresh static article URLs and sitemap.

## Important limits
- Import is opt-in; starter guides do not appear in Firestore until you click the button.
- A Firestore publication change alone does not create a new static article page. Rebuild/redeploy after editorial changes.
- Archives hide articles from the client-side catalog, but their old static pages can remain reachable until the next successful deployment.
- Search Console may take time to refresh after sitemap changes.
