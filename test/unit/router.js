/* global global, describe, it, beforeEach, afterEach */
/* eslint no-unused-expressions: 0 */
/* jslint -W030, -W071 */

import _ from "lodash";
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.should();
chai.use(sinonChai);

import Router from "../../src/assets/js/core/router";


describe("Router", function () {
    beforeEach(() => {
        sinon.stub(Router.prototype, "reset");
        this.router = new Router();
        Router.prototype.reset.restore();
    });

    afterEach(() => {
        this.router = null;
    });


    describe("#constructor()", () => {
        beforeEach(() => {
            sinon.stub(Router.prototype, "reset");
        });

        afterEach(() => {
            Router.prototype.reset.restore();
        });

        it("resets the router", () => {
            this.router = new Router();
            Router.prototype.reset.should.have.been.called;
        });
    });


    describe("#reset()", () => {
        it("clears the routes", () => {
            this.router.routes = [1, 2, 3];
            this.router.reset();
            this.router.routes.length.should.equal(0);
        });

        it("clears the root", () => {
            this.router.root = "abc";
            this.router.reset();
            this.router.root.should.equal("");
        });

        it("returns the router", () => {
            this.router.reset().should.equal(this.router);
        });
    });


    describe("#cleanSlashes()", () => {
        var tests = [
            { input: "no-leading/slash", output: "no-leading/slash" },
            { input: "/leading/slash", output: "/leading/slash" },
            { input: "///lots-leading/slash", output: "/lots-leading/slash" },
            { input: "/", output: "/" },
            { input: "no-trailing/slash", output: "no-trailing/slash" },
            { input: "trailing/slash/", output: "trailing/slash" },
            { input: "lots-trailing/slash///", output: "lots-trailing/slash" },
            { input: "no/slash", output: "no/slash" },
            { input: "/has/slash/", output: "/has/slash" },
            { input: "///lots////slash///", output: "/lots/slash" },
            { input: "/////", output: "/" }
        ];

        tests.forEach((test) => {
            it(`fixes the slashes of ${test.input}`, () => {
                this.router.cleanSlashes(test.input).should.equal(test.output);
            });
        });
    });


    describe("#getFragment()", () => {
        var tests = [
            { input: "", output: "", root: "" },
            { input: "/asdasd/asd", output: "/asdasd/asd", root: "" },
            { input: "%22%C2%A3%25%5E", output: "\"£%^", root: "" },
            { input: "/", output: "/", root: "" },
            { input: "/", output: "", root: "/" },
            { input: "/asdasd/asd", output: "/asd", root: "/asdasd" },
            { input: "/test/%22%C2%A3%25%5E", output: "\"£%^", root: "/test/" },
            { input: "/a", output: "a", root: "/" }
        ];

        tests.forEach((test) => {
            it(`returns the fragment ${test.output} from ${test.root}${test.input}`, () => {
                global.location = {
                    pathname: test.input
                };
                this.router.root = test.root;
                this.router.getFragment().should.equal(test.output);
            });
        });
    });


    describe("#add()", () => {
        var handler;

        beforeEach(() => {
            this.router.routes = [];
            handler = _.noop;
        });

        it("adds the given route", () => {
            this.router.add("/test", handler);
            this.router.routes.length.should.equal(1);
            this.router.routes[0].path.should.equal("/test");
            this.router.routes[0].handler.should.equal(handler);
        });

        it("adds the given route defaulting path to ''", () => {
            this.router.add(handler);
            this.router.routes.length.should.equal(1);
            this.router.routes[0].path.should.equal("");
            this.router.routes[0].handler.should.equal(handler);
        });

        it("adds multiple routes", () => {
            this.router.add("/test", handler);
            this.router.add("/test2", handler);
            this.router.add("/test3", handler);
            this.router.routes.length.should.equal(3);
        });

        it("returns the router", () => {
            this.router.add("/testing", handler).should.equal(this.router);
        });
    });


    describe("#remove()", () => {
        var routes;

        beforeEach(() => {
            routes = [
                { path: "/test1", handler: null },
                { path: "/test2", handler: _.noop },
                { path: "/test3", handler: null }
            ];

            this.router.routes = _.extend([], routes);
        });

        it("removes a route based on path", () => {
            this.router.remove("/test1");
            this.router.routes.length.should.equal(2);
            this.router.routes[0].should.equal(routes[1]);
            this.router.routes[1].should.equal(routes[2]);
        });

        it("removes a route based on handler", () => {
            this.router.remove(_.noop);
            this.router.routes.length.should.equal(2);
            this.router.routes[0].should.equal(routes[0]);
            this.router.routes[1].should.equal(routes[2]);
        });

        it("does nothing in no matching route found", () => {
            this.router.remove("/404");
            this.router.routes.length.should.equal(3);
        });

        it("removes routes leaving empty array if none remaining", () => {
            this.router.remove("/test1");
            this.router.remove("/test2");
            this.router.remove("/test3");
            this.router.routes.length.should.equal(0);
        });

        it("returns the router", () => {
            this.router.remove("/test1").should.equal(this.router);
        });
    });


    describe("#check()", () => {
        beforeEach(() => {
            sinon.stub(this.router, "getFragment").returns("/d-e");

            this.router.routes = [
                { path: "/a", handler: sinon.spy() },
                { path: "/b/c", handler: sinon.spy() },
                { path: "/d-e", handler: sinon.spy() },
                { path: "/f/:test/g", handler: sinon.spy() }
            ];
        });

        afterEach(() => {
            this.router.getFragment.restore();
        });

        it("does not error if there are no routes", () => {
            this.router.routes = [];
            this.router.check("/test");
        });

        it("does not call the route handler when route is not matched", () => {
            this.router.check("/test");
            this.router.routes[0].handler.should.not.have.been.called;
            this.router.routes[1].handler.should.not.have.been.called;
            this.router.routes[2].handler.should.not.have.been.called;
            this.router.routes[3].handler.should.not.have.been.called;
        });

        it("does not call the route handler when only partial route is matched", () => {
            this.router.check("/c");
            this.router.routes[0].handler.should.not.have.been.called;
            this.router.routes[1].handler.should.not.have.been.called;
            this.router.routes[2].handler.should.not.have.been.called;
            this.router.routes[3].handler.should.not.have.been.called;
        });

        it("calls the route handler when route is matched", () => {
            this.router.check("/b/c");
            this.router.routes[0].handler.should.not.have.been.called;
            this.router.routes[1].handler.should.have.been.called;
            this.router.routes[2].handler.should.not.have.been.called;
            this.router.routes[3].handler.should.not.have.been.called;
        });

        it("calls the route handler when route is matched via getFragment", () => {
            this.router.check();
            this.router.routes[0].handler.should.not.have.been.called;
            this.router.routes[1].handler.should.not.have.been.called;
            this.router.routes[2].handler.should.have.been.called;
            this.router.routes[3].handler.should.not.have.been.called;
        });

        it("calls the route handler for wildcard routes", () => {
            this.router.check("/f/yes/g");
            this.router.routes[0].handler.should.not.have.been.called;
            this.router.routes[1].handler.should.not.have.been.called;
            this.router.routes[2].handler.should.not.have.been.called;
            this.router.routes[3].handler.should.have.been.calledWith({
                test: "yes"
            });
        });

        it("returns the router", () => {
            this.router.check("/").should.equal(this.router);
        });
    });


    describe("#navigate()", () => {
        var tests = [
            { input: null, output: "", root: "" },
            { input: null, output: "/", root: "/" },
            { input: "", output: "", root: "" },
            { input: "", output: "/", root: "/" },
            { input: "/", output: "/", root: "/" },
            { input: "test", output: "test", root: "" }
        ];

        beforeEach(() => {
            this.router.root = "";
            this.router.routes = [];
            global.history = {
                pushState: sinon.spy()
            };
            sinon.stub(this.router, "check").returns(this.router);
        });

        afterEach(() => {
            this.router.check.restore();
        });

        tests.forEach((test) => {
            it(`changes the url to ${test.output} when you navigate to ${test.input}`, () => {
                this.router.root = test.root;
                this.router.navigate(test.input);
                global.history.pushState.should.have.been.calledWith(null, null, test.output);
            });

            it(`checks the route for ${test.output} when you navigate to ${test.input}`, () => {
                this.router.root = test.root;
                this.router.navigate(test.input);
                this.router.check.should.have.been.calledWith(test.output);
            });
        });

        it("returns the router", () => {
            this.router.navigate("/").should.equal(this.router);
        });
    });


    describe("#listen()", () => {});
});
