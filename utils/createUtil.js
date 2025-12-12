const { MissingPerson } = require("../models/persondata.js");
const fs = require("fs").promises;
const path = require("path");

const PERSONS_FILE = path.join(__dirname, "missing_person.json");
const TEMPLATE_FILE = path.join(__dirname, "missing_person.template.json");

async function addMissingPerson(req, res) {
  try {
    const {
      name,
      age,
      gender,
      heightCm,
      weightKg,
      lastSeen,
      dateMissing,
      description,
      clothing,
      photoBase64,
      contact,
      status,
    } = req.body;

    if (!name || age === undefined || !gender || !dateMissing) {
      return res.status(400).json({
        message: "Missing required fields: name, age, gender, dateMissing",
      });
    }

    const h = heightCm === "" || heightCm === undefined ? null : Number(heightCm);
    const w = weightKg === "" || weightKg === undefined ? null : Number(weightKg);

    const newPerson = new MissingPerson(
  name,
  Number(age),
  gender,
  lastSeen || "",
  h,
  w,
  dateMissing,
  description || "",
  clothing || "",
  photoBase64 || "",
  contact || ""
);


    if (status === "Found" || status === "Missing") newPerson.status = status;

    let persons = [];
    try {
      const data = await fs.readFile(PERSONS_FILE, "utf8");
      persons = JSON.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") {
        const templateData = await fs.readFile(TEMPLATE_FILE, "utf8");
        persons = JSON.parse(templateData);
        await fs.writeFile(PERSONS_FILE, JSON.stringify(persons, null, 2), "utf8");
      } else throw err;
    }

    persons.push(newPerson);
    await fs.writeFile(PERSONS_FILE, JSON.stringify(persons, null, 2), "utf8");

    return res.status(201).json(persons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { addMissingPerson };
