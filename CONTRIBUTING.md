## Setup

`bun install` (installs `tailwindcss` and `@tailwindcss/cli` as dev dependencies). This is the same toolchain the deploy pipeline (`.github/workflows/ghPages.yml`) uses.


## Generate developer Tailwindcss build:

`bun run build:dev`

This will produce all classes used by Tailwindcss, unminified.


## Generate production Tailwindcss build:

`bun run build`

This will produce classes only used in code (files are specified in `./tailwind.config.js`) and minify the resulting css. This is what the deploy pipeline runs on every push to `master`, so committing a rebuilt `build.css` is only needed for local previews (opening the HTML files directly reads `build.css` from disk).
