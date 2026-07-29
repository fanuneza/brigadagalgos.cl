// Axe/Lighthouse rules disabled for pre-existing design/content issues.
// Single-sourced with tests/a11y.spec.ts — edit the JSON file only.
const a11yDisabledRules = require("./tests/a11y-disabled-rules.json");

module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["/", "/adoptar/", "/contacto/", "/donar/", "/hogar-temporal/"],
      numberOfRuns: 1,
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        // Keep category regressions strict without failing on Lighthouse's
        // normal 0.99 rounding variance; concrete metrics below remain capped.
        "categories:performance": ["error", { minScore: 0.99 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.15 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        // Lighthouse reports the current home-page bfcache miss as "Not actionable"
        // because Chrome evicts the page after too much buffered network data.
        "bf-cache": "off",
        // Existing issues should remain visible in reports, but not block CI.
        // Disabled axe rules are single-sourced in tests/a11y-disabled-rules.json.
        ...Object.fromEntries(a11yDisabledRules.map((rule) => [rule, "off"])),
        "lcp-lazy-loaded": "off",
        "aria-hidden-focus": "off",
        "target-size": "off",
        "cls-culprits-insight": "off",
        "dom-size": "off",
        // Insights are informational only.
        "forced-reflow-insight": "off",
        "network-dependency-tree-insight": "off",
        "image-delivery-insight": "off",
        "dom-size-insight": "off",
        "lcp-discovery-insight": "off",
        "render-blocking-insight": "off",
        // Minor image and resource optimizations are monitored outside CI.
        "uses-responsive-images": "off",
        "modern-image-formats": "off",
        "render-blocking-resources": "off",
        // Component CSS is bundled globally by design (AGENTS.md); pages that
        // use few components trip this audit even when the bundle is expected.
        "unused-css-rules": "off",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
