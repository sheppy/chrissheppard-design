/* eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import fs from "fs";
import _ from "lodash";
import config from "./config";
import CmsContent from "./helpers/CmsContent";

const plugins = gulpLoadPlugins();


var errorHandler = function (err) {
    plugins.util.log(err);
    this.emit("end");
};


var compileHTML = function () {
    var nunjucks = plugins.nunjucksRender.nunjucks.configure([
        config.dir.src
    ], { watch: false, noCache: true });

    nunjucks.addExtension("CmsContent", new CmsContent(nunjucks));

    return gulp
        .src(path.join(config.dir.src, config.dir.pages, config.glob.nunj))
        .pipe(plugins.plumber({ errorHandler }))
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

            return _.extend({}, global, page);
        }))
        .pipe(plugins.nunjucksRender())
        .pipe(plugins.plumber.stop());
};


// Validate HTML
gulp.task("html:lint", () => compileHTML().pipe(plugins.plumber({ errorHandler })).pipe(plugins.html5Lint()));


// Save HTML
gulp.task("html:dev", () => compileHTML().pipe(gulp.dest(config.dir.dev, config.dir.html)));


// Copy nunjucks template to dist directory
gulp.task("html:dist", () =>
    gulp
        .src([
            path.join(config.dir.src, config.glob.nunj),
            "!" + path.join(config.dir.src, "pages", "styleguide", config.glob.nunj),
            "!" + path.join(config.dir.src, "mixins", "_content-for-region-name.nunj"),
            "!" + path.join(config.dir.src, "mixins", "content", config.glob.nunj)
        ])
        .pipe(plugins.plumber({ errorHandler }))
        .pipe(gulp.dest(path.join(config.dir.dist, "view")))
);
