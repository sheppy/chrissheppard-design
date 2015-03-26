var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamqueue = require("streamqueue");


// Compile CSS
gulp.task("css", function () {
    var stream = streamqueue({ objectMode: true });
    stream.queue(gulp.src("./bower_components/normalize.css/normalize.css"));
    stream.queue(
        gulp.src("./src/assets/scss/*.scss")
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
        .pipe(gulp.dest("./public/assets/css"));
});


// Minify css and update html references
gulp.task("css-prod", ["css"], function () {
    return gulp.src("./public/**/*.html")
        .pipe(plugins.plumber())
        .pipe(plugins.usemin({
            css: [
                plugins.bytediff.start(),
                plugins.uncss({
                    html: ["./public/**/*.html"],
                    ignore: []
                }),
                plugins.csso(),
                plugins.rev(),
                plugins.rename({ extname: ".min.css" }),
                plugins.bytediff.stop()
            ]
        }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest("./public/"));
});
