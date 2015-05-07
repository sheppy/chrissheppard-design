/*eslint-env node */

// Enable ES6 support
require("babel/register");

// Fix babel messing up gulp-watch
// https://github.com/babel/babel/issues/489
Object.getPrototypeOf.toString = function () {
    return Object.toString();
};

// Load gulp tasks
require("require-dir")("./tasks");
