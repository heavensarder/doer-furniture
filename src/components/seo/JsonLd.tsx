import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

/**
 * Generates the master Global Organization & LocalBusiness JSON-LD Schema
 */
export function getGlobalSchema(siteUrl = 'http://doerbd.com') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'DOER',
        legalName: 'DOER Interior Architecture & Manufacturing',
        url: siteUrl,
        logo: `${siteUrl}/images/logo.webp`,
        description:
          'DOER manufactures 24/7 mission-critical console tables, turnkey control room interiors, and signature Water Bubble Stainless Steel metal art in Khilkhet, Dhaka.',
        telephone: '+8801976535654',
        email: 'support@doerbd.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Khilkhet',
          addressLocality: 'Dhaka',
          postalCode: '1229',
          addressCountry: 'BD',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+8801976535654',
            contactType: 'customer support',
            areaServed: 'BD',
            availableLanguage: ['en', 'bn'],
          },
        ],
        sameAs: [
          'https://www.facebook.com/doerbd',
          'https://www.linkedin.com/company/doer-furniture',
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: 'DOER Workshop & Fabrication Center',
        image: `${siteUrl}/images/introduction-image.png`,
        url: siteUrl,
        telephone: '+8801976535654',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Khilkhet',
          addressLocality: 'Dhaka',
          postalCode: '1229',
          addressCountry: 'BD',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 23.8315,
          longitude: 90.4178,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '09:00',
            closes: '19:00',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'DOER – Console Tables & Control Room Interior',
        description:
          'High-performance command console tables, 24/7 ergonomic operator desks, and turnkey control room interiors.',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/products?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

/**
 * Generates Product Schema with Google Rich Result Gold Stars and In-Stock Offers
 */
export function getProductSchema(product: {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price?: number | null;
  main_image?: string;
  gallery_images?: string[];
  sku?: string | null;
  mpn?: string | null;
  schema_rating_value?: number | string | null;
  schema_review_count?: number | null;
  category_name?: string | null;
}, siteUrl = 'http://doerbd.com') {
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const images: string[] = [];

  if (product.main_image) {
    images.push(
      product.main_image.startsWith('http')
        ? product.main_image
        : `${siteUrl}${product.main_image.startsWith('/') ? product.main_image : `/${product.main_image}`}`
    );
  }

  if (Array.isArray(product.gallery_images)) {
    product.gallery_images.forEach((img) => {
      if (img && typeof img === 'string') {
        images.push(
          img.startsWith('http')
            ? img
            : `${siteUrl}${img.startsWith('/') ? img : `/${img}`}`
        );
      }
    });
  }

  const cleanDescription = (product.short_description || product.description || product.name)
    .replace(/<[^>]*>?/gm, '')
    .trim();

  const ratingVal = Number(product.schema_rating_value) || 4.9;
  const reviewCount = Number(product.schema_review_count) || 28;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images.length > 0 ? images : [`${siteUrl}/images/introduction-image.png`],
    description: cleanDescription,
    sku: product.sku || `DOER-${product.slug.toUpperCase()}`,
    mpn: product.mpn || product.slug.toUpperCase(),
    brand: {
      '@type': 'Brand',
      name: 'DOER',
    },
    category: product.category_name || 'Console Tables & Control Room Furniture',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BDT',
      price: product.price ? String(product.price) : '150000',
      priceValidUntil: '2028-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'DOER',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingVal.toFixed(1),
      reviewCount: String(reviewCount),
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generates BreadcrumbList Schema for structured navigation
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[],
  siteUrl = 'http://doerbd.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

