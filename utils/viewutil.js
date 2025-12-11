const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "missing_person.json");

function viewPersons(req, res) {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      // If file not found, just return an empty array instead of crashing
      if (err.code === "ENOENT") {
        console.warn("missing_person.json not found. Returning empty list.");
        return res.status(200).json([]);
      }

      console.error("Error reading missing_person.json:", err);
      return res.status(500).json({ message: "Error reading data file." });
    }

    let persons = [];

    try {
      if (data.trim().length > 0) {
        persons = JSON.parse(data);
      }
    } catch (parseError) {
      console.error("Error parsing missing_person.json:", parseError);
      return res.status(500).json({ message: "Error parsing data file." });
    }

    if (!Array.isArray(persons)) {
      persons = [];
    }

    return res.status(200).json(persons);
  });
}

module.exports = { viewPersons };
