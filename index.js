const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050;
const startPage = "index.html";

// Parse forms + JSON
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));
app.use(bodyParser.json({ limit: "2mb" }));

// Serve ALL public files at root
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", startPage));
});

// VIEW ALL MISSING PERSONS
const { viewPersons } = require("./utils/viewutil");
app.get("/view-persons", viewPersons);

// VIEW + UPDATE INDIVIDUAL PERSON DETAILS
const { getPersonDetails, updatePerson } = require("./utils/editUtil");
app.get("/persons/:id", getPersonDetails);
app.put("/persons/:id", updatePerson);

// Start server
const server = app.listen(PORT, () => {
  const address = server.address();
  const baseUrl = `http://${address.address === "::" ? "localhost" : address.address}:${address.port}`;
  console.log(`MissingLink running at: ${baseUrl}`);
});

module.exports = { app, server };
