"use strict";

const express = require("express");
const app = express();

const PORT = 8080;
const HOST = `192.168.0.4`;

app.get("/", (req, res) => {
  res.send("Hello World\n");
  console.log("Running");
});

app.listen(PORT, () => {
  console.log("start");
});

console.log(`Running on http://${HOST}:${PORT}`);
