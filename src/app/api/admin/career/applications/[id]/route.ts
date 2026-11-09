import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureCareerTables } from '@/lib/career-db';

export const dynamic = 'force-dynamic';

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

    const [apps]: any = await pool.execute('SELECT * FROM job_applications WHERE id = ?', [id]);
    if (!apps || apps.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application: apps[0] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
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
    const status = body.status;
    const adminNotes = body.admin_notes !== undefined ? body.admin_notes : null;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (adminNotes !== null) {
      await pool.execute(
        'UPDATE job_applications SET status = ?, admin_notes = ? WHERE id = ?',
        [status, adminNotes, id]
      );
    } else {
      await pool.execute('UPDATE job_applications SET status = ? WHERE id = ?', [status, id]);
    }

    return NextResponse.json({ success: true, message: 'Application updated successfully' });
  } catch (error: any) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application', details: error.message }, { status: 500 });
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

    await pool.execute('DELETE FROM job_applications WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Application deleted.' });
  } catch (error: any) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Failed to delete application', details: error.message }, { status: 500 });
  }
}
