import { SITE } from "../config/site.ts";
import { faqPairs } from "../config/faq";

interface StructuredDataInput {
  canonicalUrl: string;
  title: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
  pathname: string;
  breadcrumbNames?: Record<string, string>;
}

type JsonLdNode = Record<string, unknown>;

interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
}

const breadcrumbLabels: Record<string, string> = {
  adoptar: "Adoptar",
  "hogar-temporal": "Hogar temporal",
  "por-que-galgos": "Por qué galgos",
  "preguntas-frecuentes": "Preguntas frecuentes",
  colaboradores: "Colaboradores",
  blog: "Blog",
  donar: "Donar",
  contacto: "Contacto",
  "politica-de-cookies": "Política de cookies",
};

export function buildStructuredDataGraph(input: StructuredDataInput): JsonLdGraph {
  const { canonicalUrl, title, description, imageUrl, logoUrl, pathname } = input;
  const { siteUrl, email, whatsappPhone, instagram, facebook, name, legalName } = SITE;

  const logoImage: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${siteUrl}/#logo`,
    url: logoUrl,
    contentUrl: logoUrl,
    width: 512,
    height: 512,
    caption: `${name} logo`,
  };

  const primaryImage: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${siteUrl}/#primaryimage`,
    url: imageUrl,
    contentUrl: imageUrl,
    width: 1200,
    height: 630,
    caption: "Brigada Galgos rescata, rehabilita y reubica galgos en Chile",
  };

  const organization: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteUrl}/#organization`,
    name,
    legalName,
    alternateName: [legalName, "Fundación Brigada Galgos Chile"],
    url: siteUrl,
    logo: { "@id": `${siteUrl}/#logo` },
    image: { "@id": `${siteUrl}/#primaryimage` },
    description: SITE.description,
    email,
    telephone: whatsappPhone,
    taxID: "65.132.425-4",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
    },
    areaServed: { "@type": "Country", name: "Chile" },
    sameAs: [instagram, facebook],
    knowsAbout: ["Rescate de galgos", "Adopción responsable", "Bienestar animal", "Rehabilitación de perros"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: whatsappPhone,
        email,
        availableLanguage: ["Spanish"],
        areaServed: "CL",
      },
    ],
  };

  const website: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`,
    name,
    alternateName: [legalName, "brigadagalgos.cl"],
    description: SITE.description,
    inLanguage: "es-CL",
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  const webpage: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: "es-CL",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    primaryImageOfPage: { "@id": `${siteUrl}/#primaryimage` },
    image: { "@id": `${siteUrl}/#primaryimage` },
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  const graph: JsonLdNode[] = [logoImage, primaryImage, organization, website, webpage];

  if (pathSegments.length > 0) {
    graph.push(buildBreadcrumbList(siteUrl, pathSegments, input.breadcrumbNames));
  }

  if (pathname === "/por-que-galgos/") {
    graph.push(buildGreyhoundFaqPage());
  }

  if (pathname === "/preguntas-frecuentes/") {
    graph.push(buildFaqStructuredData(faqPairs));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function buildBreadcrumbList(
  siteUrl: string,
  pathSegments: string[],
  nameOverrides?: Record<string, string>
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
      ...pathSegments.map((seg, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: nameOverrides?.[seg] ?? breadcrumbLabels[seg] ?? seg,
        item: `${siteUrl}/${pathSegments.slice(0, i + 1).join("/")}/`,
      })),
    ],
  };
}

function buildGreyhoundFaqPage(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Los galgos son tranquilos en casa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Son perros tranquilos en casa y se adaptan bien a departamentos. Con dos caminatas al día están felices.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se llevan bien con niños y otros animales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La mayoría se lleva bien con niños y otros animales cuando se hace una presentación adecuada.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto ejercicio necesita un galgo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dos caminatas al día son suficientes. Son atletas de carrera corta: explosivos en pista, pero tranquilos en casa.",
        },
      },
    ],
  };
}

function buildFaqStructuredData(qaPairs: Array<{ question: string; answer: string; details?: string[] }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qaPairs.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.details ? `${qa.answer} ${qa.details.join(" ")}` : qa.answer,
      },
    })),
  };
}

export function buildWebSiteStructuredData(): JsonLdNode {
  const { siteUrl, name, legalName } = SITE;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    alternateName: legalName,
    url: siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`,
  };
}
