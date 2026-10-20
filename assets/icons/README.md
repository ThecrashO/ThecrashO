# ThecrashO app icons

The white emblem and black background come from the owner's supplied artwork.
`logo-source.png` preserves the original file. Production icons use a centered
480-by-480 crop of the 640-by-640 source, resized without redrawing the emblem.

## Files

- `app-icon-512.png`: opaque square master and large web-app icon.
- `app-icon-192.png`: opaque square web-app icon.
- `app-icon-maskable-512.png`: opaque square with the emblem inside the central
  mask-safe area for Android launcher shapes.
- `apple-touch-icon.png`: opaque 180-by-180 Home Screen icon.
- `favicon-32.png` and `favicon-16.png`: browser tab icons.
- `app-icon-rounded-preview.png`: rounded-corner visual preview only; not the
  installed launcher asset.

Production Home Screen icons intentionally have full square backgrounds. The
operating system applies its own rounded-square or other launcher mask so there
are no transparent gaps or doubled rounded corners. No service worker or offline
cache is introduced by this icon update.

## Rounded preview prompt

Mode: built-in imagegen edit. The rounded preview is separate from the production
icons so the source emblem remains exact in installed icons.

Use case: precise-object-edit. Asset type: rounded mobile web-app icon preview.
Input image 1 is the edit target and the sole logo source. Preserve the exact
white geometric emblem: its chamfered outer square, rounded inner cutout,
diagonal opening at upper right, proportions, orientation, and restrained
original white glow. Do not reinterpret or redraw the mark. Change only the
outside black tile silhouette into an iPhone-style continuous rounded square
(squircle), not an Apple logo. Center the existing emblem at approximately 54%
of the square canvas width, with ample black padding. Flat straight-on single
icon, approximately 1024 by 1024 canvas. Tile is opaque near-black; only the four
outside corner cutouts are genuinely transparent. Keep the logo white and black
background, with no added colors, border, text, badges, reflections, drop shadow
outside the tile, perspective, device frame, or extra objects.
