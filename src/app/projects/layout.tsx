import type { Metadata } from 'next';
import { getDynamicPageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata('/projects', {
    title: 'Control Room Interiors & Commercial Architecture Projects | DOER',
    description:
      'Explore delivered mission-critical control room interiors, executive console table setups, and luxury interior fit-outs engineered by DOER in Bangladesh.',
    path: '/projects',
  });
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
