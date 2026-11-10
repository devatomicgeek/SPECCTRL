# SPECCTRL v0.1.2

- Default dark mode for new visitors; saved light/dark choice respected on return.
- Graphite & Electric Ice design tokens, updated cards, borders, accents and buttons.
- Homepage hero uses `/images/cameras/sony-a6700.webp` instead of CSS camera artwork.
- Camera card photo containers no longer draw decorative camera shapes over images.
- Mobile hero layout retains full photo using `object-fit: contain`.

## Important
The ZIP does not contain licensed manufacturer photos. If you already uploaded them to GitHub, **keep your existing `public/images/cameras/*.webp` files**. Do not delete them when updating the source.

To deploy: update source files in GitHub, preserving existing image assets; Cloudflare Pages builds from `npm run build` and publishes `out`.
