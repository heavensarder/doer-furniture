import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureMailTables } from '@/lib/mail-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureMailTables();

    const [rows]: any = await pool.execute(
      'SELECT id, template_key, name, category, subject, description, available_variables, is_active, updated_at FROM mail_templates ORDER BY id ASC'
    );

    return NextResponse.json({
      success: true,
      templates: rows || [],
    });
  } catch (error: any) {
    console.error('Error fetching mail templates:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

