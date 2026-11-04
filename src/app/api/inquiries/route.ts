import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let sql = 'SELECT * FROM inquiries WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ' AND (full_name LIKE ? OR company_name LIKE ? OR email LIKE ? OR phone LIKE ? OR service_interested LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(sql, params);
    return NextResponse.json({ inquiries: rows });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = body.fullName || body.full_name;
    const companyName = body.companyName || body.company_name || '';
    const email = body.email;
    const phone = body.phone;
    const serviceInterested = body.serviceInterested || body.service_interested || 'General Inquiry';
    const projectLocation = body.projectLocation || body.project_location || '';
    const projectDetails = body.projectDetails || body.project_details;

    if (!fullName || !email || !phone || !projectDetails) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Full Name, Email, Phone, Project Details)' },
        { status: 400 }
      );
    }

    // Insert into MySQL inquiries table
    const [result]: any = await pool.execute(
      `INSERT INTO inquiries 
       (full_name, company_name, email, phone, service_interested, project_location, project_details, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [fullName, companyName, email, phone, serviceInterested, projectLocation, projectDetails]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: 'Thank you for contacting DOER. We have received your inquiry and look forward to discussing your project.',
    });
  } catch (error: any) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

