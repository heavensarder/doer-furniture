import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureHeroSlidesTable } from '@/lib/frontend-db';
import { deleteUploadedFile } from '@/lib/file-storage';

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

    await ensureHeroSlidesTable();
    const id = Number(params?.id);

    const [rows]: any = await pool.execute('SELECT * FROM hero_slides WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ slide: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch slide', details: error.message }, { status: 500 });
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

    await ensureHeroSlidesTable();
    const id = Number(params?.id);
    const body = await request.json();

    // Check if toggle active status only
    if (body.toggleActive !== undefined) {
      await pool.execute('UPDATE hero_slides SET is_active = ? WHERE id = ?', [
        body.isActive ? 1 : 0,
        id,
      ]);
      return NextResponse.json({ success: true, message: 'Slide status updated.' });
    }

    const tag = String(body.tag || '').trim();
    const titleLight = String(body.titleLight || '').trim();
    const titleHighlight = String(body.titleHighlight || '').trim();
    const description = String(body.description || '').trim();
    const image = String(body.image || '').trim();
    const primaryBtnText = String(body.primaryBtnText || 'Explore Console Tables').trim();
    const primaryBtnHref = String(body.primaryBtnHref || '/products').trim();
    const secondaryBtnText = String(body.secondaryBtnText || 'Design Your Control Room').trim();
    const secondaryBtnHref = String(body.secondaryBtnHref || '/contact').trim();
    const displayOrder = body.displayOrder !== undefined ? Number(body.displayOrder) : undefined;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : 1;

    if (!titleLight && !titleHighlight) {
      return NextResponse.json(
        { error: 'Slide title is required (either white bold or glowing highlight text).' },
        { status: 400 }
      );
    }
    if (!image) {
      return NextResponse.json({ error: 'Background image is required.' }, { status: 400 });
    }

    if (displayOrder !== undefined) {
      await pool.execute(
        `UPDATE hero_slides SET
          tag = ?,
          title_light = ?,
          title_highlight = ?,
          description = ?,
          image = ?,
          primary_btn_text = ?,
          primary_btn_href = ?,
          secondary_btn_text = ?,
          secondary_btn_href = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?`,
        [
          tag,
          titleLight,
          titleHighlight,
          description,
          image,
          primaryBtnText,
          primaryBtnHref,
          secondaryBtnText,
          secondaryBtnHref,
          displayOrder,
          isActive,
          id,
        ]
      );
    } else {
      await pool.execute(
        `UPDATE hero_slides SET
          tag = ?,
          title_light = ?,
          title_highlight = ?,
          description = ?,
          image = ?,
          primary_btn_text = ?,
          primary_btn_href = ?,
          secondary_btn_text = ?,
          secondary_btn_href = ?,
          is_active = ?
        WHERE id = ?`,
        [
          tag,
          titleLight,
          titleHighlight,
          description,
          image,
          primaryBtnText,
          primaryBtnHref,
          secondaryBtnText,
          secondaryBtnHref,
          isActive,
          id,
        ]
      );
    }

    return NextResponse.json({ success: true, message: 'Hero slide updated successfully.' });
  } catch (error: any) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide', details: error.message },
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

    await ensureHeroSlidesTable();
    const id = Number(params?.id);

    // 1. Fetch physical image to clean up from disk if it was an uploaded file
    const [existingRows]: any = await pool.execute(
      'SELECT image FROM hero_slides WHERE id = ? LIMIT 1',
      [id]
    );

    if (existingRows && existingRows.length > 0) {
      await deleteUploadedFile(existingRows[0].image);
    }

    // 2. Delete slide record from database
    await pool.execute('DELETE FROM hero_slides WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Hero slide and associated image deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide', details: error.message },
      { status: 500 }
    );
  }
}

