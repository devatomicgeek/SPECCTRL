# SPECCTRL v0.2.1 setup

1. Replace the existing GitHub source files with this release, **preserving your existing `public/images/cameras/*.webp` files**. Do not upload `node_modules`, `.next`, or `out`.
2. In Firebase Console > Firestore Database > Rules, publish the included `firestore.rules` (same admin UID restriction).
3. On your Mac, from the extracted project folder run `npm install` then `npm run build`. Only upload if the build succeeds.
4. Commit to GitHub `main`. Cloudflare Pages should deploy automatically; verify the latest deployment status.
5. Visit `/admin/`, sign in, click **Camera management**, then **Import six starter cameras** ONCE. This import only works when the cameras collection is empty and does not upload images.
6. Edit a camera, save draft or publish, and visit `/cameras/` to check the published data.

## Important limitations

- Cloudflare Pages static export cannot generate a new `/cameras/<slug>/` page without a rebuild. New camera links use `/cameras/view/?slug=<slug>` instead. Existing six `/cameras/<slug>/` pages remain available and read updated Firestore content after hydration.
- Public catalog, comparison and camera detail content is client-loaded. This is not an SEO-complete solution. A later release should implement server-rendered/indexable pages or a build-time publishing pipeline.
- The homepage featured cards remain based on the original bundled camera data.
- Images are not uploaded through this version. Set the image URL or use `/images/cameras/<slug>.webp` for already-uploaded assets.
- Drafts are not returned by public Firestore queries; public reads are restricted to published records.
- If Firestore is empty or unavailable, the catalog uses the bundled starter cameras. Once Firestore contains records, those become authoritative.
- Deletion is permanent. Use Draft to hide a camera without deleting it.
- Review dependency security audit findings before production use.

Build verification could not be completed in the packaging environment because package installation timed out. Run `npm install` and `npm run build` locally before uploading.
