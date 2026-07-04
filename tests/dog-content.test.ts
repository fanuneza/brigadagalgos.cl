import { describe, expect, it } from "vitest";
import { buildCardStoryExcerpt } from "../src/utils/story-card-copy";

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
