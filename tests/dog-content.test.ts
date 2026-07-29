import { describe, expect, it } from "vitest";
import { truncateAtWordBoundary, buildDogMetaDescription } from "../src/utils/dog-content";

describe("truncateAtWordBoundary (sentence-break mode, story cards)", () => {
  it("defaults to the 260-character content rule for success stories", () => {
    const fits = "x".repeat(260);
    expect(truncateAtWordBoundary(fits, { preferSentenceBreak: true })).toBe(fits);

    const overflow = "x".repeat(261);
    const excerpt = truncateAtWordBoundary(overflow, { preferSentenceBreak: true });
    expect(excerpt).not.toBe(overflow);
    expect(excerpt.length).toBeLessThanOrEqual(261);
  });

  it("keeps short stories unchanged", () => {
    const story = "Mora fue adoptada y hoy duerme en sofá y sale a pasear con calma.";
    expect(truncateAtWordBoundary(story, { preferSentenceBreak: true, maxCharacters: 165 })).toBe(story);
  });

  it("cuts long stories at a sentence break when possible", () => {
    const story =
      "A Belén la rescatamos con un tumor mamario maligno y una patita tan dañada que tuvimos que amputarla. Su pronóstico era duro y sabíamos que su tiempo podía ser corto. Igual apareció una familia que la eligió.";

    expect(truncateAtWordBoundary(story, { preferSentenceBreak: true, maxCharacters: 140 })).toBe(
      "A Belén la rescatamos con un tumor mamario maligno y una patita tan dañada que tuvimos que amputarla."
    );
  });

  it("falls back to an ellipsis when no clean sentence break fits", () => {
    const story =
      "Belén vive acompañada con una familia que la eligió para darle cuidados, descanso, compañía diaria y una rutina tranquila mientras sigue adaptándose.";

    const excerpt = truncateAtWordBoundary(story, { preferSentenceBreak: true, maxCharacters: 90 });
    expect(excerpt.length).toBeLessThanOrEqual(91);
    expect(excerpt.endsWith("…")).toBe(true);
  });
});

describe("truncateAtWordBoundary (word-break mode, meta descriptions)", () => {
  it("returns short text untouched", () => {
    expect(truncateAtWordBoundary("Hola", { maxCharacters: 20 })).toBe("Hola");
  });

  it("clamps at a word boundary and appends an ellipsis", () => {
    const result = truncateAtWordBoundary("Un galgo tranquilo que busca una familia paciente", { maxCharacters: 30 });
    expect(result.length).toBeLessThanOrEqual(30);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    const result = truncateAtWordBoundary("Llegó desde Maipú, y hoy descansa tranquilo en su cama", {
      maxCharacters: 20,
    });
    expect(result).not.toMatch(/[,;:.]…$/);
  });
});

describe("buildDogMetaDescription", () => {
  it("mentions the dog name and stays within SEO bounds", () => {
    const description = buildDogMetaDescription({
      name: "Turrón",
      details:
        "A Turrón lo arrojaron desde una camioneta en Isla de Maipo y hubo que operar su fractura. Hoy está recuperado, pero necesita un ambiente tranquilo, sin niños pequeños, sin gatos y sin perros machos.",
    });
    expect(description).toContain("Turrón");
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(155);
  });
});
