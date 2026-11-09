import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureCareerTables } from '@/lib/career-db';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCareerTables();

    // Query jobs with total applications count
    const [jobs]: any = await pool.execute(`
      SELECT 
        j.*,
        COUNT(a.id) as applications_count,
        SUM(CASE WHEN a.status = 'new' THEN 1 ELSE 0 END) as new_applications_count
      FROM jobs j
      LEFT JOIN job_applications a ON j.id = a.job_id
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `);

    return NextResponse.json({ jobs: jobs || [] });
  } catch (error: any) {
    console.error('Error fetching admin jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCareerTables();

    const body = await request.json();
    const title = (body.title || '').trim();
    const position = (body.position || '').trim() || title;
    const jobType = body.job_type || 'Full-Time';
    const details = (body.details || '').trim();
    const deadline = body.deadline ? body.deadline : null;
    const isActive = body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1;

    if (!title) {
      return NextResponse.json({ error: 'Job title is required.' }, { status: 400 });
    }
    if (!details) {
      return NextResponse.json({ error: 'Job details/description are required.' }, { status: 400 });
    }

    // Auto-save position to job_positions if new
    if (position) {
      try {
        await pool.execute(
          'INSERT INTO job_positions (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name',
          [position]
        );
      } catch {
        // ignore
      }
    }

    let slug = (body.slug || '').trim() || slugify(title);
    if (!slug) {
      slug = `job-${Date.now()}`;
    }

    // Ensure unique slug
    const [existing]: any = await pool.execute('SELECT id FROM jobs WHERE slug = ?', [slug]);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const [result]: any = await pool.execute(
      `INSERT INTO jobs (title, position, slug, job_type, details, deadline, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, position, slug, jobType, details, deadline, isActive]
    );

    return NextResponse.json({
      success: true,
      jobId: result.insertId,
      slug,
      message: 'Job position created successfully.',
    });
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job', details: error.message }, { status: 500 });
  }
}

