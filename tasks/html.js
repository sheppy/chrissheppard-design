/* eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import fs from "fs";
import _ from "lodash";
import config from "./config";

var plugins = gulpLoadPlugins();

var onError = function (err) {
    plugins.util.log(err);
    this.emit("end");
};

var compileHTML = function () {
    plugins.nunjucksRender.nunjucks.configure([
        config.dir.src
    ], { watch: false });

    return gulp
        .src(path.join(config.dir.src, config.dir.pages, config.glob.nunj))
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.data(file => {
            // Extend with global data
            var page, global = {};

            try {
                global = JSON.parse(fs.readFileSync(path.join(config.dir.src, config.dir.data, "global.json")));
                page = JSON.parse(fs.readFileSync(
                    path.join(config.dir.src, config.dir.data, path.basename(file.path, ".nunj") + ".json")
                ));
            } catch (e) {
                plugins.util.log(plugins.util.colors.yellow(e.message));
            }

            // global.components = fs.readdirSync(path.join(config.dir.src, "components"))
            //    .filter(f => fs.statSync(path.join(config.dir.src, "components", f)).isDirectory());

            return _.extend({}, global, page);
        }))
        .pipe(plugins.nunjucksRender())
        .pipe(plugins.plumber.stop());
};

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
        .pipe(gulp.dest(config.dir.dist, config.dir.html))
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
