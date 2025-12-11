function viewPersons() {
    var request = new XMLHttpRequest();
    var response = "";

    request.open("GET", "/view-persons", true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function () {
        response = JSON.parse(request.responseText);

        var html = "";

        for (var i = 0; i < response.length; i++) {
            var person = response[i];

            var imageSrc = person.photoBase64 || "images/default-person.png";

            html +=
                '<article class="pet-card">' +
                    '<div class="pet-image-placeholder">' +
                        '<img src="' + imageSrc + '" alt="Photo of ' + (person.name || "Missing Person") + '" class="pet-image" />' +
                    '</div>' +

                    '<div class="pet-info">' +
                        '<h2 class="pet-name">' + (person.name || '-') + '</h2>' +

                        '<p><strong>Age:</strong> ' + (person.age || '-') + '</p>' +
                        '<p><strong>Gender:</strong> ' + (person.gender || '-') + '</p>' +
                        '<p><strong>Last Seen:</strong> ' + (person.lastSeen || '-') + '</p>' +
                        '<p class="posted-date">Missing Since: ' + (person.dateMissing || '-') + '</p>' +
                    '</div>' +

                    '<div class="posted-date">' +
                        'Status: <span class="status-badge">' + (person.status || "Missing") + '</span>' +
                    '</div>' +

                    '<div class="card-actions">' +
                        '<button class="btn-update" data-id="' + person.id + '">View / Edit</button>' +
                        '<button class="btn-delete" onclick="deletePerson(\'' + person.id + '\')">Delete</button>' +
                    '</div>' +
                '</article>';
        }

        if (html === "") {
            html = "<p>No missing persons found.</p>";
        }

        document.getElementById("cardsGrid").innerHTML = html;
    };

    request.send();
}

document.addEventListener("DOMContentLoaded", function () {
    viewPersons();
});
