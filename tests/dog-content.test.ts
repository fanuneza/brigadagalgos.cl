import { describe, expect, it } from "vitest";
import {
  buildAdoptionDogCards,
  buildStoryDogSummaries,
  buildDogMetaDescription,
  filterActiveAdoptionDogs,
  getAdoptionDecisionData,
  isAdoptionDog,
  isSuccessDog,
  truncateAtWordBoundary,
  type AdoptionDogEntry,
  type SuccessDogEntry,
} from "../src/utils/dog-content";

function makeAdoptionDogEntry(overrides: { id?: string; data?: Record<string, unknown> } = {}): AdoptionDogEntry {
  return {
    id: overrides.id ?? "turron",
    collection: "dogs",
    data: {
      status: "adopcion",
      name: "Turrón",
      sex: "Macho",
      age: "6 años aprox.",
      weight: "Talla grande",
      details: "A Turrón lo arrojaron desde una camioneta en Isla de Maipo. Hoy está recuperado.",
      currentNeed: "Adopción",
      characterSketch: "Tranquilo y recuperado, necesita una rutina sin sobresaltos.",
      gallery: [],
      active: true,
      ...overrides.data,
    },
  } as unknown as AdoptionDogEntry;
}

function makeSuccessDogEntry(overrides: { id?: string; data?: Record<string, unknown> } = {}): SuccessDogEntry {
  return {
    id: overrides.id ?? "mora",
    collection: "dogs",
    data: {
      status: "exito",
      name: "Mora",
      story: "Mora fue adoptada y hoy es parte de esa misma familia.",
      gallery: [],
      ...overrides.data,
    },
  } as unknown as SuccessDogEntry;
}

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

describe("unified dogs collection helpers", () => {
  it("preserves explicit adoption decision statuses, including unknown and case-by-case", () => {
    const decisionData = getAdoptionDecisionData({
      location: "Hogar temporal",
      adoptionFacts: {
        compatibility: {
          children: "sí",
          cats: "no",
          femaleDogs: "caso a caso",
          maleDogs: "sin información confirmada",
        },
        homeGuidance: "Necesita una presentación gradual.",
      },
    });

    expect(decisionData).toEqual({
      location: "Hogar temporal",
      compatibility: {
        children: "sí",
        cats: "no",
        femaleDogs: "caso a caso",
        maleDogs: "sin información confirmada",
      },
      homeGuidance: "Necesita una presentación gradual.",
    });
    expect(decisionData?.compatibility.maleDogs).not.toBe("sí");
  });

  it("keeps decision data absent when no confirmed structured facts exist", () => {
    expect(getAdoptionDecisionData({ location: "Isla de Maipo" })).toBeUndefined();
  });

  it("filters entries by status with the type guards", () => {
    const entries = [
      makeAdoptionDogEntry({ id: "turron" }),
      makeSuccessDogEntry({ id: "mora" }),
      makeAdoptionDogEntry({ id: "blue", data: { name: "Blue", sex: "Hembra" } }),
    ];

    expect(entries.filter(isAdoptionDog).map((entry) => entry.id)).toEqual(["turron", "blue"]);
    expect(entries.filter(isSuccessDog).map((entry) => entry.id)).toEqual(["mora"]);
  });

  it("excludes hidden adoption dogs (active: false) but keeps the rest", () => {
    const entries = [
      makeAdoptionDogEntry({ id: "activo" }),
      makeAdoptionDogEntry({
        id: "oculto",
        data: { active: false, hiddenSince: new Date("2026-06-01"), hiddenReason: "Hogar temporal planea adoptar" },
      }),
      makeAdoptionDogEntry({ id: "sin-marca", data: { active: undefined } }),
    ];

    expect(filterActiveAdoptionDogs(entries).map((entry) => entry.id)).toEqual(["activo", "sin-marca"]);
  });

  it("builds story summaries from status: exito entries, truncating only cardStory", async () => {
    const longStory =
      "A Belén la rescatamos con un tumor mamario maligno y una patita tan dañada que tuvimos que amputarla. Su pronóstico era duro y sabíamos que su tiempo podía ser corto. Igual apareció una familia que la eligió y hoy Belén vive acompañada, con cuidados, descanso y una rutina tranquila.";
    expect(longStory.length).toBeGreaterThan(260);

    const entry = makeSuccessDogEntry({
      id: "belen",
      data: { name: "Belén", story: longStory, instagramUrl: "https://www.instagram.com/p/ejemplo/" },
    });

    const [summary] = await buildStoryDogSummaries([entry]);
    expect(summary.id).toBe("belen");
    expect(summary.name).toBe("Belén");
    expect(summary.story).toBe(longStory);
    expect(summary.cardStory).not.toBe(longStory);
    expect(summary.cardStory.length).toBeLessThanOrEqual(261);
    expect(summary.instagramUrl).toBe("https://www.instagram.com/p/ejemplo/");
    expect(summary.photos).toEqual([]);
  });

  it("builds adoption cards from status: adopcion entries with the legacy shape", async () => {
    const entry = makeAdoptionDogEntry({ id: "turron" });

    const [card] = await buildAdoptionDogCards([entry]);
    expect(card).toEqual({
      id: "turron",
      name: "Turrón",
      sex: "Macho",
      age: "6 años aprox.",
      ageType: "adulto",
      weight: "Talla grande",
      details: "A Turrón lo arrojaron desde una camioneta en Isla de Maipo. Hoy está recuperado.",
      location: undefined,
      adoptionFacts: undefined,
      currentNeed: "Adopción",
      characterSketch: "Tranquilo y recuperado, necesita una rutina sin sobresaltos.",
      instagramUrl: undefined,
      pictures: [],
    });
  });

  it("keeps location and explicit adoption facts in the derived card model", async () => {
    const entry = makeAdoptionDogEntry({
      data: {
        location: "Hogar temporal",
        adoptionFacts: {
          compatibility: {
            children: "sin información confirmada",
            cats: "no",
            femaleDogs: "sí",
            maleDogs: "caso a caso",
          },
          personalityBehavior: "Busca mimos cuando ya confía.",
        },
      },
    });

    const [card] = await buildAdoptionDogCards([entry]);

    expect(card.location).toBe("Hogar temporal");
    expect(card.adoptionFacts).toEqual({
      location: "Hogar temporal",
      compatibility: {
        children: "sin información confirmada",
        cats: "no",
        femaleDogs: "sí",
        maleDogs: "caso a caso",
      },
      personalityBehavior: "Busca mimos cuando ya confía.",
    });
  });
});
