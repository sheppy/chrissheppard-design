/*eslint-env node */

var path = require("path");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamqueue = require("streamqueue");
var browserSync = require("browser-sync");
var config = require("./config");


// Compile CSS
gulp.task("css", function () {
    var stream = streamqueue({ objectMode: true });
    stream.queue(gulp.src(config.filePath.normalize));
    stream.queue(
        gulp
            .src(path.join(config.dir.scss, config.glob.scss))
            .pipe(plugins.plumber())
            .pipe(plugins.sass())
            .pipe(plugins.plumber.stop())
    );

    return stream.done()
        .pipe(plugins.plumber())
        .pipe(plugins.concat("main.css"))
        .pipe(plugins.autoprefixer({
            browsers: config.browsers,
            cascade: false
        }))
        .pipe(plugins.csscomb())
        .pipe(plugins.combineMq({ beautify: false }))
        .pipe(plugins.minifyCss({ keepSpecialComments: 0 }))
        .pipe(plugins.csso())
        .pipe(plugins.cssbeautify({ autosemicolon: true }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dir.css))
        .pipe(browserSync.reload({ stream: true }));
});


// Minify css and update html references
gulp.task("css-prod", ["css"], function () {
    var manifest = gulp
        .src(path.join(config.dir.css, config.glob.css))
        .pipe(plugins.plumber())
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uncss({
            html: [path.join(config.dir.html, config.glob.html)],
            ignore: []
        }))
        .pipe(plugins.csso())
        .pipe(plugins.rev())
        .pipe(plugins.rename({ extname: ".min.css" }))
        .pipe(plugins.bytediff.stop())
        .pipe(gulp.dest(config.dir.css))
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    return gulp
        .src(path.join(config.dir.html, config.glob.html))
        .pipe(plugins.plumber())
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dir.html));
});
