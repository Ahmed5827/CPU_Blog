const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1> hello world </h1>");
});

app.listen(port, () => {
  console.log(`Express js is listening on port ${port}`);
});
