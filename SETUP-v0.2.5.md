# SPECCTRL v0.2.5: SEO and reading experience

## What changed
- Published Firestore articles are fetched during `npm run build` and exported as real static HTML at `/guides/<slug>/`.
- Each exported article gets a unique SEO title, description, canonical URL, Open Graph tags, and Article structured data.
- Static sitemap and robots.txt are generated.
- Automatic linked table of contents for articles using Markdown headings (`## Heading` / `### Heading`).
- Improved responsive article typography.
- Existing `/guides/view/?slug=...` continues to work for compatibility, but it is NOT the canonical SEO URL.

## Deployment steps
1. Back up v0.2.4 and copy v0.2.5 source files to your repository. Do not upload `node_modules`, `.next`, or `out`.
2. Run `npm install` and `npm run build` on your Mac. The build requires internet access to Firestore and must print `SPECCTRL: exported N published articles to static pages.` (N should be at least 1).
3. If the export fails with HTTP 403, check your Firestore rules and ensure published articles can be queried anonymously with `where status == published`. Do NOT make drafts public or weaken write rules.
4. Upload to GitHub. Cloudflare Pages build command: `npm run build`; output directory: `out`.
5. Check `/guides/sony-a6700-review-2026/`, `/sitemap.xml`, and `/robots.txt` on the live domain. Use View Page Source to confirm the article text is in the HTML before JavaScript runs.
6. After verification, add your site to Google Search Console and submit `https://specctrl.pages.dev/sitemap.xml`.

## Important operational details
- New or edited published articles appear in static SEO pages **only after a new Cloudflare Pages build**. The old `/guides/view/?slug=...` route updates live through Firestore.
- For every article publish or update, trigger a new deployment (e.g., a GitHub commit or Cloudflare Pages Deploy Hook). A future version can automate this securely.
- Firestore public access is restricted to published articles. No service-account key is required or stored in GitHub.
- Existing article content is unchanged. Add Markdown headings to enable the table of contents.
- The base domain is currently `specctrl.pages.dev`. Update sitemap, canonical and schema URLs when moving to a custom domain.
- Existing old URLs are not automatically redirected; keep them working until redirects can be deployed safely.
