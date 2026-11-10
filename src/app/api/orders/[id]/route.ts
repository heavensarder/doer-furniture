import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';
import { deleteUploadedFile } from '@/lib/file-storage';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const body = await request.json();
    const status = (body.status || 'pending').trim();

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [
      status,
      id,
    ]);

    const [updated]: any = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    return NextResponse.json({ order: updated[0] });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
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

    await ensureEcommerceTables();

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // 1. Fetch order to clean up any potential attachments/receipts
    const [existingRows]: any = await pool.execute(
      'SELECT * FROM orders WHERE id = ? LIMIT 1',
      [id]
    );

    if (existingRows && existingRows.length > 0) {
      const order = existingRows[0];
      if (order.receipt_url) await deleteUploadedFile(order.receipt_url);
      if (order.attachment_url) await deleteUploadedFile(order.attachment_url);
    }

    // 2. Permanently delete order record from database
    await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Order record and all details permanently purged from database.' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}

