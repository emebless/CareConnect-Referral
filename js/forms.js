let pendingForm = null;

document.addEventListener("DOMContentLoaded", () => {
  const requestForms = document.querySelectorAll(".request-form");
  const cancelTermsBtn = document.getElementById("cancel-terms-btn");
  const acceptTermsBtn = document.getElementById("accept-terms-btn");

  requestForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      pendingForm = form;
      openModal("terms-modal");
    });
  });

  if (cancelTermsBtn) {
    cancelTermsBtn.addEventListener("click", () => {
      pendingForm = null;
      closeModal("terms-modal");
    });
  }

  if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener("click", () => {
      if (!pendingForm) return;

      const formData = new FormData(pendingForm);
      const formType = pendingForm.dataset.formType || "Support Request";
      const payload = Object.fromEntries(formData.entries());

      const emailRoutingPayload = {
        folderTag: formType === "Disability Request" ? "[REQ-DISABILITY]" : "[REQ-AGED-CARE]",
        submittedAt: new Date().toISOString(),
        data: payload
      };

      console.log("Ready to dispatch email payload:", emailRoutingPayload);

      closeModal("terms-modal");
      pendingForm.reset();
      pendingForm = null;

      showAcknowledgment(
        `Thank you. Your <strong>${formType}</strong> has been received. Please allow <strong>5&ndash;7 business days</strong> for processing.`
      );
    });
  }
});


// Add General Feedback Handlers
// Handle Forms 1-3 on Feedback Page (Site Issue, Compliments, Complaints)
  const feedbackForms = document.querySelectorAll(".feedback-form");
  feedbackForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const formType = form.dataset.formType || "Feedback";
      const folderTag = form.dataset.folderTag || "[FB-GENERAL]";

      const emailRoutingPayload = {
        folderTag,
        submittedAt: new Date().toISOString(),
        data: Object.fromEntries(formData.entries())
      };

      console.log("Ready to dispatch feedback email:", emailRoutingPayload);

      form.reset();
      showAcknowledgment(
        `Thank you. Your <strong>${formType}</strong> submission has been received and routed to our team.`
      );
    });
  });