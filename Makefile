install: 
	npm --prefix ./frontend ci

start:
	npx --prefix ./frontend start-server -s ./frontend/dist
	
build:
	npm --prefix ./frontend run build