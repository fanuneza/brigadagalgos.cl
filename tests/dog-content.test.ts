import { describe, expect, it } from "vitest";
import { buildCardStoryExcerpt } from "../src/utils/story-card-copy";
import { clampAtWordBoundary, buildDogMetaDescription } from "../src/utils/dog-content";

describe("buildCardStoryExcerpt", () => {
  it("keeps short stories unchanged", () => {
    const story = "Mora fue adoptada y hoy duerme en sofá y sale a pasear con calma.";
    expect(buildCardStoryExcerpt(story, 165)).toBe(story);
  });

  it("cuts long stories at a sentence break when possible", () => {
    const story =
      "A Belén la rescatamos con un tumor mamario maligno y una patita tan dañada que tuvimos que amputarla. Su pronóstico era duro y sabíamos que su tiempo podía ser corto. Igual apareció una familia que la eligió.";

    expect(buildCardStoryExcerpt(story, 140)).toBe(
      "A Belén la rescatamos con un tumor mamario maligno y una patita tan dañada que tuvimos que amputarla."
    );
  });

  it("falls back to an ellipsis when no clean sentence break fits", () => {
    const story =
      "Belén vive acompañada con una familia que la eligió para darle cuidados, descanso, compañía diaria y una rutina tranquila mientras sigue adaptándose.";

    const excerpt = buildCardStoryExcerpt(story, 90);
    expect(excerpt.length).toBeLessThanOrEqual(91);
    expect(excerpt.endsWith("…")).toBe(true);
  });
});

describe("clampAtWordBoundary", () => {
  it("returns short text untouched", () => {
    expect(clampAtWordBoundary("Hola", 20)).toBe("Hola");
  });

  it("clamps at a word boundary and appends an ellipsis", () => {
    const result = clampAtWordBoundary("Un galgo tranquilo que busca una familia paciente", 30);
    expect(result.length).toBeLessThanOrEqual(30);
    expect(result.endsWith("…")).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });

  it("drops trailing punctuation before the ellipsis", () => {
    const result = clampAtWordBoundary("Llegó desde Maipú, y hoy descansa tranquilo en su cama", 20);
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
