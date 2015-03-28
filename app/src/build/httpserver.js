var _ = require("lodash");

var livereload = require("gulp-livereload");
var express = require("express");
var connectLR = require('connect-livereload');
var path = require("path");

// don't think this actually works
livereload.options.debug = true;

// TODO use https://github.com/cloudhead/node-static ?

// quick and dirty live reload
module.exports = function asyncStartHTTP(options) {

    // create random port for live-reload server
    var r = Math.floor(Math.random()*10000) + 30000;

    // defaults
    var opts = _.defaults(options, {
        app_port: 3004,
        livereload_port: r,
        rootPath: 'dist/',
        middlewares: []
    });

    opts.callback = opts.callback || function onSuccess() {
        console.log(
            'App server started at http://localhost:' + opts.app_port,
            '\n\t~> LR server http://localhost:' + opts.livereload_port);
    }

    // content
    var e = express()
        .use(connectLR({port: opts.livereload_port}))
        .use(express.static(path.resolve(opts.rootPath)));

    // add middlewares
    e = _.reduce(opts.middlewares, function(accum, middleware) {
            return accum.use(middleware)
        }, e);

    // start server
    e.listen(opts.app_port, opts.callback);

    // start livereload server
    livereload.listen(opts.livereload_port);
};
