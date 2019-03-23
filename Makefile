.PHONY: prepare build

all: build

build: prepare
	web-ext build --overwrite-dest

prepare: extlib/webextensions-lib-l10n/l10n.js
	git submodule update
	cp extlib/webextensions-lib-l10n/l10n.js ./src

extlib/webextensions-lib-l10n/l10n.js:
	git submodule update --init

