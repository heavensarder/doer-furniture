import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureHeroSlidesTable } from '@/lib/frontend-db';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureHeroSlidesTable();
    const body = await request.json();
    const items = body.items as { id: number; displayOrder: number }[];

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    for (const item of items) {
      await pool.execute('UPDATE hero_slides SET display_order = ? WHERE id = ?', [
        item.displayOrder,
        item.id,
      ]);
    }

    return NextResponse.json({ success: true, message: 'Slides reordered successfully.' });
  } catch (error: any) {
    console.error('Error reordering slides:', error);
    return NextResponse.json({ error: 'Failed to reorder slides' }, { status: 500 });
  }
}

