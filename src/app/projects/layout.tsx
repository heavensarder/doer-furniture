import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio & Projects – DOER Interior Architecture & Execution',
  description:
    'Explore DOER featured projects across commercial offices, retail outlets, luxury residences, hospitality spaces, and custom furniture fabrication.',
  openGraph: {
    title: 'Portfolio & Projects – DOER Interior Architecture & Execution',
    description:
      'Explore DOER featured projects across commercial offices, retail outlets, luxury residences, hospitality spaces, and custom furniture fabrication.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1734,
        height: 907,
        alt: 'DOER Portfolio & Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio & Projects – DOER Interior Architecture & Execution',
    description:
      'Explore DOER featured projects across commercial offices, retail outlets, luxury residences, hospitality spaces, and custom furniture fabrication.',
    images: ['/og-image.jpg'],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

