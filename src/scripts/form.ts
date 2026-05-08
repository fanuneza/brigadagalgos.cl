export function showToast(message: string, duration = 4000): void {
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
    if (!validate()) return;

    const formData = new FormData(form!);
    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        form!.hidden = true;
        if (successPanel) successPanel.hidden = false;
      } else {
        showToast(data.message ?? "No pudimos enviar el formulario. Intentá de nuevo.");
        setSubmitting(false);
      }
    } catch {
      showToast("Error de red. Revisá tu conexión e intentá de nuevo.");
      setSubmitting(false);
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForm, { once: true });
  } else {
    initForm();
  }
}
