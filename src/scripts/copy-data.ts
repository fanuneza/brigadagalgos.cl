const BANK_DATA = `Nombre: Fundación Brigada Galgos
RUT: 65.132.425-4
Banco: Mercado Pago
Tipo de cuenta: Cuenta Vista
Número de cuenta: 1073480715
Email: contacto@brigadagalgos.cl`;

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    window.prompt("Copiá estos datos:", value);
  }
}

function showCopiedTooltip(target: HTMLElement) {
  const existing = target.querySelector(".copy-tooltip");
  if (existing) return;

  const tooltip = document.createElement("span");
  tooltip.className = "copy-tooltip";
  tooltip.textContent = "Copiado";
  target.appendChild(tooltip);

  requestAnimationFrame(() => tooltip.classList.add("copy-tooltip--visible"));

  setTimeout(() => {
    tooltip.classList.remove("copy-tooltip--visible");
    tooltip.addEventListener("transitionend", () => tooltip.remove(), { once: true });
  }, 1500);
}

function initCopyData() {
  const btn = document.getElementById("copy-bank-data") as HTMLButtonElement | null;
  const lineButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-copy-value]")];

  lineButtons.forEach((button) => {
    const value = button.dataset.copyValue;
    if (!value) {
      return;
    }

    button.addEventListener("click", async () => {
      await copyText(value);
      showCopiedTooltip(button);
    });
  });

  if (btn) {
    btn.addEventListener("click", async () => {
      await copyText(BANK_DATA);
      showCopiedTooltip(btn);
    });
  }
}

document.addEventListener("astro:page-load", initCopyData);
