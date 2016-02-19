/* eslint-env node */

import path from "path";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import browserSync from "browser-sync";
import mqpacker from "css-mqpacker";
import cssNano from "cssnano";
import mdCss from "mdcss";
import config from "./config";

const plugins = gulpLoadPlugins();
const postCss = gulpLoadPlugins({
    pattern: ["postcss-*", "postcss.*"],
    replaceString: /^postcss(-|\.)/
});

var errorHandler = function (err) {
    plugins.util.log(err);
    this.emit("end");
};


var buildCss = function () {
    let cssProcessors = [
        postCss.partialImport({
            extension: "scss"
        }),
        postCss.nested(),
        postCss.simpleVars(),
        postCss.colorFunction(),
        postCss.propertyLookup(),
        mqpacker(),
        // TODO: Only do this sometimes?
        mdCss({
            destination: path.join(config.dir.dev, "styleguide"),
            examples: {
                css: [
                    "../assets/css/main.css",
                    "https://fonts.googleapis.com/css?family=Lora|Crimson+Text:600"
                ]
            }
        }),
        cssNano({
            minifyFontValues: { removeQuotes: false },
            autoprefixer: { browsers: config.browsers },
            calc: { precision: 3 }
        }),
        postCss.reporter({
            clearMessages: true
        })
    ];

    return gulp.src([
        path.join(config.dir.src, config.glob.scss),
        "!" + config.glob.scssPartial
    ])
    .pipe(plugins.plumber({ errorHandler }))
        .pipe(plugins.postcss(cssProcessors, { syntax: postCss.scss }))
    .pipe(plugins.rename({
        extname: ".css"
    }))
    .pipe(plugins.csscomb())
    .pipe(plugins.minifyCss({ keepSpecialComments: 0 }))
    .pipe(plugins.csso())
    .pipe(plugins.cssbeautify({ autosemicolon: true }))
    .pipe(plugins.plumber.stop());
};


// Compile CSS
gulp.task("css:dev", () => {
    return buildCss()
        .pipe(gulp.dest(path.join(config.dir.dev, config.dir.assets)))
        .pipe(browserSync.reload({ stream: true }));
});


// TODO: Uses nunjucks!
// Minify css and update html references
gulp.task("css:dist", () => {
    // Build CSS
    var manifest = buildCss()
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
        .pipe(gulp.dest(path.join(config.dir.dist, "public", config.dir.assets, "css")))

        // Generate manifest
        .pipe(plugins.rev.manifest())
        .pipe(plugins.plumber.stop());

    // Update HTML
    return gulp
        .src(path.join(config.dir.dist, "view", config.glob.nunj))
        .pipe(plugins.plumber({ errorHandler }))
        .pipe(plugins.revReplace({ manifest: manifest, replaceInExtensions: [".nunj"] }))
        .pipe(gulp.dest(path.join(config.dir.dist, "view")));
});
