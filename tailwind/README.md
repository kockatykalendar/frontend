## Generate developer Tailwindcss build:

`npx tailwindcss build tailwind.css > app.css`

This will produce all classes used by Tailwindcss.


## Generate production Tailwindcss build:

`npx tailwindcss build tailwind.css -c tailwind.config.prod.js | npx clean-css-cli > app.css`

This will produce classes only used in code(files are specified in `./tailwind.config.prod.js`) and minify the resulting css.
