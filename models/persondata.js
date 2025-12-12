class MissingPerson {
  constructor(
    name,
    age,
    gender,
    lastSeen,
    heightCm,
    weightKg,
    dateMissing,
    description,
    clothing,
    photoBase64,
    contact
  ) {
    this.name = name;
    this.age = age;
    this.gender = gender;

    this.lastSeen = lastSeen;

    this.heightCm = heightCm; // number (cm) or null
    this.weightKg = weightKg; // number (kg) or null

    this.dateMissing = dateMissing;
    this.description = description;
    this.clothing = clothing;

    this.photoBase64 = photoBase64;
    this.contact = contact;

    this.status = "Missing";

    this.createdAt = new Date().toISOString();

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.id = `${timestamp}${String(random).padStart(3, "0")}`;
  }
}

module.exports = { MissingPerson };
