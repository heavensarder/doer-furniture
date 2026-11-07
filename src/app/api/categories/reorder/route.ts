import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();

    const body = await request.json();
    const orderedIds: number[] = Array.isArray(body.orderedIds) ? body.orderedIds : [];

    if (orderedIds.length === 0) {
      return NextResponse.json({ error: 'No category IDs provided' }, { status: 400 });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      const id = Number(orderedIds[i]);
      if (!isNaN(id)) {
        await pool.execute(
          'UPDATE product_categories SET display_order = ? WHERE id = ?',
          [i + 1, id]
        );
      }
    }

    const [rows] = await pool.execute(
      'SELECT * FROM product_categories ORDER BY display_order ASC, id ASC'
    );

    return NextResponse.json({ categories: rows, success: true });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}

