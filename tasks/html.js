/* eslint-env node */
/* eslint no-console: 0 */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import fs from "fs";
import _ from "lodash";
import config from "./config";

var plugins = gulpLoadPlugins();

var onError = function (err) {
    console.log(err);
};

var compileHTML = () => gulp
    .src(path.join(config.dir.swig, config.glob.swig))
    .pipe(plugins.plumber({
        errorHandler: onError
    }))
    .pipe(plugins.data(file => {
        // Extend with global data
        var global, page;
        try {
            global = JSON.parse(fs.readFileSync(path.join(config.dir.data, "global.json")));
            page = JSON.parse(fs.readFileSync(
                path.join(config.dir.data, path.basename(file.path, ".swig") + ".json")
            ));
        } catch (e) {
            plugins.util.log(plugins.util.colors.red(e.message));
        }
        return _.extend({}, global, page);
    }))
    .pipe(plugins.swig())
    .pipe(plugins.plumber.stop());


// Validate HTML
gulp.task("html-lint", () =>
    compileHTML()
        .pipe(plugins.plumber())
        .pipe(plugins.html5Lint())
        .pipe(plugins.plumber.stop())
);


// Save HTML
gulp.task("html", () =>
    compileHTML()
        .pipe(gulp.dest(config.dir.html))
);


// Save production HTML
gulp.task("html-prod", () =>
    compileHTML()
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
        .pipe(gulp.dest(config.dir.html))
);
