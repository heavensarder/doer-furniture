import type { Metadata } from 'next';
import pool from './db';
import { ensureSeoTables } from './seo-db';

export const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  return 'http://doerbd.com';
};

const DEFAULT_TITLE = 'DOER – High-Performance Console Tables, Control Room Interior & Metal Art Supply';
const DEFAULT_DESC =
  'DOER manufactures 24/7 mission-critical console tables, turnkey control room interiors, and signature Water Bubble Stainless Steel metal art in Khilkhet, Dhaka.';

export interface ConstructMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Synchronous metadata builder for fast fallback
 */
export function constructMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords,
  path = '',
  image,
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const siteUrl = getSiteUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const url = `${siteUrl}${cleanPath}`;
  const ogImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
    : `${siteUrl}/images/introduction-image.png`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: keywords || 'console tables, control room interior, metal art supply, command center consoles, water bubble stainless steel',
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'DOER – Console Tables & Control Room Interior',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
}

/**
 * Server-Side Dynamic Metadata Resolver:
 * Fetches page-specific or product-specific metadata from MySQL with fallbacks.
 */
export async function getDynamicPageMetadata(
  path: string,
  fallback?: ConstructMetadataProps
): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  try {
    await ensureSeoTables();

    // Query page metadata from seo_pages
    const [pageRows]: any = await pool.execute(
      'SELECT * FROM seo_pages WHERE page_path = ? LIMIT 1',
      [cleanPath]
    );

    // Query global settings
    const [settingsRows]: any = await pool.execute(
      'SELECT * FROM seo_settings LIMIT 1'
    );
    const globalSettings = settingsRows && settingsRows[0] ? settingsRows[0] : null;

    if (pageRows && pageRows.length > 0) {
      const p = pageRows[0];
      const title = p.meta_title || fallback?.title || globalSettings?.default_meta_title || DEFAULT_TITLE;
      const description = p.meta_description || fallback?.description || globalSettings?.default_meta_description || DEFAULT_DESC;
      const keywords = p.focus_keywords || fallback?.keywords || globalSettings?.default_keywords || '';
      const canonical = p.canonical_url || `${siteUrl}${cleanPath}`;
      const ogImage = p.og_image || fallback?.image || globalSettings?.default_og_image || '/images/introduction-image.png';
      const noIndex = p.robots_index === 0;

      const fullOgImage = ogImage.startsWith('http')
        ? ogImage
        : `${siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

      return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        keywords,
        alternates: {
          canonical,
        },
        robots: {
          index: !noIndex,
          follow: p.robots_follow !== 0,
          googleBot: {
            index: !noIndex,
            follow: p.robots_follow !== 0,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        openGraph: {
          title: p.og_title || title,
          description: p.og_description || description,
          url: canonical,
          siteName: globalSettings?.site_name || 'DOER',
          locale: 'en_US',
          type: 'website',
          images: [
            {
              url: fullOgImage,
              secureUrl: fullOgImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: p.twitter_title || title,
          description: p.twitter_description || description,
          images: [fullOgImage],
        },
        verification: {
          google: globalSettings?.google_site_verification || undefined,
          other: globalSettings?.bing_site_verification
            ? { 'msvalidate.01': [globalSettings.bing_site_verification] }
            : undefined,
        },
      };
    }
  } catch (err) {
    console.error('Error fetching dynamic page metadata:', err);
  }

  // Fallback if not configured in DB or during build
  return constructMetadata({
    title: fallback?.title || DEFAULT_TITLE,
    description: fallback?.description || DEFAULT_DESC,
    keywords: fallback?.keywords,
    path: cleanPath,
    image: fallback?.image,
    noIndex: fallback?.noIndex,
  });
}
