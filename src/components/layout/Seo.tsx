
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
}) => {
  return (
    <>
      {title && <title>{title}</title>}
      {description && (
        <meta name="description" content={description} />
      )}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}
      <meta name="robots" content={robots} />
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && (
        <meta property="og:description" content={description} />
      )}
      {image && <meta property="og:image" content={image} />}
      {canonicalUrl && (
        <meta property="og:url" content={canonicalUrl} />
      )}
      <meta property="og:type" content="website" />
      {/* Twitter */}
      {title && <meta name="twitter:title" content={title} />}
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
};

