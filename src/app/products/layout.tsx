import type { Metadata } from 'next';
import { getDynamicPageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata('/products', {
    title: 'Console Tables & Ergonomic Command Workstations Catalog | DOER',
    description:
      'Explore precision-engineered modular console tables, multi-screen operator command desks, and motorized workstations with 24/7 heavy-duty chassis.',
    path: '/products',
  });
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
