let deleteTargetId = null;
let deleteTimer = null;
let secondsLeft = 5;

function qs(id) { return document.getElementById(id); }

function openDeleteModal(personId) {
  deleteTargetId = personId;

  qs("deleteModalOverlay").classList.remove("hidden");
  qs("deleteModalTitle").textContent = "Confirm deletion";
  qs("deleteModalDesc").textContent = "Enter admin password to continue.";
  qs("deleteError").textContent = "";

  qs("deletePassword").value = "";
  qs("deletePassword").disabled = false;

  const confirmBtn = qs("deleteConfirmBtn");
  confirmBtn.disabled = false;
  confirmBtn.textContent = "Verify";

  // reset timer state
  if (deleteTimer) clearInterval(deleteTimer);
  deleteTimer = null;
  secondsLeft = 5;
}

function closeDeleteModal() {
  qs("deleteModalOverlay").classList.add("hidden");
  deleteTargetId = null;

  if (deleteTimer) clearInterval(deleteTimer);
  deleteTimer = null;
  secondsLeft = 5;
}

async function verifyPasswordThenCountdown() {
  const pw = qs("deletePassword").value.trim();
  qs("deleteError").textContent = "";

  if (!pw) {
    qs("deleteError").textContent = "Please enter the password.";
    return;
  }

  // Call backend verify endpoint (does NOT delete)
  const res = await fetch(`/persons/${deleteTargetId}/verify-delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pw }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    qs("deleteError").textContent = data.message || "Wrong password.";
    return;
  }

  // Password correct → start cancellable 5s countdown
  qs("deletePassword").disabled = true;

  const confirmBtn = qs("deleteConfirmBtn");
  confirmBtn.disabled = true;
  confirmBtn.textContent = `Deleting in ${secondsLeft}s...`;

  qs("deleteModalTitle").textContent = "Delete confirmation loading…";
  qs("deleteModalDesc").textContent =
    "You can still cancel. If not cancelled, the record will be deleted.";

  deleteTimer = setInterval(async () => {
    secondsLeft--;
    confirmBtn.textContent = `Deleting in ${secondsLeft}s...`;

    if (secondsLeft <= 0) {
      clearInterval(deleteTimer);
      deleteTimer = null;

      await actuallyDelete(pw);
    }
  }, 1000);
}

async function actuallyDelete(password) {
  // Send DELETE to backend
  const res = await fetch(`/persons/${deleteTargetId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    qs("deleteError").textContent = data.message || "Delete failed.";
    qs("deletePassword").disabled = false;
    qs("deleteConfirmBtn").disabled = false;
    qs("deleteConfirmBtn").textContent = "Verify";
    return;
  }

  closeDeleteModal();

  // Refresh the list
  if (typeof viewPersons === "function") viewPersons();
}

// This is what your Delete button calls from view.js
window.deletePerson = function (personId) {
  openDeleteModal(personId);
};

document.addEventListener("DOMContentLoaded", () => {
  const overlay = qs("deleteModalOverlay");
  if (!overlay) return;

  qs("deleteCancelBtn").addEventListener("click", closeDeleteModal);
  qs("deleteConfirmBtn").addEventListener("click", verifyPasswordThenCountdown);

  // optional: click outside modal closes
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeDeleteModal();
  });
});
