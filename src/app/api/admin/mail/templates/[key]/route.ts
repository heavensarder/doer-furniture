import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureMailTables } from '@/lib/mail-db';
import {
  getActiveMailSettings,
  createNodemailerTransporter,
  replacePlaceholders,
} from '@/lib/mail-sender';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureMailTables();
    const key = params.key;

    const [rows]: any = await pool.execute(
      'SELECT * FROM mail_templates WHERE template_key = ? LIMIT 1',
      [key]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      template: rows[0],
    });
  } catch (error: any) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureMailTables();
    const key = params.key;
    const body = await request.json();

    const subject = String(body.subject || '').trim();
    const bodyHtml = String(body.body_html || '').trim();
    const isActive = body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1;

    if (!subject || !bodyHtml) {
      return NextResponse.json(
        { error: 'Template subject and HTML body cannot be empty.' },
        { status: 400 }
      );
    }

    await pool.execute(
      `UPDATE mail_templates SET
        subject = ?,
        body_html = ?,
        is_active = ?
      WHERE template_key = ?`,
      [subject, bodyHtml, isActive, key]
    );

    return NextResponse.json({
      success: true,
      message: 'Template updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Send test preview of this template to a recipient
export async function POST(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const key = params.key;
    const body = await request.json();
    const recipient = String(body.recipient || '').trim();

    if (!recipient) {
      return NextResponse.json(
        { error: 'Please enter a valid recipient email address.' },
        { status: 400 }
      );
    }

    const settings = await getActiveMailSettings();
    if (!settings || !settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
      return NextResponse.json(
        { error: 'SMTP settings are not configured. Please configure your Hostinger Titan SMTP first.' },
        { status: 400 }
      );
    }

    // Sample data to test template interpolation
    const sampleData: Record<string, string | number> = {
      full_name: 'Engr. Tanvir Ahmed',
      company_name: 'Apex Infrastructure Ltd.',
      email: 'tanvir.ahmed@apexholdings.bd',
      phone: '+880 1812-345678',
      service_interested: 'Control Room Interior',
      project_location: 'Gulshan-2, Dhaka',
      project_details: 'Need 6-operator curved modular console tables with physical EMI separation and multi-monitor articulated mounting arms for our 24/7 security control room.',
      submission_time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'full', timeStyle: 'medium' }),
      inquiry_id: 1042,
      admin_dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doer.heavensarder.com'}/admin/dashboard/enquiries`,
      site_name: 'DOER',
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://doer.heavensarder.com',
      logo_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://doer.heavensarder.com'}/logo-white.png`,
      hotline: '+880 1976-535654',
      job_title: 'Control Room Project Engineer',
      experience_years: '4+ Years',
      highest_qualification: 'B.Sc in Industrial & Production Engineering',
      institution: 'BUET',
      cv_url: 'http://doerbd.com/uploads/sample-cv.pdf',
      order_number: 'DOER-2026-9041',
      product_name: 'HG-B1 Executive Modular Control Console',
      quantity: 2,
      total_price: '370,000',
      customer_name: 'Engr. Tanvir Ahmed',
      delivery_address: 'Plot 45, Road 11, Gulshan-2, Dhaka-1212',
    };

    const subjectToParse = body.subject || 'Sample Preview Email';
    const htmlToParse = body.body_html || '<p>Sample Body</p>';

    const parsedSubject = `[TEST PREVIEW] ` + replacePlaceholders(subjectToParse, sampleData);
    const parsedHtml = replacePlaceholders(htmlToParse, sampleData);

    const transporter = createNodemailerTransporter(settings);
    const fromAddress = `"${settings.sender_name || 'DOER Notifications'}" <${settings.sender_email || settings.smtp_user}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: parsedSubject,
      html: parsedHtml,
    });

    return NextResponse.json({
      success: true,
      message: `Template preview successfully sent to ${recipient}!`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Error sending template preview:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send template preview.' },
      { status: 500 }
    );
  }
}

