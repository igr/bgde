compiled=./public/js/app.js

compile:
	@gfind ./public/js -type f -name "_*.js" | sort | xargs cat > $(compiled)
