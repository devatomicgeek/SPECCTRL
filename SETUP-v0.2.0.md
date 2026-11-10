# SPECCTRL v0.2.0 setup

## What this release does
- Adds `/admin/` with Firebase Email/Password sign-in and an admin UID check.
- Adds an overview and navigation for future camera, media, article, comparison, affiliate, and settings modules.
- Does **not** yet implement editing, image upload, article publishing, or Firestore content reads/writes.
- Keeps the existing static public website and images. The ZIP does **not** include your existing camera photos. Keep your GitHub `public/images/cameras/` files.

## 1. Firebase Authentication
- In Firebase Console > Authentication > Sign-in method, enable Email/Password.
- In Authentication > Users, confirm the account UID is `GaHncpEvYkXIGxtJJOCYFjbWGZH2`.
- In Authentication > Settings > Authorized domains, add your actual Cloudflare Pages hostname (without https://), and any custom domain. Firebase may require this even if email/password works on localhost.

## 2. Firestore rules
- Open Firebase Console > Firestore Database > Rules.
- Paste the included `firestore.rules` and click **Publish**.
- These rules allow anonymous reads only for published camera/article documents, and allow the admin account to read/write all documents. Any other collection is admin-only.
- These are starter rules. Add schema validation and carefully scoped permissions before implementing content writes.

## 3. Deploy
- Copy source updates to your GitHub repo, preserving existing camera photos.
- Run `npm install` locally to install Firebase and generate/update `package-lock.json`; commit the lockfile if you use it.
- Run `npm run build` and verify the output includes `out/admin/index.html`.
- Push to `main`. Cloudflare Pages: build command `npm run build`, output directory `out`.
- Visit `https://YOUR-DOMAIN/admin/` and sign in with the Firebase admin email/password. Never share the password.

## Security and limitations
- The Firebase web API key is public configuration, not a secret. Authorization depends on Firestore rules and Firebase Authentication, not on hiding the admin page.
- The admin page is client-side protected; its HTML and JS are publicly downloadable. Do not put secrets in frontend code.
- No Firestore collections or content are created by v0.2.0.
- This package has not been verified by a successful production build in this environment; check your local/Cloudflare build logs.
