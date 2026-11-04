import type { Metadata } from 'next';

/**
 * Resolves the absolute site URL across environments (local, Vercel preview, or production domain).
 */
export const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'https://doerbd.com';
};

const DEFAULT_TITLE = 'DOER – Designing Spaces. Creating Experiences.';
const DEFAULT_DESC =
  'DOER delivers innovative interior design, commercial fit-out, furniture manufacturing, and project execution solutions.';

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  path?: string;
}

export function constructMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = '',
}: ConstructMetadataProps = {}): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'DOER Interior Architecture & Manufacturing',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
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

