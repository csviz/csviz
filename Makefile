GITHUB_REPO ?= https://$(token):@github.com/csviz/csviz.git

demo.deploy:
	git config user.name 'csviz' && \
	git config user.email 'fraserxu@wiredcraft.com' && \
	git checkout gh-pages && \
	git reset --hard origin/master && \
	cp -r data/tmpData/* data/ && \
	git add -Af data && \
	git config --global push.default matching && \
	git commit -am 'gh-pages update' && \
	git remote add gh $(GITHUB_REPO) && \
	git push --quiet --set-upstream --force gh gh-pages && \
	git checkout master

.PHONY: demo.deploy