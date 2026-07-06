import { SITE } from "../config/site";
import { dispatchAnalytics } from "../utils/analytics";

function showToast(message: string, duration = 4000): void {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast--visible"));
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, duration);
}

function initForm() {
  const form = document.querySelector<HTMLFormElement>("[data-form]");

  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const submitLabel = form.querySelector<HTMLElement>(".form__submit-label");
  const submitSpinner = form.querySelector<HTMLElement>(".form__submit-spinner");
  const successPanel = document.querySelector<HTMLElement>("[data-form-success]");

  function getRequiredFields(): HTMLElement[] {
    return Array.from(form!.querySelectorAll<HTMLElement>("[required]"));
  }

  function clearErrors(): void {
    form!.querySelectorAll(".field--error").forEach((f) => f.classList.remove("field--error"));
    form!.querySelectorAll(".field__error-msg").forEach((m) => m.remove());
  }

  function showFieldError(field: HTMLElement, message: string): void {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    wrapper.classList.add("field--error");
    const errId = `${field.id}-error`;
    field.setAttribute("aria-describedby", errId);
    const msg = document.createElement("p");
    msg.className = "field__error-msg";
    msg.id = errId;
    msg.textContent = message;
    wrapper.appendChild(msg);
  }

  function validate(): boolean {
    clearErrors();
    let valid = true;
    getRequiredFields().forEach((field) => {
      const input = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      let isEmpty: boolean;
      if (input.type === "checkbox") {
        isEmpty = !(input as HTMLInputElement).checked;
      } else if (input.type === "radio") {
        isEmpty = !form!.querySelector<HTMLInputElement>(`[name="${input.name}"]:checked`);
      } else {
        isEmpty = input.value.trim() === "";
      }
      if (isEmpty) {
        showFieldError(field, "Este campo es obligatorio.");
        valid = false;
      }
    });
    return valid;
  }

  function setSubmitting(submitting: boolean): void {
    if (!submitBtn) return;
    submitBtn.disabled = submitting;
    form!
      .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")
      .forEach((el) => {
        el.disabled = submitting;
      });
    if (submitLabel) submitLabel.hidden = submitting;
    if (submitSpinner) submitSpinner.hidden = !submitting;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    dispatchAnalytics({
      event: "contact_form_submit",
      form_id: form.id || "contact-form",
    });

    if (!validate()) {
      const invalidFields = getRequiredFields()
        .filter((field) => {
          const input = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          if (input.type === "checkbox") {
            return !(input as HTMLInputElement).checked;
          } else if (input.type === "radio") {
            return !form.querySelector<HTMLInputElement>(`[name="${input.name}"]:checked`);
          } else {
            return input.value.trim() === "";
          }
        })
        .map((field) => field.id || field.getAttribute("name") || "unknown")
        .join(",");

      dispatchAnalytics({
        event: "contact_form_invalid",
        form_id: form.id || "contact-form",
        invalid_fields: invalidFields,
      });
      return;
    }

    const formData = new FormData(form!);
    setSubmitting(true);
    try {
      const res = await fetch(SITE.web3forms.endpoint, {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        dispatchAnalytics({
          event: "contact_form_success",
          form_id: form.id || "contact-form",
        });
        form!.hidden = true;
        if (successPanel) successPanel.hidden = false;
      } else {
        dispatchAnalytics({
          event: "contact_form_error",
          form_id: form.id || "contact-form",
          error_message: data.message ?? "API Error",
        });
        showToast(data.message ?? "No pudimos enviar el formulario. Inténtalo de nuevo.");
        setSubmitting(false);
      }
    } catch {
      dispatchAnalytics({
        event: "contact_form_error",
        form_id: form.id || "contact-form",
        error_message: "Network Error",
      });
      showToast("Error de red. Revisa tu conexión e inténtalo de nuevo.");
      setSubmitting(false);
    }
  });
}

document.addEventListener("astro:page-load", initForm);
