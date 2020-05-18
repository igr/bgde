compiled=./public/js/app.js

js:
	@gfind ./public/js -type f -name "_*.js" | sort | xargs cat > $(compiled)

html:
	@nunjucks '**/*.njk' site.json -p src -o public
