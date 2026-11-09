import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureCareerTables } from '@/lib/career-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await ensureCareerTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM jobs WHERE is_active = 1';
    const params: any[] = [];

    if (type && type !== 'all') {
      sql += ' AND job_type = ?';
      params.push(type);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR position LIKE ? OR details LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [jobs]: any = await pool.execute(sql, params);

    return NextResponse.json({ jobs: jobs || [] });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career positions', details: error.message },
      { status: 500 }
    );
  }
}

