/* eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import streamQueue from "streamqueue";
import browserSync from "browser-sync";
import config from "./config";

const plugins = gulpLoadPlugins();


var errorHandler = function (err) {
    plugins.util.log(err);
    this.emit("end");
};

/*
var buildCss = function () {
    var autoprefixer = require("autoprefixer");
    var mqpacker = require("css-mqpacker");

    var processors = [
        autoprefixer({
            browsers: config.browsers,
            cascade: false
        }),
        mqpacker
    ];

    return gulp.src([
        config.file.normalize,
        path.join(config.dir.src, config.glob.css)
    ])
    .pipe(plugins.plumber({ errorHandler }))
    .pipe(plugins.concat("main.css"))
    .pipe(plugins.postcss(processors))
        //.pipe(plugins.csscomb())
        //.pipe(plugins.minifyCss({ keepSpecialComments: 0 }))
        //.pipe(plugins.csso())
        //.pipe(plugins.cssbeautify({ autosemicolon: true }))
    .pipe(plugins.plumber.stop());
};
*/

var buildSass = function () {
    // Prepend normalize css
    return streamQueue({ objectMode: true })
        .queue(gulp.src(config.file.normalize))
        .queue(
            gulp
                .src(path.join(config.dir.src, config.glob.scss))
                .pipe(plugins.plumber({ errorHandler }))
                .pipe(plugins.sass())
                .pipe(plugins.plumber.stop())
        )
        .done()
        .pipe(plugins.plumber({ errorHandler }))
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
        .pipe(plugins.plumber.stop());
};


// Compile CSS
gulp.task("css:dev", () => {
    return buildSass()
        .pipe(gulp.dest(path.join(config.dir.dev, config.dir.assets)))
        .pipe(browserSync.reload({ stream: true }));
});


// TODO: Uses nunjucks!
// Minify css and update html references
gulp.task("css:dist", () => {
    // Build CSS
    var manifest = buildSass()
        // Minify and save
        .pipe(plugins.plumber({ errorHandler }))
        .pipe(plugins.bytediff.start())
        // TODO: This has dependency on dev build?
        //.pipe(plugins.uncss({
        //    html: [
        //        path.join(config.dir.dist, config.dir.html, config.glob.html),
        //        "!" + path.join(config.dir.dist, config.dir.html, "styleguide", config.glob.html)
        //    ],
        //    ignoreSheets: [/fonts.googleapis/],
        //    ignore: []
        //}))
        .pipe(plugins.csso())
        .pipe(plugins.rev())
        .pipe(plugins.rename({ extname: ".min.css" }))
        .pipe(plugins.bytediff.stop())
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.assets)))

        // Generate manifest
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    // Update HTML
    return gulp
        .src(path.join(config.dir.dist, "view", config.glob.nunj))
        .pipe(plugins.plumber({ errorHandler }))
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(gulp.dest(path.join(config.dir.dist, "view")));
});
