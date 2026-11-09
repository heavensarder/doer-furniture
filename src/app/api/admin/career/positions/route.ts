import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureCareerTables } from '@/lib/career-db';

export async function GET() {
  try {
    await ensureCareerTables();

    const [rows]: any = await pool.execute(
      'SELECT id, name, created_at FROM job_positions ORDER BY name ASC'
    );

    return NextResponse.json({ positions: rows || [] });
  } catch (error: any) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCareerTables();
    const body = await req.json();

    const name = (body.name || '').trim();
    if (!name) {
      return NextResponse.json(
        { error: 'Position name is required.' },
        { status: 400 }
      );
    }

    // Insert or ignore if duplicate
    const [result]: any = await pool.execute(
      'INSERT INTO job_positions (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name',
      [name]
    );

    const insertId = result.insertId;
    let positionId = insertId;
    if (!positionId) {
      const [existing]: any = await pool.execute(
        'SELECT id FROM job_positions WHERE name = ?',
        [name]
      );
      if (existing && existing.length > 0) {
        positionId = existing[0].id;
      }
    }

    return NextResponse.json({
      success: true,
      position: { id: positionId, name },
    });
  } catch (error: any) {
    console.error('Error creating position:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create position' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCareerTables();

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        if (body.id) id = String(body.id);
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Position ID is required to delete.' },
        { status: 400 }
      );
    }

    await pool.execute('DELETE FROM job_positions WHERE id = ?', [Number(id)]);

    return NextResponse.json({
      success: true,
      message: 'Position deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting position:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete position' },
      { status: 500 }
    );
  }
}
