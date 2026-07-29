// IndexNow key shared between the astro.config.mjs integration and the
// key-file endpoint (src/pages/<key>.txt.ts must keep matching this value).
export const INDEXNOW_KEY = "591c2b87f0b68c44f260215f5d8e9da3";

export const SITE = {
  name: "Brigada Galgos",
  legalName: "Fundación Brigada Galgos",
  description: "Rescatamos, rehabilitamos y reubicamos galgos en Chile hasta encontrarles una familia segura.",
  siteUrl: "https://brigadagalgos.cl",
  logoPath: "/images/brigada-galgos-logo.png",
  ogImagePath: "/images/brigada-galgos-og-image.jpg",
  consentCookie: "brigadagalgos_consent",
  gtmContainerId: "GTM-M2RN5B38",
  whatsapp: "https://wa.me/56987076101",
  whatsappPhone: "+56 9 8707 6101",
  adoptionForm: "https://forms.gle/4P7SnC229PHzXuRG6",
  fosterForm: "https://forms.gle/3YHPo8KKnCiySbCo6",
  email: "contacto@brigadagalgos.cl",
  esponsor: "https://esponsor.com/brigadagalgos",
  instagram: "https://www.instagram.com/brigadagalgos/",
  facebook: "https://www.facebook.com/p/Brigada-Galgos-100090629653797/",
  // Public client-side key for https://web3forms.com; safe to commit.
  web3forms: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "ef1e3d39-d9cf-4778-84c4-91e619f1cfeb",
  },
};

// Single source of truth for the site's navigable destinations. The navbar
// and footer legitimately show different subsets in different orders, so
// each surface below is its own ordered list of references into this map —
// edit a label or URL once here and both surfaces stay in sync.
export interface NavEntry {
  href: string;
  label: string;
}

export const NAV_ENTRIES = {
  adoptar: { href: "/adoptar/", label: "Adoptar" },
  hogarTemporal: { href: "/hogar-temporal/", label: "Hogar temporal" },
  historias: { href: "/casos-de-exito/", label: "Historias" },
  colaboradores: { href: "/colaboradores/", label: "Colaboradores" },
  contacto: { href: "/contacto/", label: "Contacto" },
  porQueGalgos: { href: "/por-que-galgos/", label: "Por qué galgos" },
  preguntasFrecuentes: { href: "/preguntas-frecuentes/", label: "Preguntas frecuentes" },
  blog: { href: "/blog/", label: "Blog" },
} as const satisfies Record<string, NavEntry>;

// Desktop nav + mobile drawer (Navbar.astro).
export const NAVBAR_LINKS: NavEntry[] = [
  NAV_ENTRIES.adoptar,
  NAV_ENTRIES.hogarTemporal,
  NAV_ENTRIES.historias,
  NAV_ENTRIES.colaboradores,
  NAV_ENTRIES.contacto,
];

// Footer "Navegar" column (Footer.astro) — longer set, different order.
export const FOOTER_LINKS: NavEntry[] = [
  NAV_ENTRIES.adoptar,
  NAV_ENTRIES.historias,
  NAV_ENTRIES.hogarTemporal,
  NAV_ENTRIES.porQueGalgos,
  NAV_ENTRIES.preguntasFrecuentes,
  NAV_ENTRIES.colaboradores,
  NAV_ENTRIES.blog,
  NAV_ENTRIES.contacto,
];
