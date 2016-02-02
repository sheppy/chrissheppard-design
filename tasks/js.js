/* eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import config from "./config";

const plugins = gulpLoadPlugins();


// Build custom modernizr based on css and js
var buildModernizr = function () {
    return gulp
        .src([
            path.join(config.dir.src, config.glob.js),
            path.join(config.dir.src, config.glob.scss)
        ])
        .pipe(plugins.plumber())
        .pipe(plugins.modernizr())
        .pipe(plugins.plumber.stop());
};

// Compile modernizr JS
gulp.task("modernizr:dev", () =>
    buildModernizr()
        .pipe(gulp.dest(path.join(config.dir.dev, config.dir.assets)))
);

gulp.task("modernizr:dist", () => {
    var manifest = buildModernizr()
        .pipe(plugins.plumber())
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uglify())
        .pipe(plugins.rev())
        .pipe(plugins.rename({ extname: ".min.js" }))
        .pipe(plugins.bytediff.stop())
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.assets)))

        // Generate manifest
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    // Update HTML
    return gulp
        .src(path.join(config.dir.dist, "view", config.glob.nunj))
        .pipe(plugins.plumber())
        .pipe(plugins.revReplace({ manifest: manifest, replaceInExtensions: [".nunj"] }))
        .pipe(gulp.dest(path.join(config.dir.dist, "view")));
});
