# Development notes:
#
#   * install ronn (gem install ronn)
#   * `make` will rebuild man files
#   * `make deploy` will deploy site
#
all: \
	man/timetip.1 \
	man/timetip-extras.1 \
	www/timetip.1.html \
	www/timetip-extras.1.html

man/%.1: man/%.1.md
	ronn $<

www/%.1.html: man/%.1
	mv $<.html $@

man: man/timetip.1
	man $<

deploy:
	git subtree push --prefix www git@github.com:rstacruz/timetip.git gh-pages

.PHONY: man deploy
