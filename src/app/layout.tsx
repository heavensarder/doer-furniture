import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { constructMetadata } from '@/lib/metadata';
import { CyberDialogProvider } from '@/components/ui/CyberDialog';
import JsonLd, { getGlobalSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchema = getGlobalSchema('http://doerbd.com');

  return (
    <html lang="en" className="scroll-smooth bg-[#05070B] dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={globalSchema} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#05070B] text-slate-100 antialiased selection:bg-[#FF3D00] selection:text-white font-sans relative overflow-x-hidden">
        {/* Vertical Neon Laser Lines Streaming Downward From Navbar */}
        <div
          aria-hidden="true"
          className="neon-line-v-cyan fixed top-[56px] sm:top-[64px] bottom-0 left-2 sm:left-4 lg:left-6 w-[1px] z-40 pointer-events-none opacity-40 sm:opacity-65"
        />
        <div
          aria-hidden="true"
          className="neon-line-v-orange fixed top-[56px] sm:top-[64px] bottom-0 right-2 sm:right-4 lg:right-6 w-[1px] z-40 pointer-events-none opacity-40 sm:opacity-65"
        />

        <CyberDialogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CyberDialogProvider>
      </body>
    </html>
  );
}
