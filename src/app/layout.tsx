import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://doerbd.com'),
  title: {
    default: 'DOER – Designing Spaces. Creating Experiences.',
    template: '%s | DOER',
  },
  description:
    'DOER delivers innovative interior design, commercial fit-out, furniture manufacturing, and project execution solutions.',
  openGraph: {
    title: 'DOER – Designing Spaces. Creating Experiences.',
    description:
      'DOER delivers innovative interior design, commercial fit-out, furniture manufacturing, and project execution solutions.',
    url: 'https://doerbd.com',
    siteName: 'DOER Interior Architecture & Manufacturing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1734,
        height: 907,
        alt: 'DOER – Designing Spaces. Creating Experiences.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOER – Designing Spaces. Creating Experiences.',
    description:
      'DOER delivers innovative interior design, commercial fit-out, furniture manufacturing, and project execution solutions.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:image:width" content="1734" />
        <meta property="og:image:height" content="907" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-[#FF3D00] selection:text-white font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
