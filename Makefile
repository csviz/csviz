GITHUB_REPO ?= https://$(token):@github.com/csviz/csviz.git

demo.deploy:
	git config user.name 'csviz on codeship' && \
	git config user.email 'fraserxu@wiredcraft.com' && \
	git config --global push.default matching && \
	git checkout -b gh-pages && \
	git reset --hard origin/master && \
	npm install && \
	npm run build && \
	cp -r data/tmpData/* data/ && \
	git add -Af data build && \
	git commit -am 'gh-pages update' && \
	git remote set-url origin $(GITHUB_REPO) && \
	git push -ufq origin gh-pages

.PHONY: demo.deploy