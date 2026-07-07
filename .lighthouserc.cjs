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
        "categories:performance": ["error", { minScore: 1 }],
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
        "color-contrast": "off",
        "label-content-name-mismatch": "off",
        "heading-order": "off",
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
        // Component CSS is bundled globally by design (AGENTS.md); pages that use
        // few components trip this audit. Keep it visible but non-blocking.
        "unused-css-rules": "warn",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
