const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050;
const startPage = "index.html";

app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
app.use(bodyParser.json({ limit: "2mb" }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", startPage));
});

// VIEW ALL MISSING PERSONS ROUTE
const { viewPersons } = require("./utils/viewutil");

app.get("/view-persons", viewPersons);

const server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${address.address === "::" ? "localhost" : address.address}:${address.port}`;
  console.log(`MissingLink running at: ${baseUrl}`);
});

module.exports = { app, server };
