let currentPersonId = null;
let originalFormData = null;
let hasUnsavedChanges = false;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  currentPersonId = params.get("id");

  const messageDiv = document.getElementById("message");
  const confirmModal = document.getElementById("confirmModal");
  const successModal = document.getElementById("successModal");

  // No-changes modal elements
  const noChangesModal = document.getElementById("noChangesModal");
  const noChangesConfirmBtn = document.getElementById("noChangesConfirmBtn");
  const noChangesCancelBtn = document.getElementById("noChangesCancelBtn");

  const confirmUpdateBtn = document.getElementById("confirmUpdateBtn");
  const cancelUpdateBtn = document.getElementById("cancelUpdateBtn");
  const successOkBtn = document.getElementById("successOkBtn");
  const form = document.getElementById("updatePersonForm");

  if (!currentPersonId) {
    if (messageDiv) {
      messageDiv.textContent = "No missing person selected.";
    }
    return;
  }

  const uploadBox = document.querySelector(".image-upload-box");
  const imageHiddenInput = document.getElementById("photoBase64");

  /** IMAGE UPLOAD **/
  if (uploadBox && imageHiddenInput) {
    uploadBox.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (!file) return;

        // Max 2MB
        if (file.size > 2 * 1024 * 1024) {
          alert("Image too large. Max 2MB allowed.");
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("Invalid file. Please upload an image.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function () {
          const base64 = reader.result;
          imageHiddenInput.value = base64;
          uploadBox.innerHTML = `<img src="${base64}" alt="Person image" style="width:100%;height:100%;object-fit:cover;border-radius:20px;">`;
          hasUnsavedChanges = true;
        };
        reader.readAsDataURL(file);
      };

      fileInput.click();
    });
  }

  /** LOAD EXISTING MISSING PERSON DATA **/
  fetch(`/persons/${currentPersonId}`)
    .then((res) => res.json())
    .then((person) => fillForm(person))
    .catch(() => {
      if (messageDiv) {
        messageDiv.textContent = "Error loading missing person details.";
      }
    });

  /** FORM SUBMIT **/
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setupConfirmCountdown(confirmUpdateBtn);
    confirmModal.classList.remove("hidden");
  });

  /** CONFIRM MODAL BUTTONS **/
  confirmUpdateBtn.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
    performUpdate();
  });

  cancelUpdateBtn.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
    hasUnsavedChanges = false;
    window.location.href = "index.html";
  });

  /** SUCCESS MODAL BUTTON **/
  successOkBtn.addEventListener("click", () => {
    setupRedirectCountdown();
  });

  /** NO-CHANGES MODAL BUTTONS **/
  if (noChangesCancelBtn) {
    noChangesCancelBtn.addEventListener("click", () => {
      noChangesModal.classList.add("hidden");
    });
  }

  if (noChangesConfirmBtn) {
    noChangesConfirmBtn.addEventListener("click", () => {
      // Only allow click after countdown finishes
      if (noChangesConfirmBtn.disabled) return;
      window.location.href = "index.html";
    });
  }

  /** TRACK UNSAVED CHANGES **/
  attachChangeListeners(form);

  /** BROWSER LEAVE WARNING **/
  window.addEventListener("beforeunload", function (e) {
    if (!hasUnsavedChanges) return;
    e.preventDefault();
    e.returnValue = "You have unsaved changes. Leave page?";
  });
});

/** FILL FORM WITH EXISTING MISSING PERSON DATA **/
function fillForm(person) {
  // Simple direct mappings
  const mapping = {
    name: person.name,
    age: person.age,
    gender: person.gender,
    status: person.status || "Missing",
    dateMissing: person.dateMissing,
    lastSeen: person.lastSeen,
    heightCm: person.heightCm ?? "",
    weightKg: person.weightKg ?? "",

    clothing: person.clothing,
    contact: person.contact,
    description: person.description,
  };

  Object.keys(mapping).forEach((id) => {
    const field = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
    if (field && mapping[id] !== undefined && mapping[id] !== null) {
      field.value = mapping[id];
    }
  });



  // Image
  if (person.photoBase64) {
    const uploadBox = document.querySelector(".image-upload-box");
    const imageHiddenInput = document.getElementById("photoBase64");
    if (uploadBox && imageHiddenInput) {
      imageHiddenInput.value = person.photoBase64;
      uploadBox.innerHTML = `<img src="${person.photoBase64}" alt="Person image" style="width:100%;height:100%;object-fit:cover;border-radius:20px;">`;
    }
  }

  originalFormData = getCurrentFormData();
  hasUnsavedChanges = false;
}

/** MARK FORM AS DIRTY WHEN USER EDITS **/
function attachChangeListeners(form) {
  const fields = form.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.addEventListener("input", () => (hasUnsavedChanges = true));
    field.addEventListener("change", () => (hasUnsavedChanges = true));
  });
}

