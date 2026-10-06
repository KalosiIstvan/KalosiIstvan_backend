const express = require("express");
const app = express();
const path = require("path");

app.get("/itmp", (req, res) => {
  res.send("Hello ITMP!");
});

app.get("/nodejs", (req, res) => {
  res.send(
    "A Node.js egy olyan szerveroldali JavaScript futtatókörnyezet, amely a V8 JavaScript motorra épül."
  );
});

app.get("/express", (req, res) => {
  res.send(
    "Az Express egy minimalista webes keretrendszer, amely a Node.js-hez készült."
  );
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});