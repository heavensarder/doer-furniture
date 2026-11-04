import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Contact Us – Start Your Project with DOER',
  description:
    'Connect with DOER interior design and execution specialists. Discuss your commercial fit-out, residential design, or custom fabrication project.',
  path: '/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

