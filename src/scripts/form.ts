import { SITE } from "../config/site";
import { dispatchAnalytics } from "../utils/analytics";

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function initContactIntents(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-contact-intent]").forEach((intent) => {
    intent.addEventListener("click", () => {
      const form = document.querySelector<HTMLFormElement>("[data-form]");
      const subject = form?.querySelector<HTMLSelectElement>("#asunto");
      if (!form || !subject) return;

      subject.value = intent.dataset.contactIntent ?? "";
      form.scrollIntoView({ block: "start", behavior: "smooth" });
      subject.focus({ preventScroll: true });
    });
  });
}

function initForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-form]");
  if (!form) return;
  const contactForm = form;

  const submitBtn = contactForm.querySelector<HTMLButtonElement>('[type="submit"]');
  const submitLabel = contactForm.querySelector<HTMLElement>(".form__submit-label");
  const submitSpinner = contactForm.querySelector<HTMLElement>(".form__submit-spinner");
  const successPanel = document.querySelector<HTMLElement>("[data-form-success]");
  const errorSummary = contactForm.querySelector<HTMLElement>("[data-form-errors]");
  const errorList = contactForm.querySelector<HTMLUListElement>("[data-form-errors-list]");
  const statusPanel = document.querySelector<HTMLElement>("[data-form-status]");
  const statusMessage = document.querySelector<HTMLElement>("[data-form-status-message]");

  document.querySelectorAll<HTMLAnchorElement>('a[href="#contact-form"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(() => contactForm.querySelector<HTMLSelectElement>("#asunto")?.focus(), 0);
    });
  });

  function getRequiredFields(): FormField[] {
    return Array.from(contactForm.querySelectorAll<FormField>("[required]"));
  }

  function clearErrors(): void {
    contactForm.querySelectorAll(".field--error").forEach((field) => field.classList.remove("field--error"));
    contactForm.querySelectorAll<FormField>("[aria-invalid]").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    contactForm.querySelectorAll(".field__error-msg").forEach((message) => message.remove());
    errorList?.replaceChildren();
    if (errorSummary) errorSummary.hidden = true;
  }

  function clearStatus(): void {
    if (statusPanel) statusPanel.hidden = true;
  }

  function fieldMessage(field: FormField): string | null {
    const label = field.labels?.[0]?.textContent?.trim() ?? "Este campo";
    if (field.value.trim() === "") return label + ": este campo es obligatorio.";
    if (field instanceof HTMLInputElement && field.type === "email" && !field.validity.valid) {
      return label + ": escribe un correo válido.";
    }
    return null;
  }

  function showFieldError(field: FormField, message: string): void {
    const wrapper = field.closest(".field");
    if (!wrapper) return;

    wrapper.classList.add("field--error");
    field.setAttribute("aria-invalid", "true");
    const errorId = field.id + "-error";
    const describedBy = field.getAttribute("aria-describedby");
    field.setAttribute("aria-describedby", [describedBy, errorId].filter(Boolean).join(" "));

    const fieldMessage = document.createElement("p");
    fieldMessage.className = "field__error-msg";
    fieldMessage.id = errorId;
    fieldMessage.textContent = message.replace(/^[^:]+:\s*/, "");
    wrapper.appendChild(fieldMessage);

    const item = document.createElement("li");
    item.textContent = message;
    errorList?.appendChild(item);
  }

  function validate(): FormField[] {
    clearErrors();
    const invalidFields = getRequiredFields().filter((field) => {
      const message = fieldMessage(field);
      if (!message) return false;
      showFieldError(field, message);
      return true;
    });

    if (invalidFields.length > 0 && errorSummary) {
      errorSummary.hidden = false;
      errorSummary.focus();
    }

    return invalidFields;
  }

  function setSubmitting(submitting: boolean): void {
    if (submitBtn) {
      submitBtn.disabled = submitting;
      submitBtn.setAttribute("aria-busy", String(submitting));
    }
    contactForm.querySelectorAll<FormField>("input, select, textarea").forEach((field) => {
      if (field.name !== "botcheck") field.disabled = submitting;
    });
    if (submitLabel) submitLabel.hidden = submitting;
    if (submitSpinner) submitSpinner.hidden = !submitting;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    dispatchAnalytics({
      event: "contact_form_submit",
      form_id: contactForm.id || "contact-form",
    });

    const invalidFields = validate();
    if (invalidFields.length > 0) {
      dispatchAnalytics({
        event: "contact_form_invalid",
        form_id: contactForm.id || "contact-form",
        invalid_fields: invalidFields.map((field) => field.id || field.name).join(","),
      });
      return;
    }

    const formData = new FormData(contactForm);
    setSubmitting(true);
    try {
      const response = await fetch(SITE.web3forms.endpoint, {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { success: boolean; message?: string };
      if (!data.success) throw new Error(data.message ?? "No pudimos enviar el formulario.");

      dispatchAnalytics({
        event: "contact_form_success",
        form_id: contactForm.id || "contact-form",
      });
      contactForm.hidden = true;
      if (successPanel) {
        successPanel.hidden = false;
        successPanel.focus();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error de red";
      dispatchAnalytics({
        event: "contact_form_error",
        form_id: contactForm.id || "contact-form",
        error_message: message,
      });
      if (statusMessage) {
        statusMessage.textContent =
          error instanceof TypeError
            ? "Revisa tu conexión e inténtalo de nuevo. Tu mensaje sigue escrito en el formulario."
            : "No pudimos enviar tu mensaje. Inténtalo de nuevo. Tu mensaje sigue escrito en el formulario.";
      }
      setSubmitting(false);
      if (statusPanel) {
        statusPanel.hidden = false;
        statusPanel.focus();
      }
    }
  });
}

document.addEventListener("astro:page-load", () => {
  initContactIntents();
  initForm();
});
