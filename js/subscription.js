// Simulated database of Australian Government Registered Providers (Level 1)
const REGISTERED_PROVIDERS_DB = [
  {
    businessName: "BlueGum Care",
    abn: "12 345 678 901",
    registeredEmail: "admin@bluegumcare.com.au"
  },
  {
    businessName: "Harbourside Support",
    abn: "98 765 432 109",
    registeredEmail: "enquiries@harboursidesupport.com.au"
  },
  {
    businessName: "Southern Cross Aged Services",
    abn: "45 678 912 345",
    registeredEmail: "compliance@southerncrossaged.com.au"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const verifyForm = document.getElementById("sub-verify-form");
  const paymentForm = document.getElementById("sub-payment-form");
  const step1Status = document.getElementById("step1-status");
  const step2Box = document.getElementById("sub-step-2");
  const step3Box = document.getElementById("sub-step-3");
  const emailPreviewBox = document.getElementById("email-preview-box");
  const proceedStep3Btn = document.getElementById("proceed-step3-btn");

  let verifiedProvider = null;
  let selectedAction = "Subscribe";

  if (!verifyForm) return;

  // STEP 1: Check Registry & Trigger Confirmation Email
  verifyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputName = document.getElementById("sub-business-name").value.trim().toLowerCase();
    const applicantName = document.getElementById("sub-applicant").value.trim();
    selectedAction = verifyForm.querySelector('input[name="subAction"]:checked').value;

    const match = REGISTERED_PROVIDERS_DB.find(
      (provider) => provider.businessName.toLowerCase() === inputName
    );

    step1Status.className = "status-banner visible";

    if (!match) {
      // Not on registered list -> No email sent
      verifiedProvider = null;
      step2Box.classList.add("step-locked");
      step2Box.classList.remove("step-active");
      step3Box.classList.add("step-locked");
      step3Box.classList.remove("step-active");
      proceedStep3Btn.disabled = true;

      step1Status.classList.add("status-error");
      step1Status.textContent =
        "Business name not found on our pre-listed government provider register. No confirmation email has been sent.";
      return;
    }

    // Found on registered list -> Unlock Step 2
    verifiedProvider = { ...match, applicantName };
    step1Status.classList.add("status-info");
    step1Status.textContent = `Verified! A confirmation email has been dispatched to ${match.registeredEmail}.`;

    step2Box.classList.remove("step-locked");
    step2Box.classList.add("step-active");
    proceedStep3Btn.disabled = false;

    emailPreviewBox.innerHTML = `
      <p><strong>To:</strong> ${match.registeredEmail}</p>
      <p><strong>Subject:</strong> Confirm ${selectedAction} Request &ndash; ${match.businessName}</p>
      <p class="field-hint">Hi ${applicantName}, click the button below to review Terms &amp; Conditions and complete your ${selectedAction.toLowerCase()} request.</p>
    `;
  });

  // STEP 2 -> STEP 3: Click Link in Confirmation Email
  proceedStep3Btn.addEventListener("click", () => {
    if (!verifiedProvider) return;

    if (selectedAction === "Unsubscribe") {
      showAcknowledgment(
        `<strong>${verifiedProvider.businessName}</strong> has been unsubscribed from Level 2 and returned to Level 1 registered status.`
      );
      resetSubscriptionFlow();
      return;
    }

    step3Box.classList.remove("step-locked");
    step3Box.classList.add("step-active");
    step3Box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // STEP 3: Finalize Details & Payment -> Elevate to Level 2
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!verifiedProvider) return;

    const formData = new FormData(paymentForm);
    const subscriptionRecord = {
      businessName: verifiedProvider.businessName,
      abn: verifiedProvider.abn,
      registeredEmail: verifiedProvider.registeredEmail,
      applicant: verifiedProvider.applicantName,
      tier: "Level 2 (Subscribed)",
      paidUpTo: calculatePaidUntil(formData.get("planDuration")),
      details: Object.fromEntries(formData.entries())
    };

    console.log("Provider elevated to Level 2 Subscribed List:", subscriptionRecord);

    showAcknowledgment(
      `Payment confirmed! <strong>${verifiedProvider.businessName}</strong> has been added to the <strong>Level 2 Subscribed List</strong> (Paid up to ${subscriptionRecord.paidUpTo}).`
    );

    resetSubscriptionFlow();
  });

  function calculatePaidUntil(planDuration) {
    const date = new Date();
    const monthsToAdd = planDuration === "3-month" ? 3 : 1;
    date.setMonth(date.getMonth() + monthsToAdd);
    return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  }

  function resetSubscriptionFlow() {
    verifyForm.reset();
    paymentForm.reset();
    verifiedProvider = null;
    step1Status.className = "status-banner";
    step2Box.classList.add("step-locked");
    step2Box.classList.remove("step-active");
    step3Box.classList.add("step-locked");
    step3Box.classList.remove("step-active");
    proceedStep3Btn.disabled = true;
    emailPreviewBox.innerHTML = `
      <p><strong>Awaiting Step 1 verification...</strong></p>
      <p class="field-hint">Once your business is verified, a confirmation link including Terms &amp; Conditions will appear here.</p>
    `;
  }
});