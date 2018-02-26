.PHONY: setup build

all: build

build: setup
	web-ext build --overwrite-dest

setup: extlib/webextensions-lib-l10n/l10n.js
	git submodule update
	cp extlib/webextensions-lib-l10n/l10n.js ./

extlib/webextensions-lib-l10n/l10n.js:
	git submodule update --init

