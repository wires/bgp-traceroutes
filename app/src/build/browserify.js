var lazypipe = require("lazypipe");
// var $ = require("gulp-load-plugins");
var gulp = require("gulp");

var $ = {
    browserify: require("gulp-browserify"),
    concat: require("gulp-concat"),
    uglify: require("gulp-uglify")
};


// help gulp-browserify not fail so hard all the time
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

module.exports = function(from, to) {
    return gulp.src(from)
        .pipe($.browserify({
            insertGlobals : false,
            transform: ["reactify"]
        }))
        .on('prebundle', function(bundle) {
            // React Dev Tools tab won't appear unless
            // we expose the react bundle
            bundle.require('react');
        })
        .on('error', handleError)
        .pipe($.concat(to));
        // .pipe($.closureCompiler({
        //   compilerPath: 'bower_components/closure-compiler/lib/vendor/compiler.jar',
        //   fileName: 'bundle.js'
        // }))
        // .pipe($.uglify());
}
