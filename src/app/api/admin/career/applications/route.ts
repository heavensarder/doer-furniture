import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureCareerTables } from '@/lib/career-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCareerTables();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const jobId = searchParams.get('job_id');
    const search = searchParams.get('search') || '';

    let sql = 'SELECT * FROM job_applications WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (jobId && jobId !== 'all') {
      sql += ' AND job_id = ?';
      params.push(Number(jobId));
    }

    if (search.trim()) {
      sql += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR institution LIKE ? OR job_title LIKE ? OR position LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [applications]: any = await pool.execute(sql, params);

    // Compute status counts for tabs
    const [counts]: any = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as count_new,
        SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as count_reviewing,
        SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as count_shortlisted,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as count_rejected,
        SUM(CASE WHEN status = 'hired' THEN 1 ELSE 0 END) as count_hired
      FROM job_applications
    `);

    return NextResponse.json({
      applications: applications || [],
      counts: counts[0] || {
        total: 0,
        count_new: 0,
        count_reviewing: 0,
        count_shortlisted: 0,
        count_rejected: 0,
        count_hired: 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job applications', details: error.message },
      { status: 500 }
    );
  }
}