/** READ CURRENT FORM DATA INTO OBJECT **/
function getCurrentFormData() {
  const formData = new FormData(document.getElementById("updatePersonForm"));
  const data = {};
  formData.forEach((v, k) => (data[k] = v.trim()));
  return data;
}

/** CHECK IF FORM CHANGED COMPARED TO ORIGINAL **/
function formDataChanged(current, original) {
  for (const key of Object.keys({ ...current, ...original })) {
    if ((current[key] || "") !== (original[key] || "")) {
      return true;
    }
  }
  return false;
}

/** VALIDATION RULES (for Missing Person) **/
function validateForm() {
  const msg = document.getElementById("message");
  msg.textContent = "";

  const get = (id) =>
    (document.getElementById(id) || document.querySelector(`[name="${id}"]`)).value.trim();

  const name = get("name");
  const age = get("age");
  const gender = get("gender");
  const dateMissing = get("dateMissing");
  const heightCm = get("heightCm");
const weightKg = get("weightKg");


  // Required fields
  if (!name || !age || !gender || !dateMissing) {
    msg.textContent = "Please fill in all required fields.";
    return false;
  }

  // Age validation
  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
    msg.textContent = "Please enter a valid age.";
    return false;
  }



  if (heightCm !== "") {
  const h = Number(heightCm);
  if (isNaN(h) || h < 30 || h > 250) {
    msg.textContent = "Height must be between 30 and 250 cm.";
    return false;
  }
}

if (weightKg !== "") {
  const w = Number(weightKg);
  if (isNaN(w) || w < 1 || w > 400) {
    msg.textContent = "Weight must be between 1 and 400 kg.";
    return false;
  }
}

  // Date missing cannot be in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const missingDate = new Date(dateMissing);
  if (dateMissing && missingDate > today) {
    msg.textContent = "Date missing cannot be in the future.";
    return false;
  }

  // No changes → show modal and stop normal flow
  const current = getCurrentFormData();
  if (originalFormData && !formDataChanged(current, originalFormData)) {
    showNoChangesModal();
    return false;
  }

  return true;
}

/** SHOW "NO CHANGES" MODAL WITH 3-SECOND COUNTDOWN **/
function showNoChangesModal() {
  const noChangesModal = document.getElementById("noChangesModal");
  const noChangesConfirmBtn = document.getElementById("noChangesConfirmBtn");
  if (!noChangesModal || !noChangesConfirmBtn) return;

  // Form is identical to original → nothing unsaved
  hasUnsavedChanges = false;

  noChangesModal.classList.remove("hidden");

  const originalText = "Yes, redirect back";
  let seconds = 3;

  noChangesConfirmBtn.disabled = true;
  noChangesConfirmBtn.textContent = `Please wait... ${seconds}`;

  const intervalId = setInterval(() => {
    seconds--;
    noChangesConfirmBtn.textContent = `Please wait... ${seconds}`;

    if (seconds <= 0) {
      clearInterval(intervalId);
      noChangesConfirmBtn.disabled = false;
      noChangesConfirmBtn.textContent = originalText;
    }
  }, 1000);
}

/** 3-SECOND COUNTDOWN BEFORE "YES, UPDATE" IS CLICKABLE **/
function setupConfirmCountdown(confirmUpdateBtn) {
  const originalText =
    confirmUpdateBtn.getAttribute("data-original-text") || "Yes, update";
  confirmUpdateBtn.setAttribute("data-original-text", originalText);

  let seconds = 3;
  confirmUpdateBtn.disabled = true;
  confirmUpdateBtn.textContent = `Please wait... ${seconds}`;

  const interval = setInterval(() => {
    seconds--;
    confirmUpdateBtn.textContent = `Please wait... ${seconds}`;

    if (seconds <= 0) {
      clearInterval(interval);
      confirmUpdateBtn.disabled = false;
      confirmUpdateBtn.textContent = originalText;
    }
  }, 1000);
}

/** SEND UPDATE REQUEST TO BACKEND **/
function performUpdate() {
  const msg = document.getElementById("message");
  const updates = getCurrentFormData();

  fetch(`/persons/${currentPersonId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then((result) => {
      if (!result.ok) {
        msg.textContent = result.data.message || "Update failed.";
      } else {
        const successModal = document.getElementById("successModal");
        successModal.classList.remove("hidden");

        originalFormData = getCurrentFormData();
        hasUnsavedChanges = false;
      }
    })
    .catch(() => {
      msg.textContent = "An error occurred while updating.";
    });
}

/** AFTER SUCCESS: 3-SECOND REDIRECT COUNTDOWN **/
function setupRedirectCountdown() {
  const successModal = document.getElementById("successModal");
  const successMsg = successModal.querySelector("p");

  let seconds = 3;
  successMsg.textContent = `Record updated successfully! Redirecting in ${seconds}...`;

  const interval = setInterval(() => {
    seconds--;
    successMsg.textContent = `Record updated successfully! Redirecting in ${seconds}...`;

    if (seconds <= 0) {
      clearInterval(interval);
      window.location.href = "index.html";
    }
  }, 1000);
}

