class MissingPerson {
    constructor(
        name,
        age,
        gender,
        lastSeen,
        lastSeenLat,
        lastSeenLng,
        dateMissing,
        description,
        clothing,
        photoBase64,
        contact
    ) {
        this.name = name;
        this.age = age;
        this.gender = gender;

        this.lastSeen = lastSeen; // text location
        this.lastSeenCoords = {
            lat: lastSeenLat,
            lng: lastSeenLng,
        };

        this.dateMissing = dateMissing;
        this.description = description;
        this.clothing = clothing;

        // Image uploaded as Base64 (same style as your pet adoption project)
        this.photoBase64 = photoBase64;

        this.contact = contact;

        // Default status
        this.status = "Missing";

        // Timestamps
        this.createdAt = new Date().toISOString();

        // Unique ID (same style as Pet)
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, "0");
    }
}

module.exports = { MissingPerson };
