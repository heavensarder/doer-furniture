import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – Start Your Project with DOER',
  description:
    'Connect with DOER interior design and execution specialists. Discuss your commercial fit-out, residential design, or custom fabrication project.',
  openGraph: {
    title: 'Contact Us – Start Your Project with DOER',
    description:
      'Connect with DOER interior design and execution specialists. Discuss your commercial fit-out, residential design, or custom fabrication project.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1734,
        height: 907,
        alt: 'Contact DOER',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us – Start Your Project with DOER',
    description:
      'Connect with DOER interior design and execution specialists. Discuss your commercial fit-out, residential design, or custom fabrication project.',
    images: ['/og-image.jpg'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

