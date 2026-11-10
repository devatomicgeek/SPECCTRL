# SPECCTRL Camera Edition · v0.1.0

A responsive camera-research and comparison website built with **Next.js 14, TypeScript and Tailwind CSS**. Slate & Cobalt theme, dark/light switch, six camera profiles, searchable filters, photo/video comparison and four introductory editorial guides.

## Run locally

1. Install Node.js 20 LTS or newer.
2. Extract the ZIP and open the project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.
6. Run `npm run build` to generate the static site in `out/`.

## Deploy for free with GitHub + Cloudflare Pages

1. Create a GitHub repository and upload **the extracted project files**, not the ZIP.
2. Sign in to Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git** (menu labels may vary).
3. Select the GitHub repository.
4. Build command: `npm run build`.
5. Build output directory: `out`.
6. Set environment variable `NODE_VERSION` to `20` if Cloudflare's build environment needs it.
7. Deploy. A free `*.pages.dev` URL is assigned, subject to availability.

This project uses **static export** and does not require Firebase, server functions or paid hosting. Free-plan quotas and terms apply. A custom domain costs extra. Avoid GitHub Pages repository subpath deployment unless configuring `basePath`.

## Editorial and monetization safeguards

- All camera images are **CSS illustrations/placeholders**, not manufacturer product photography. Replace with properly licensed images before launch.
- Specs are **starter research data** and require verification against current manufacturer sources.
- No fabricated lab scores, prices, hands-on claims, retailer offers or affiliate links.
- Guides are introductory original drafts; expand with independently verified details, citations, original insight and human editing before seeking AdSense approval.
- Create About, Contact, Privacy Policy, Cookie information where applicable and Affiliate Disclosure pages before monetization.
- AdSense and affiliate approval are never guaranteed. Hosting does not itself imply approval.

## Editing content

- `lib/data.ts`: cameras and article metadata.
- `lib/articleBody.ts`: guide article text.
- `app/globals.css`: colors and global styles.
- `components/Shell.tsx`: navigation and theme toggle.

## Planned next releases

v0.2.0: Mobile-friendly CMS / Firebase integration (within free-tier limits). v0.3.0: More detailed comparison taxonomy and editorial source references. v0.4.0: Lens compatibility. v0.5.0: Affiliate links and monetization compliance.
