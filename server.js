const express = require("express");
const server = express();
const reload = require("reload");

const hostname = "0.0.0.0";
const port = 3003;

server.use(function(req, res, next) {
  console.log("🌍 " + req.url + " was requested.");
  next();
});

server.use("/", express.static(__dirname + "/public"));

// Reload code here
reload(server)
  .then(function(reloadReturned) {
    // reloadReturned is documented in the returns API in the README

    // Reload started, start web server
    server.listen(port, hostname, () => {
      console.log(`🌤  Server running at http://${hostname}:${port}/`);
    });
  })
  .catch(function(err) {
    console.error("Reload could not start, could not start server/sample app", err);
  });
