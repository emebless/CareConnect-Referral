function openModal(modalId) {
  const dialog = document.getElementById(modalId);
  if (dialog && !dialog.open) {
    dialog.showModal();
  }
}

function closeModal(modalId) {
  const dialog = document.getElementById(modalId);
  if (dialog && dialog.open) {
    dialog.close();
  }
}

function showAcknowledgment(customMessage) {
  const msgEl = document.getElementById("ack-modal-message");
  if (msgEl && customMessage) {
    msgEl.innerHTML = customMessage;
  }
  openModal("ack-modal");
}

document.addEventListener("DOMContentLoaded", () => {
  const closeAckBtn = document.getElementById("close-ack-btn");
  if (closeAckBtn) {
    closeAckBtn.addEventListener("click", () => closeModal("ack-modal"));
  }

  document.querySelectorAll(".app-modal").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const clickedInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!clickedInDialog) {
        dialog.close();
      }
    });
  });
});