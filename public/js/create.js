let pendingPersonData = null;
let countdownTimer = null;
let countdownValue = 5;


document.addEventListener("DOMContentLoaded", function () {
  const uploadBox = document.getElementById("imageUploadBox");
  const imageHiddenInput = document.getElementById("photoBase64");
  const form = document.getElementById("createPersonForm");


  const dateMissingInput = document.getElementById("dateMissing");
  if (dateMissingInput) {
    const today = new Date().toISOString().split("T")[0];
    dateMissingInput.max = today;
  }


  if (uploadBox) {
    uploadBox.addEventListener("click", function () {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (!file) return;

        
        const maxSizeBytes = 2 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          alert("Image is too large. Please upload a file smaller than 2MB.");
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("Please upload a valid image file.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function () {
          const base64 = reader.result;

          
          imageHiddenInput.value = base64;

         
          uploadBox.innerHTML =
            '<img src="' +
            base64 +
            '" alt="Missing person preview" style="width:100%;height:100%;object-fit:cover;border-radius:14px;">';
        };
        reader.readAsDataURL(file);
      };

      fileInput.click();
    });
  }


  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      startCountdownSnackbar();
    });
  }
});


function collectPersonData() {
  const jsonData = {};

  jsonData.name = document.getElementById("name").value.trim();
  jsonData.age = document.getElementById("age").value; 
  jsonData.gender = document.getElementById("gender").value;

  jsonData.status = document.getElementById("status")
    ? document.getElementById("status").value
    : "Missing";

  jsonData.dateMissing = document.getElementById("dateMissing").value;

  jsonData.lastSeen = document.getElementById("lastSeen").value.trim();
  jsonData.heightCm = document.getElementById("heightCm").value.trim();
  jsonData.weightKg = document.getElementById("weightKg").value.trim();


  jsonData.clothing = document.getElementById("clothing").value.trim();
  jsonData.contact = document.getElementById("contact").value.trim();
  jsonData.description = document.getElementById("description").value.trim();


  jsonData.photoBase64 = document.getElementById("photoBase64").value;

  return jsonData;
}


function validatePersonData(jsonData) {
 
  if (
    jsonData.name === "" ||
    jsonData.age === "" ||
    jsonData.gender === "" ||
    jsonData.dateMissing === ""
  ) {
    alert("Please fill in all required fields (*) before submitting.");
    return false;
  }


  const namePattern = /^[A-Za-z\s'-]+$/;
  if (!namePattern.test(jsonData.name)) {
    alert("Full Name can only contain letters, spaces, apostrophes (') and hyphens (-).");
    return false;
  }

 
  const ageNum = Number(jsonData.age);
  if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
    alert("Please enter a valid age between 0 and 120.");
    return false;
  }

  
  const today = new Date().toISOString().split("T")[0];
  if (jsonData.dateMissing > today) {
    alert("Date Missing cannot be in the future.");
    return false;
  }

  
if (jsonData.heightCm !== "") {
  const h = Number(jsonData.heightCm);
  if (Number.isNaN(h) || h < 30 || h > 250) {
    alert("Height must be a valid number between 30 and 250 cm.");
    return false;
  }
}

if (jsonData.weightKg !== "") {
  const w = Number(jsonData.weightKg);
  if (Number.isNaN(w) || w < 1 || w > 400) {
    alert("Weight must be a valid number between 1 and 400 kg.");
    return false;
  }
}


  
  if (jsonData.contact && jsonData.contact.trim() !== "") {
    const contactPattern = /^[0-9\s+\-()]{6,}$/;
    if (!contactPattern.test(jsonData.contact)) {
      alert("Contact/Hotline looks invalid. Use numbers and symbols like + - ( ) only.");
      return false;
    }
  }

  
  if (!jsonData.photoBase64 || jsonData.photoBase64.trim() === "") {
    alert("Please upload a photo before submitting.");
    return false;
  }

  return true;
}


function startCountdownSnackbar() {
  const jsonData = collectPersonData();
  if (!validatePersonData(jsonData)) return;

  pendingPersonData = jsonData;
  countdownValue = 5;

  
  const old = document.getElementById("countdownSnackbar");
  if (old) old.remove();


  const snackbar = document.createElement("div");
  snackbar.id = "countdownSnackbar";
  snackbar.style.position = "fixed";
  snackbar.style.top = "50%";
  snackbar.style.left = "50%";
  snackbar.style.transform = "translate(-50%, -50%)";
  snackbar.style.background = "#fffdf9";
  snackbar.style.border = "1px solid #e8dec3";
  snackbar.style.borderRadius = "14px";
  snackbar.style.padding = "14px 18px";
  snackbar.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
  snackbar.style.zIndex = "9999";
  snackbar.style.minWidth = "320px";
  snackbar.style.textAlign = "center";
  snackbar.style.fontSize = "0.9rem";

  snackbar.innerHTML = `
    <div style="font-weight:600; font-size:1rem; margin-bottom:4px;">
      Creating Record
    </div>
    <div id="snackbarCountdownText" style="color:#666; margin-bottom:8px;">
      in ${countdownValue} seconds…
    </div>
    <div style="font-size:0.8rem; color:#888; margin-bottom:10px;">
      Redirecting back to Missing Persons List once added.
    </div>
    <button id="snackbarCancelBtn"
      style="background:#ffe4e1;color:#a33;border:none;
             padding:6px 14px;border-radius:10px;cursor:pointer;">
      Cancel
    </button>
  `;

  document.body.appendChild(snackbar);

  const countdownText = document.getElementById("snackbarCountdownText");
  const cancelBtn = document.getElementById("snackbarCancelBtn");

  
  cancelBtn.addEventListener("click", () => {
    clearInterval(countdownTimer);
    countdownTimer = null;
    snackbar.remove();
    alert("Submission cancelled. You can continue editing.");
  });

  
  countdownTimer = setInterval(() => {
    countdownValue--;
    countdownText.textContent = ` in ${countdownValue} seconds…`;

    if (countdownValue <= 0) {
      clearInterval(countdownTimer);
      snackbar.remove();
      addMissingPerson(pendingPersonData);
    }
  }, 1000);
}


function addMissingPerson(jsonData) {
  let response = "";

  const request = new XMLHttpRequest();


  request.open("POST", "/add-missing-person", true);

  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function () {
    try {
      response = JSON.parse(request.responseText);
    } catch (e) {
      console.error("Invalid JSON response from server:", request.responseText);
      alert("Unexpected server response. Please try again.");
      return;
    }

    console.log(response);


    if (response.message === undefined) {
      alert("Record created successfully: " + jsonData.name + "!");


      const form = document.getElementById("createPersonForm");
      form.reset();
      document.getElementById("photoBase64").value = "";

      const uploadBox = document.getElementById("imageUploadBox");
      if (uploadBox) {
        uploadBox.innerHTML =
          '<span class="upload-placeholder">Upload photo of missing person</span>';
      }

      window.location.href = "index.html";
    } else {
      alert("Unable to create record: " + response.message);
    }
  };

  request.onerror = function () {
    alert("Network error while trying to create record. Please try again.");
  };

  request.send(JSON.stringify(jsonData));
}
