# SPECCTRL v0.1.1 image setup

This release adds responsive camera image slots with a graceful fallback. **It does not include copyrighted manufacturer product photos.**

## Add six authorized product photos

Save licensed/authorized photos as WebP in `public/images/cameras/` with these exact names:

- `sony-a6700.webp`
- `fujifilm-x-s20.webp`
- `canon-eos-r7.webp`
- `nikon-z50-ii.webp`
- `panasonic-s5ii.webp`
- `sony-a7-iv.webp`

Recommended: square or landscape photos, ~1200px on longest edge, ideally below 250 KB. Preserve image license, source URL and required credits.

Camera cards and detail pages will show photos automatically after deployment; until then a labeled fallback appears.

## Deploy

Copy the updated source into your GitHub repository (not `node_modules`, `.next`, or `out`), commit to `main`, and let Cloudflare Pages build with `npm run build`, output `out`.
