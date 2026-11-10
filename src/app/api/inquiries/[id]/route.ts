import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { deleteUploadedFile } from '@/lib/file-storage';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    const validStatuses = ['new', 'contacted', 'in_progress', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const [result]: any = await pool.execute(
      'UPDATE inquiries SET status = ? WHERE id = ?',
      [status, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update inquiry' },
      { status: 500 }
    );
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

    // 1. Fetch inquiry to clean up any potential file attachments
    const [existingRows]: any = await pool.execute(
      'SELECT * FROM inquiries WHERE id = ? LIMIT 1',
      [params.id]
    );

    if (existingRows && existingRows.length > 0) {
      const inq = existingRows[0];
      if (inq.attachment_url) await deleteUploadedFile(inq.attachment_url);
      if (inq.file_url) await deleteUploadedFile(inq.file_url);
    }

    // 2. Permanently delete inquiry record and text from database
    const [result]: any = await pool.execute(
      'DELETE FROM inquiries WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry and all associated data permanently deleted from database.' });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}

