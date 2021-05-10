## Install requirements

`npm install tailwindcss@2.1.2 autoprefixer@10.2.5 --no-save`


## Generate developer Tailwindcss build:

`npx tailwindcss-cli build tailwind.css -o build.css`

This will produce all classes used by Tailwindcss.


## Generate production Tailwindcss build:

	cat tailwind.css custom.css > tailwind.temp.css
	npx tailwindcss-cli build tailwind.temp.css -c tailwind.config.prod.js -o build.css
	npx clean-css-cli build.css -o build.min.css

This will produce classes only used in code (files are specified in `./tailwind.config.prod.js`) and minify the resulting css.
