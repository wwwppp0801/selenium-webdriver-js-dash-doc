#!/bin/sh
#npm install
rm -rf selenium-webdriver-js.docset
mkdir -p selenium-webdriver-js.docset/Contents/Resources/Documents/
cp -r node_modules/selenium-webdriver/docs/*  selenium-webdriver-js.docset/Contents/Resources/Documents/
cp Info.plist selenium-webdriver-js.docset/Contents/
sqlite3 selenium-webdriver-js.docset/Contents/Resources/docSet.dsidx <<END
CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);
CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);
END
node types.js
tar czf dist/selenium-webdriver-js.docset.tgz selenium-webdriver-js.docset
