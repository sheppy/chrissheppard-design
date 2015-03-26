var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();


// Minify html
gulp.task("prod-html", ["html"], function () {
    return gulp.src("./public/**/*.html")
        .pipe(plugins.plumber())
        .pipe(plugins.htmlmin({
            collapseWhitespace: true,
            preserveLineBreaks: true,
            removeComments: false,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: false,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true
        }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest("./public/"));
});


// Minify css and update html references
gulp.task("prod-css", ["css"], function () {
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
