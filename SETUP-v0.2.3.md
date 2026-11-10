# SPECCTRL v0.2.3 — Article Publishing

1. Install dependencies: `npm install` then `npm run build`.
2. Upload updated source to GitHub (do not upload `node_modules`, `.next`, `out` or secrets).
3. In Firebase Console → Firestore Database → Rules, verify the included `firestore.rules` is published. It already contains `/articles/{id}` permissions. Do not loosen rules to public writes.
4. Open `/admin/articles/` as the configured Firebase admin. Create an article, save as draft and preview the saved draft.
5. Publish, then visit `/guides/` and click the new article. Confirm it appears in a private/incognito browser.
6. Test unpublishing and deletion using a test article.

Media: use `/admin/media/` to upload a featured image and copy its URL into the article editor. Existing camera images remain untouched; migrate them individually after verifying each new URL.

Static-export limitation: Firestore articles use `/guides/view/?slug=...`. The SEO fields are stored but do not yet generate per-article HTML metadata. Search indexing of these pages requires a future pre-rendering/server rendering upgrade. Plain text paragraphs are supported; rich-text formatting is not included. Built-in guides remain available.

Security: Firestore rules restrict writes to the configured admin UID and public reads to published records. The admin preview is wrapped in AdminGate.
