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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCareerTables();
    const id = Number(params?.id);

    const [jobs]: any = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job: jobs[0] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCareerTables();
    const id = Number(params?.id);

    const body = await request.json();

    // Check if toggling active only
    if (body.toggle_active !== undefined) {
      await pool.execute('UPDATE jobs SET is_active = ? WHERE id = ?', [
        body.is_active ? 1 : 0,
        id,
      ]);
      return NextResponse.json({ success: true, message: 'Status updated' });
    }

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
      return NextResponse.json({ error: 'Job details are required.' }, { status: 400 });
    }

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
    const [existing]: any = await pool.execute(
      'SELECT id FROM jobs WHERE slug = ? AND id != ?',
      [slug, id]
    );
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    await pool.execute(
      `UPDATE jobs SET
        title = ?,
        position = ?,
        slug = ?,
        job_type = ?,
        details = ?,
        deadline = ?,
        is_active = ?
      WHERE id = ?`,
      [title, position, slug, jobType, details, deadline, isActive, id]
    );

    return NextResponse.json({ success: true, message: 'Job updated successfully' });
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCareerTables();
    const id = Number(params?.id);

    // Delete associated applications and job
    await pool.execute('DELETE FROM job_applications WHERE job_id = ?', [id]);
    await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Job and associated applications deleted.' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job', details: error.message }, { status: 500 });
  }
}
