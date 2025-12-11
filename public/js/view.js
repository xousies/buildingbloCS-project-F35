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

            // fallback image if no photo
            var imageSrc = person.photoBase64 || "images/default-person.png";

            // decide status text + class (red for Missing, green for Found)
            var statusText = person.status || "Missing";
            var statusClass =
                statusText === "Found"
                    ? "status-badge status-found"
                    : "status-badge status-missing";

            html +=
                '<article class="person-card">' +
                    '<div class="person-image-wrapper">' +
                        '<img src="' + imageSrc + '" alt="Photo of ' +
                          (person.name || "Missing Person") + '" />' +
                    '</div>' +

                    '<div class="person-info">' +
                        '<h2 class="person-name">' + (person.name || '-') + '</h2>' +
                        '<p><strong>Age:</strong> ' + (person.age || '-') + '</p>' +
                        '<p><strong>Gender:</strong> ' + (person.gender || '-') + '</p>' +
                        '<p><strong>Last Seen:</strong> ' + (person.lastSeen || '-') + '</p>' +
                        '<p class="posted-date">Missing Since: ' +
                            (person.dateMissing || '-') + '</p>' +
                    '</div>' +

                    '<div class="posted-date">' +
                        'Status: <span class="' + statusClass + '">' +
                            statusText +
                        '</span>' +
                    '</div>' +

                    '<div class="card-actions">' +
                        // go straight to update page with id in query string
                        '<button class="btn-update" ' +
                            'onclick="window.location.href=\'update_person.html?id=' +
                            person.id + '\'">View / Edit</button>' +
                        '<button class="btn-delete" ' +
                            'onclick="deletePerson(\'' + person.id + '\')">Delete</button>' +
                    '</div>' +
                '</article>';
        }

        if (html === "") {
            html = "<p style='color:#e5e7eb;text-align:center;'>No missing persons found.</p>";
        }

        document.getElementById("cardsGrid").innerHTML = html;
    };

    request.send();
}

document.addEventListener("DOMContentLoaded", function () {
    viewPersons();
});
