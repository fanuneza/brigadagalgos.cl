import { expect, test } from "@playwright/test";

async function fillValidContactForm(page: import("@playwright/test").Page) {
  await page.getByLabel("Nombre").fill("Camila Soto");
  await page.getByLabel("Correo").fill("camila@example.com");
  await page.getByLabel("Asunto").selectOption("Adopción");
  await page.getByRole("textbox", { name: "Mensaje", exact: true }).fill("Quiero conocer el proceso de adopción.");
}

test("an intent routes to the matching form topic without clearing typed input", async ({ page }) => {
  await page.goto("/contacto/");
  await page.getByLabel("Nombre").fill("Camila Soto");
  await page.getByRole("textbox", { name: "Mensaje", exact: true }).fill("Ya escribí esta consulta.");

  await page.getByRole("button", { name: "Quiero adoptar" }).click();

  await expect(page.getByLabel("Asunto")).toHaveValue("Adopción");
  await expect(page.getByLabel("Nombre")).toHaveValue("Camila Soto");
  await expect(page.getByRole("textbox", { name: "Mensaje", exact: true })).toHaveValue("Ya escribí esta consulta.");
  await expect(page.getByLabel("Asunto")).toBeFocused();
});

test("invalid submission identifies fields and focuses the error summary", async ({ page }) => {
  await page.goto("/contacto/");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();

  const errors = page.locator("[data-form-errors]");
  await expect(errors).toBeVisible();
  await expect(errors).toContainText("Nombre: este campo es obligatorio.");
  await expect(errors).toContainText("Correo: este campo es obligatorio.");
  await expect(page.getByLabel("Nombre")).toHaveAttribute("aria-invalid", "true");
  await expect(errors).toBeFocused();
});

test("submission exposes pending and success states", async ({ page }) => {
  let completeRequest: (() => Promise<void>) | undefined;
  await page.route("https://api.web3forms.com/submit", async (route) => {
    await new Promise<void>((resolve) => {
      completeRequest = async () => {
        await route.fulfill({ contentType: "application/json", body: JSON.stringify({ success: true }) });
        resolve();
      };
    });
  });

  await page.goto("/contacto/");
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();

  await expect(page.getByRole("button", { name: "Enviando mensaje…" })).toBeDisabled();
  expect(completeRequest).toBeDefined();
  await completeRequest?.();

  await expect(page.locator("[data-form-success]")).toBeVisible();
  await expect(page.locator("[data-form]")).toBeHidden();
});

test("a failed submission preserves the message and offers recovery", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "Inténtalo otra vez" }),
    });
  });

  await page.goto("/contacto/");
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Enviar mensaje" }).click();

  await expect(page.locator("[data-form-status]")).toBeVisible();
  await expect(page.locator("[data-form-status]")).toContainText("Tu mensaje sigue escrito");
  await expect(page.getByRole("textbox", { name: "Mensaje", exact: true })).toHaveValue(
    "Quiero conocer el proceso de adopción."
  );
  await expect(page.getByRole("button", { name: "Enviar mensaje" })).toBeEnabled();
});
