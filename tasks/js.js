/* eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import jsHintStylish from "jshint-stylish";
import jscsStylish from "jscs-stylish";
import through2 from "through2";
import browserify from "browserify";
import babelify from "babelify";
import {Instrumenter} from "isparta";
import bundleCollapser from "bundle-collapser/plugin";
import streamQueue from "streamqueue";
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


// Build JS
var buildJs = function (isProd = false) {
    return gulp
        .src(path.join(config.dir.src, config.dir.assets, config.dir.js, "index.js"))
        .pipe(plugins.plumber())
        .pipe(through2.obj((file, enc, next) => {
            browserify(file.path, {
                // bundleExternal: false,
                debug: !isProd
            })
                .transform(babelify, {
                    presets: ["es2015"]
                })
                .plugin(bundleCollapser)
                .bundle((err, res) => {
                    if (err) {
                        return next(err);
                    }
                    file.contents = res;
                    next(null, file);
                });
        }))
        .pipe(plugins.plumber.stop());
};


// Compile dev JS
gulp.task("js", () => buildJs(false).pipe(gulp.dest(path.join(config.dir.dist, config.dir.assets))));


// Compile modernizr JS
gulp.task("modernizr", () => buildModernizr().pipe(gulp.dest(path.join(config.dir.dist, config.dir.assets))));


// Minify JS and update html references
gulp.task("js-prod", () => {
    let manifest = streamQueue({ objectMode: true })
        // Build JS and Modernizr
        .queue(buildModernizr())
        .queue(buildJs(true))
        .done()

        // Minify and save
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
        .src(path.join(config.dir.dist, config.dir.html, config.glob.html))
        .pipe(plugins.plumber())
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.html)));
});


// Lint and code check
gulp.task("js-lint", () => gulp
    .src([
        config.file.gulpfile,
        path.join(config.dir.src, config.glob.js),
        path.join(config.dir.test, config.glob.js),
        path.join(config.dir.tasks, config.glob.js)
    ])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(jsHintStylish))
    .pipe(plugins.eslint({
        configFile: config.file.esLint,
        reset: true
    }))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failOnError())
    .pipe(plugins.jscs({
        esnext: true,
        reporter: jscsStylish
    }))
    .pipe(plugins.filter(path.join(config.dir.tasks, config.glob.js)))
    .pipe(plugins.jscpd({
        "min-lines": 5,
        "min-tokens": 70,
        verbose: true
    }))
);


// Tests and coverage
gulp.task("js-test", (cb) => gulp
    .src(path.join(config.dir.src, config.glob.js))
    .pipe(plugins.plumber())
    .pipe(plugins.istanbul({
        instrumenter: Instrumenter,
        includeUntested: true
    }))
    .pipe(plugins.istanbul.hookRequire())
    .on("finish", () => gulp
        .src(path.join(config.dir.test, config.glob.js), { read: false })
        .pipe(plugins.plumber())
        .pipe(plugins.mocha({ reporter: "spec" }))
        .pipe(plugins.istanbul.writeReports({
            dir: config.dir.coverage,
            reportOpts: { dir: config.dir.coverage },
            reporters: ["text-summary", "json", "html"]
        }))
        .pipe(plugins.istanbulEnforcer({
            thresholds: {
                statements: 80,
                branches: 50,
                lines: 75,
                functions: 50
            },
            coverageDirectory: config.dir.coverage,
            rootDirectory: ""
        }))
        .pipe(plugins.plumber.stop())
        .on("end", cb)
    )
);
