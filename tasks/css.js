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

// Compile CSS
gulp.task("css", () => {
    // Prepend normalize css
    var stream = streamQueue({ objectMode: true });
    stream.queue(gulp.src(config.file.normalize));
    stream.queue(
        gulp
            .src(path.join(config.dir.src, config.glob.scss))
            .pipe(plugins.plumber({ errorHandler }))
            .pipe(plugins.sass())
            .pipe(plugins.plumber.stop())
    );

    return stream.done()
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
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.assets)))
        .pipe(browserSync.reload({ stream: true }));
});


// Minify css and update html references
gulp.task("css-prod", ["css"], () => {
    var manifest = gulp
        .src(path.join(config.dir.css, config.glob.css))
        .pipe(plugins.plumber({ errorHandler }))
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uncss({
            html: [path.join(config.dir.html, config.glob.html)],
            ignore: []
        }))
        .pipe(plugins.csso())
        .pipe(plugins.rev())
        .pipe(plugins.rename({ extname: ".min.css" }))
        .pipe(plugins.bytediff.stop())
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.assets)))
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    return gulp
        .src(path.join(config.dir.html, config.glob.html))
        .pipe(plugins.plumber({ errorHandler }))
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.html)));
});
