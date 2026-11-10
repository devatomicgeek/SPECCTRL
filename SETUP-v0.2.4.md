# SPECCTRL v0.2.4

## Included
- Article editor formatting buttons: headings, subheadings, bold, italic, lists, links, and inline images.
- Live preview of unsaved article edits.
- Public article and admin draft viewer render the same safe formatting.
- No database schema changes or Firestore rule changes required.
- Existing articles remain readable. To turn old uppercase section titles into headings, edit their lines to begin with `## ` and separate headings with blank lines.

## Deploy
1. Back up the current GitHub repository.
2. Replace project source files with this release (do not upload `node_modules`, `.next`, or `out`).
3. Run `npm install` and `npm run build` locally.
4. Commit and push to GitHub. Cloudflare Pages builds from GitHub.
5. Open Admin > Articles, edit a draft, test formatting and preview, then save.

## SEO limitation
This release does NOT make Firestore article bodies server-rendered or individually indexable. Static Pages still uses the shared `/guides/view/?slug=...` route. Do not assume the SEO title and description fields become per-article HTML metadata. That requires a separate deployment architecture/SEO phase.

## Safety
Only HTTPS and same-site root-relative links/images are rendered as links or images. The editor does not accept raw HTML.
