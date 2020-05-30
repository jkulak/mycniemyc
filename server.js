const express = require("express");
const fs = require("fs");
const https = require("https");
const reload = require("reload");
const app = express();
const _ = require("lodash");
const url = require("url");
const createProxyServer = require("http-proxy");
const appAPIProxy = createProxyServer();

const hostname = "0.0.0.0";
const port = 3003;

const options = {
  key: fs.readFileSync("cert/server.key"),
  cert: fs.readFileSync("cert/server.crt")
};

app.use(function(req, res, next) {
  console.log("🌍 " + req.url + " was requested.");
  next();
});

app.all("/api/*", (req, res) => {
  const __path = _.drop(req.url.split("/"), 2);
  appAPIProxy.proxyRequest(req, res, {
    target: url.resolve(
      "https://api.darksky.net/forecast/6e3186336fe2a61b1327aea9c60d8ec5/",
      __path.join("/")
    ),
    port: 8001,
    ignorePath: true
  });
});

app.use("/", express.static(__dirname + "/public"));

// Reload code here
reload(app, { https: { certAndKey: options } })
  .then(function(reloadReturned) {
    // Reload started, start web app
    https.createServer(options, app).listen(port, hostname, () => {
      console.log(`🌤  Server running at http(s)://${hostname}:${port}/`);
    });
  })
  .catch(function(err) {
    console.error("Reload could not start, could not start server/sample app", err);
  });
