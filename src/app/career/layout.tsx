import type { Metadata } from 'next';
import { getDynamicPageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata('/career', {
    title: 'Careers at DOER – Join Our Engineering & Interior Craft Team',
    description:
      'Build mission-critical control rooms and architectural metal art. View career openings for project engineers, draftsmen, and CNC technicians at DOER Dhaka.',
    path: '/career',
  });
}

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

