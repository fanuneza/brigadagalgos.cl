import { expect, test } from "@playwright/test";

test("foster page explains support, the transition and both ways to start", async ({ page }) => {
  await page.goto("/hogar-temporal/");

  await expect(page.getByRole("heading", { name: "Un tiempo acotado, con apoyo de Brigada" })).toBeVisible();
  await expect(page.getByText("Sofía Canela pasó por hogar temporal")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Brigada se encarga de" })).toBeVisible();
  await expect(page.getByText("Coordinar el siguiente paso cuando aparezca la familia adecuada.")).toBeVisible();
  await expect(page.getByText("Nunca se debe soltar al galgo.")).toBeVisible();

  const form = page.getByRole("link", { name: /Puedo ser hogar temporal/ }).last();
  await expect(form).toHaveAttribute("data-application-form-url");
  await expect(page.getByRole("link", { name: "Escríbenos directo por WhatsApp" })).toBeVisible();
});
