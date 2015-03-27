/*eslint-env node */

"use strict";

module.exports = {
    dist: {
        dir: "./public",
        html: "./public/**/*.html",
        humans: "./public/humans.txt",
        cssDir: "./public/assets/css"
    },
    src: {
        dir: "./src",
        sass: "./src/assets/scss/*.scss",
        normalize: "./bower_components/normalize.css/normalize.css",
        jade: "./src/templates/pages/**/*.jade",
        dataDir: "./src/data/",
        data: "./src/data/**/*.json",
        dataGlobal: "./src/data/global.json"
    }
};
