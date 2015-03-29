var gulp = require('gulp');
var lazypipe = require('lazypipe');
var $ = require("gulp-load-plugins")();

var build = {
    browserify: require("./src/build/browserify"),
    httpserver: require("./src/build/httpserver")
};

// destination
var dest = lazypipe()
    .pipe(gulp.dest, './dist')
    .pipe($.size)
    .pipe($.livereload);

// bundle and minify the JS
gulp.task('scripts', function() {
    return build.browserify('src/js/testme.js', 'bundle.js')
        .pipe(dest());
});

// just copy the HTML
gulp.task('html', function() {
    return gulp.src("src/html/*.html")
        .pipe(dest());
});

gulp.task('copy', function() {
    return gulp.src("node_modules/leaflet/dist/**/*")
        .pipe(dest());
});

// help gulp-browserify not fail so hard all the time
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// process LESS into CSS
gulp.task('style', function() {
    return gulp.src("src/style/main.less")
        .pipe($.less())
        .on('error', handleError)
        .pipe($.autoprefixer({cascade: false, browsers: ['last 2 versions']}))
        .pipe(dest());
});


// full build
gulp.task('build', ['copy', 'scripts', 'html', 'style']);

gulp.task('default', ['build'], function(){
    build.httpserver({app_port: 5005});

    gulp.watch(['src/html/*.html'], ['html']);
    gulp.watch(['src/style/*.less'], ['style']);
    gulp.watch(['src/js/**/*.js'], ['scripts']);
});
