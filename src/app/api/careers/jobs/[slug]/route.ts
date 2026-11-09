import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureCareerTables } from '@/lib/career-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await ensureCareerTables();
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Job slug or ID is required' }, { status: 400 });
    }

    // Try lookup by slug or by numeric id
    let job: any = null;
    const [bySlug]: any = await pool.execute(
      'SELECT * FROM jobs WHERE slug = ? AND is_active = 1 LIMIT 1',
      [slug]
    );

    if (bySlug && bySlug.length > 0) {
      job = bySlug[0];
    } else if (!isNaN(Number(slug))) {
      const [byId]: any = await pool.execute(
        'SELECT * FROM jobs WHERE id = ? AND is_active = 1 LIMIT 1',
        [Number(slug)]
      );
      if (byId && byId.length > 0) {
        job = byId[0];
      }
    }

    if (!job) {
      return NextResponse.json({ error: 'Job position not found or no longer active' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error: any) {
    console.error('Error fetching single job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details', details: error.message },
      { status: 500 }
    );
  }
}
