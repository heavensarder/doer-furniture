import type { Metadata } from 'next';
import { getDynamicPageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata('/contact', {
    title: 'Contact DOER – Request Console Table & Control Room Interior Layout',
    description:
      'Connect with our control room engineers. Request bespoke console table dimensional drawings or architectural metal art samples. Hotline: +8801976535654.',
    path: '/contact',
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
