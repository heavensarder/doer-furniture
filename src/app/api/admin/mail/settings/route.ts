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

    const [rows]: any = await pool.execute('SELECT * FROM mail_settings LIMIT 1');
    const settings = rows && rows[0] ? rows[0] : null;

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching mail settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureMailTables();
    const body = await request.json();

    const provider = String(body.provider || 'hostinger').trim();
    const smtpHost = String(body.smtp_host || 'smtp.titan.email').trim();
    const smtpPort = parseInt(body.smtp_port, 10) || 465;
    const smtpSecure = body.smtp_secure !== undefined ? (body.smtp_secure ? 1 : 0) : (smtpPort === 465 ? 1 : 0);
    const smtpUser = String(body.smtp_user || '').trim();
    const smtpPass = body.smtp_pass !== undefined ? String(body.smtp_pass) : '';
    const senderName = String(body.sender_name || 'DOER Notifications').trim();
    const senderEmail = String(body.sender_email || smtpUser).trim();
    const receiverEmail = String(body.receiver_email || '').trim();
    const orderReceiverEmail = String(body.order_receiver_email || 'orders@doerbd.com').trim();
    const ccEmail = String(body.cc_email || '').trim();
    const orderCcEmail = String(body.order_cc_email || '').trim();
    const replyToEmail = String(body.reply_to_email || '').trim();

    const enquiryNotificationEnabled = body.enquiry_notification_enabled ? 1 : 0;
    const careerNotificationEnabled = body.career_notification_enabled ? 1 : 0;
    const orderNotificationEnabled = body.order_notification_enabled ? 1 : 0;
    const customerReplyEnabled = body.customer_reply_enabled ? 1 : 0;

    // Check if row exists
    const [existing]: any = await pool.execute('SELECT id FROM mail_settings LIMIT 1');
    if (!existing || existing.length === 0) {
      await pool.execute(
        `INSERT INTO mail_settings (
          provider, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass,
          sender_name, sender_email, receiver_email, order_receiver_email,
          cc_email, order_cc_email, reply_to_email,
          enquiry_notification_enabled, career_notification_enabled, order_notification_enabled, customer_reply_enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          provider,
          smtpHost,
          smtpPort,
          smtpSecure,
          smtpUser,
          smtpPass,
          senderName,
          senderEmail,
          receiverEmail,
          orderReceiverEmail || null,
          ccEmail || null,
          orderCcEmail || null,
          replyToEmail || null,
          enquiryNotificationEnabled,
          careerNotificationEnabled,
          orderNotificationEnabled,
          customerReplyEnabled,
        ]
      );
    } else {
      await pool.execute(
        `UPDATE mail_settings SET
          provider = ?,
          smtp_host = ?,
          smtp_port = ?,
          smtp_secure = ?,
          smtp_user = ?,
          smtp_pass = ?,
          sender_name = ?,
          sender_email = ?,
          receiver_email = ?,
          order_receiver_email = ?,
          cc_email = ?,
          order_cc_email = ?,
          reply_to_email = ?,
          enquiry_notification_enabled = ?,
          career_notification_enabled = ?,
          order_notification_enabled = ?,
          customer_reply_enabled = ?
        WHERE id = ?`,
        [
          provider,
          smtpHost,
          smtpPort,
          smtpSecure,
          smtpUser,
          smtpPass,
          senderName,
          senderEmail,
          receiverEmail,
          orderReceiverEmail || null,
          ccEmail || null,
          orderCcEmail || null,
          replyToEmail || null,
          enquiryNotificationEnabled,
          careerNotificationEnabled,
          orderNotificationEnabled,
          customerReplyEnabled,
          existing[0].id,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mail settings saved successfully.',
    });
  } catch (error: any) {
    console.error('Error updating mail settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

