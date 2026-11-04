import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Portfolio & Projects – DOER Interior Architecture & Execution',
  description:
    'Explore DOER featured projects across commercial offices, retail outlets, luxury residences, hospitality spaces, and custom furniture fabrication.',
  path: '/projects',
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

