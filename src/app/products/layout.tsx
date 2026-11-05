import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Products & Bespoke Furniture – DOER Manufacturing & Consoles',
  description:
    'Explore DOER bespoke commercial furniture, high-end console tables, smart modular workstations, conference boardroom tables, and precision joinery crafted in our Khilkhet facility.',
  path: '/products',
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

