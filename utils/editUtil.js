const fs = require("fs").promises;
const path = require("path");

const PERSON_FILE = path.join(__dirname, "missing_person.json");

async function getPersonDetails(req, res) {
  const personId = req.params.id;

  try {
    const data = await fs.readFile(PERSON_FILE, "utf8");
    const allPersons = JSON.parse(data);

    const person = allPersons.find((p) => p.id === personId);

    if (!person) {
      return res.status(404).json({ message: "Missing person not found." });
    }

    return res.status(200).json(person);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res
        .status(404)
        .json({ message: "No missing person details found." });
    }

    return res.status(500).json({ message: error.message });
  }
}

async function updatePerson(req, res) {
  const personId = req.params.id;
  const updates = req.body || {};

  try {
    const data = await fs.readFile(PERSON_FILE, "utf8");
    const allPersons = JSON.parse(data);

    const index = allPersons.findIndex((p) => p.id === personId);

    if (index === -1) {
      return res.status(404).json({ message: "Missing person not found." });
    }

    const existingPerson = allPersons[index];

    const updatableFields = [
  "name",
  "age",
  "gender",
  "lastSeen",
  "heightCm",
  "weightKg",
  "dateMissing",
  "description",
  "clothing",
  "contact",
  "photoBase64",
  "status",
];


    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        existingPerson[field] = updates[field];
      }
    });

    allPersons[index] = existingPerson;

    await fs.writeFile(
      PERSON_FILE,
      JSON.stringify(allPersons, null, 2),
      "utf8"
    );

    return res.status(200).json({
      message: "Missing person record updated successfully.",
      person: existingPerson,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res
        .status(404)
        .json({ message: "Missing persons file not found." });
    }

    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getPersonDetails, updatePerson };
