const express = require("express");
const fs = require("fs");
const https = require("https");
const reload = require("reload");
const app = express();
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
