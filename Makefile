install: 
	npm --prefix ./frontend ci

start:
	npx --prefix ./frontend start-server -s ./frontend/dist

dev:
	npm --prefix ./frontend run dev

build:
	npm --prefix ./frontend run build