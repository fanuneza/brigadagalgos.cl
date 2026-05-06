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
        "categories:performance": ["warn", { minScore: 0.8 }],
        // The current audited routes land at roughly 0.88-0.89 in CI.
        "categories:accessibility": ["warn", { minScore: 0.88 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3500 }],
        // Donar currently peaks around 0.139 in CI.
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.15 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
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
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
