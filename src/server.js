/* eslint-env node */

var connect = require("connect");
var serveStatic = require("serve-static");
var http = require("http");
var path = require("path");

var PORT = process.env.PORT || 8080;


var app = connect();

app.use(serveStatic(path.join(__dirname, "..", "public"), { index: ["index.html"] }));

http.createServer(app).listen(PORT);
