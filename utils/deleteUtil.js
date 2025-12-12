const fs = require("fs").promises;
const path = require("path");

const PERSON_FILE = path.join(__dirname, "missing_person.json");

const ADMIN_DELETE_PASSWORD = process.env.ADMIN_DELETE_PASSWORD || "1234";

async function verifyDelete(req, res) {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: "Password required." });

  if (password !== ADMIN_DELETE_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  return res.status(200).json({ message: "Password verified." });
}


async function deletePerson(req, res) {
  const personId = req.params.id;
  const { password } = req.body || {};

  if (!password) return res.status(400).json({ message: "Password required." });
  if (password !== ADMIN_DELETE_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  try {
    const data = await fs.readFile(PERSON_FILE, "utf8");
    const allPersons = JSON.parse(data);

    const before = allPersons.length;
    const updated = allPersons.filter((p) => p.id !== personId);

    if (updated.length === before) {
      return res.status(404).json({ message: "Missing person not found." });
    }

    await fs.writeFile(PERSON_FILE, JSON.stringify(updated, null, 2), "utf8");

    return res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "Missing persons file not found." });
    }
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { verifyDelete, deletePerson };
