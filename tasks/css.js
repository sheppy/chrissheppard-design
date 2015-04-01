/*eslint-env node */

var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamqueue = require("streamqueue");
var browserSync = require("browser-sync");
var config = require("./config");


// Compile CSS
gulp.task("css", function () {
    var stream = streamqueue({ objectMode: true });
    stream.queue(gulp.src(config.src.normalize));
    stream.queue(
        gulp.src(config.src.sass)
            .pipe(plugins.plumber())
            .pipe(plugins.sass())
            .pipe(plugins.plumber.stop())
    );

    return stream.done()
        .pipe(plugins.plumber())
        .pipe(plugins.concat("main.css"))
        .pipe(plugins.autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(plugins.csscomb())
        .pipe(plugins.combineMq({ beautify: false }))
        .pipe(plugins.minifyCss({ keepSpecialComments: 0 }))
        .pipe(plugins.csso())
        .pipe(plugins.cssbeautify({ autosemicolon: true }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dist.cssDir))
        .pipe(browserSync.reload({ stream: true }));
});


// Minify css and update html references
gulp.task("css-prod", ["css"], function () {
    var manifest = gulp.src(config.dist.css)
        .pipe(plugins.plumber())
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uncss({
            html: [config.dist.html],
            ignore: []
        }))
        .pipe(plugins.csso())
        .pipe(plugins.rev())
        .pipe(plugins.rename({ extname: ".min.css" }))
        .pipe(plugins.bytediff.stop())
        .pipe(gulp.dest(config.dist.cssDir))
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    return gulp.src(config.dist.html)
        .pipe(plugins.plumber())
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dist.dir));
});
