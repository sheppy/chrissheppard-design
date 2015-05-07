/* global Modernizr */

export default class Router {
    constructor() {
        this.reset();
    }

    reset() {
        this.routes = [];
        this.root = "";
        return this;
    }

    cleanSlashes(path) {
        // Fix multiple slashes
        path = path.replace(/\/+/g, "/");

        if (path === "/") {
            return path;
        }

        return path.toString().replace(/\/+$/, "");
    }

    getFragment() {
        var fragment = this.cleanSlashes(decodeURI(location.pathname));
        fragment = fragment.replace(this.root, "");
        return this.cleanSlashes(fragment);
    }

    add(path, handler) {
        if (typeof path === "function") {
            handler = path;
            path = "";
        }
        this.routes.push({ path: path, handler: handler });
        return this;
    }

    remove(param) {
        for (var i = 0; i < this.routes.length; i += 1) {
            var r = this.routes[i];
            if (r.handler === param || r.path.toString() === param.toString()) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    }

    check(fragment) {
        fragment = fragment || this.getFragment();

        var keys, match, routeParams;

        this.routes.find(function (route) {
            routeParams = {};
            keys = route.path.match(/:([^\/]+)/g);
            match = fragment.match(new RegExp(route.path.replace(/:([^\/]+)/g, "([^\/]*)")));

            if (match) {
                match.shift();
                match.forEach(function (value, i) {
                    routeParams[keys[i].replace(":", "")] = value;
                });
                route.handler.call({}, routeParams);
            }

            return match;
        });

        return this;
    }

    navigate(path) {
        path = path ? path : "";
        path = this.cleanSlashes(this.root + path);
        history.pushState(null, null, path);
        return this.check(path);
    }

    listen() {
        if (Modernizr.history) {
            window.addEventListener("popstate", this.check.bind(this));
        }

        return this;
    }
}
