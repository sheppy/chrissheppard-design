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
        dataGlobal: "./src/data/global.json"
    }
};
