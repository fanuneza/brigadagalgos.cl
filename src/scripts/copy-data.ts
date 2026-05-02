import { showToast } from './form';

const btn = document.getElementById('copy-bank-data') as HTMLButtonElement | null;
const lineButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-copy-value]')];

const BANK_DATA = `Nombre: Fundación Brigada Galgos
RUT: 65.132.425-4
Banco: Mercado Pago
Tipo de cuenta: Cuenta Vista
Número de cuenta: 1073480715
Email: contacto@brigadagalgos.cl`;

async function copyText(value: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    window.prompt('Copiá estos datos:', value);
  }

  showToast(successMessage, 3000);
}

lineButtons.forEach((button) => {
  const value = button.dataset.copyValue;
  if (!value) {
    return;
  }

  button.addEventListener('click', async () => {
    await copyText(value, 'Línea copiada ✓');
  });
});

if (btn) {
  btn.addEventListener('click', async () => {
    await copyText(BANK_DATA, 'Datos copiados ✓');
  });
}
