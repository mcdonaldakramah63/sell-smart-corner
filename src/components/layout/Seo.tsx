
import React from "react";

interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  keywords?: string;
  robots?: string;
  children?: React.ReactNode;
  jsonLd?: object;
  breadcrumbJsonLd?: object;
  aggregateRatingJsonLd?: object;
  locale?: string;
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonicalUrl,
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  keywords,
  robots = "index,follow",
  children,
  jsonLd,
  breadcrumbJsonLd,
  aggregateRatingJsonLd,
  locale = "en-US",
}) => {
  // Organization schema (site-wide, as visible)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Used Market",
    url: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/",
    logo: "https://lovable.dev/opengraph-image-p98pqg.png",
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-800-000-0000",
        contactType: "Customer Service",
      }
    ]
  };
  // WebSite schema for potential search action
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/",
    name: "Used Market",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string",
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="content-language" content={locale} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="robots" content={robots} />
      {/* PWA/manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#2563eb" />
      {/* Hreflang example */}
      {canonicalUrl && <link rel="alternate" hrefLang={locale} href={canonicalUrl} />}
      {/* Sitename for google */}
      <meta itemProp="name" content="Used Market" />
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content="website" />
      {/* Twitter */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteJsonLd)
        }}
      />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {aggregateRatingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
        />
      )}
      {/* Resource Hints */}
      <link rel="preconnect" href="https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com" />
      {/* preload main logo */}
      <link rel="preload" as="image" href="https://lovable.dev/opengraph-image-p98pqg.png" />
      {/* Additional children */}
      {children}
    </>
  );
};
