/* eslint-env node */

export default {
    glob: {
        html: "**/*.html",
        nunj: "**/*.nunj",
        css: "**/*.css",
        scss: "**/*.scss",
        js: "**/*.js",
        json: "**/*.json"
    },
    dir: {
        src: "src",
        dist: "public",
        coverage: "coverage",
        pages: "pages",
        layouts: "layouts",
        assets: "assets",
        data: "data",
        html: "",
        tasks: "tasks",
        test: "test"
    },
    file: {
        gulpfile: "./gulpfile.js",
        normalize: "./bower_components/normalize.css/normalize.css",
        esLint: "./.eslintrc"
    },

    browsers: ["last 2 versions"],
    humans: {
        header: "Chris Sheppard",
        team: {
            "Chris Sheppard": {
                Twitter: "@ikiholygoat",
                Website: "http://www.chrissheppard.co.uk/",
                Country: "United Kingdom"
            }
        },
        site: {
            Standards: "HTML5, CSS3",
            Components: "Normalize.css",
            Software: "WebStorm"
        },
        note: "Built with love by Chris Sheppard.",
        out: "./public/humans.txt"
    }
};
