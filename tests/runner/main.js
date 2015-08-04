'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var glob = require('globby').sync;
var join = require('path').join;
var fs = require('fs');
var Mocha = require('mocha');

var mainWindow = null;
const RE_JS = /\.js$/;

function addTest(path, mocha) {
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
        var index_file = join(path, 'index.html');
        if (fs.existsSync(index_file)) {
            // TODO
            return;
        } else {
            for (const f of glob(join(path, '*'))) {
                addTest(f, mocha);
            }
            return;
        }
    } else if (stats.isFile() && RE_JS.test(path)) {
        mocha.addFile(path);
    }
}

app.on('ready', function() {
    let mocha = new Mocha();
    for (const path of process.argv.slice(2)) {
        addTest(path, mocha);
    }
    mocha.ui('bdd').run(function(failures) {
        process.on('exit', function() {
            process.exit(failures);
        });
        app.quit();
    });
});