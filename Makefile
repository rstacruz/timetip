# Development notes:
#
#   * install ronn (gem install ronn)
#   * `make` will rebuild man files
#   * `make deploy` will deploy site
#   * `man ./man/timetip.1` to view the man page
#
all: \
	man/timetip.1 \
	www/timetip.1.html

man/%: man/%.md
	ronn $<

www/%.html: man/%
	mv $<.html $@

deploy:
	git subtree push --prefix www origin gh-pages

.PHONY: man deploy
