/*eslint-env node */

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var stylish = require("jshint-stylish");
var through2 = require("through2");
var browserify = require("browserify");
var babelify = require("babelify");
var config = require("./config");


// Compile JS
gulp.task("js", function () {
    var bundler = through2.obj(function (file, enc, next) {
        browserify(file.path)
            .transform(babelify)
            .bundle(function (err, res) {
                if (err) {
                    throw err;
                }
                file.contents = res;
                next(null, file);
            });
    });

    return gulp.src([config.src.jsEntry])
        .pipe(plugins.plumber())
        .pipe(bundler)
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dist.jsDir));
});


// Minify JS and update html references
gulp.task("js-prod", ["js", "modernizr"], function () {
    return gulp.src(config.dist.html)
        .pipe(plugins.plumber())
        .pipe(plugins.usemin({
            js: [
                plugins.bytediff.start(),
                plugins.uglify(),
                plugins.rev(),
                plugins.rename({ extname: ".min.js" }),
                plugins.bytediff.stop()
            ],
            jsHead: [
                plugins.bytediff.start(),
                plugins.uglify(),
                plugins.rev(),
                plugins.rename({ extname: ".min.js" }),
                plugins.bytediff.stop()
            ]
        }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dist.dir));
});


gulp.task("js-lint", function () {
    return gulp.src([config.src.gulpfile, config.src.tasks, config.src.js])
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish))
        .pipe(plugins.eslint({ configFile: config.src.esLint, reset: true }))
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failOnError())
        .pipe(plugins.jscs({ esnext: true }))
        .pipe(plugins.plumber.stop());
});
