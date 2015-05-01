/*eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import stylish from "jshint-stylish";
import through2 from "through2";
import browserify from "browserify";
import babelify from "babelify";
import isparta from "isparta";
import config from "./config";

var plugins = gulpLoadPlugins();


// Compile JS
gulp.task("js", () => {
    var bundler = through2.obj((file, enc, next) => {
        browserify(file.path)
            .transform(babelify)
            .bundle((err, res) => {
                if (err) {
                    throw err;
                }
                file.contents = res;
                next(null, file);
            });
    });

    return gulp
        .src(path.join(config.dir.es6, "index.js"))
        .pipe(plugins.plumber())
        .pipe(bundler)
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dir.js));
});


// Minify JS and update html references
gulp.task("js-prod", ["js", "modernizr"], () => {
    var manifest = gulp
        .src(path.join(config.dir.js, config.glob.js))
        .pipe(plugins.plumber())
        .pipe(plugins.bytediff.start())
        .pipe(plugins.uglify())
        .pipe(plugins.rev())
        .pipe(plugins.rename({ extname: ".min.js" }))
        .pipe(plugins.bytediff.stop())
        .pipe(gulp.dest(config.dir.assets))
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    return gulp
        .src(path.join(config.dir.html, config.glob.html))
        .pipe(plugins.plumber())
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(config.dir.html));
});


// Lint and code check
gulp.task("js-lint", () => gulp
    .src([
        config.file.gulpfile,
        path.join(config.dir.tasks, config.glob.js),
        path.join(config.dir.es6, config.glob.es6)
    ])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.eslint({ configFile: config.file.esLint, reset: true }))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failOnError())
    .pipe(plugins.jscs({ esnext: true }))
    .pipe(plugins.filter(path.join(config.dir.tasks, config.glob.js)))
    .pipe(plugins.jscpd({
        "min-lines": 5,
        "min-tokens": 70,
        verbose: true
    }))
    .pipe(plugins.plumber.stop())
);


// Tests and coverage
gulp.task("js-test", (cb) => gulp
    .src(path.join(config.dir.es6, config.glob.es6))
    .pipe(plugins.plumber())
    .pipe(plugins.istanbul({
        instrumenter: isparta.Instrumenter,
        includeUntested: true
    }))
    .pipe(plugins.istanbul.hookRequire())
    .on("finish", () => gulp
        .src(path.join("./test", config.glob.es6), { read: false })
        .pipe(plugins.plumber())
        .pipe(plugins.mocha({ reporter: "spec" }))
        .pipe(plugins.istanbul.writeReports({
            dir: config.dir.coverage,
            reportOpts: { dir: config.dir.coverage },
            reporters: ["text", "text-summary", "json", "html"]
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
    .pipe(plugins.plumber.stop())
);
