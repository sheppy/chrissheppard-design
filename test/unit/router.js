/* global describe, it, beforeEach, afterEach */
/* eslint no-unused-expressions: 0 */
/* jslint -W030 */

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
        it("returns the fragment without slashes");
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
    });
});
