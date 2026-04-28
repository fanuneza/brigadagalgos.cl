import { showToast } from './form';

const btn = document.getElementById('copy-bank-data') as HTMLButtonElement | null;

const BANK_DATA = `Banco: [PENDIENTE]
Tipo de cuenta: [PENDIENTE]
Nº de cuenta: [PENDIENTE]
RUT: [PENDIENTE]
Nombre: Fundación Brigada Galgos
Email: brigadagalgos@gmail.com`;

const HAS_PENDIENTE = BANK_DATA.includes('[PENDIENTE]');

if (btn) {
  if (HAS_PENDIENTE) {
    btn.disabled = true;
  } else {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(BANK_DATA);
      } catch {
        window.prompt('Copiá estos datos:', BANK_DATA);
      }
      showToast('Datos copiados ✓', 3000);
    });
  }
}
