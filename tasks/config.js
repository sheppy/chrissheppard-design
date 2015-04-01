/*eslint-env node */

module.exports = {
    dist: {
        dir: "./public",
        html: "./public/**/*.html",
        humans: "./public/humans.txt",
        cssDir: "./public/assets/css",
        css: "./public/assets/css/**/*.css",
        jsDir: "./public/assets/js",
        js: "./public/assets/**/*.js",
        assetsDir: "./public/assets"
    },
    src: {
        dir: "./src",
        sass: "./src/assets/scss/**/*.scss",
        normalize: "./bower_components/normalize.css/normalize.css",
        jade: "./src/templates/pages/**/*.jade",
        dataDir: "./src/data/",
        data: "./src/data/**/*.json",
        dataGlobal: "./src/data/global.json",
        js: "./src/assets/js/**/*.js",
        jsEntry: "./src/assets/js/main.js",
        tasks: "./tasks/*.js",
        gulpfile: "./gulpfile.js",
        esLint: "./.eslintrc"
    }
};
