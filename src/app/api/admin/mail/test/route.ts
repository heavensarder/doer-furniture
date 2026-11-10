import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { testSmtpConnection, getActiveMailSettings, MailSettingsData } from '@/lib/mail-sender';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const testRecipient = String(body.test_recipient || body.receiver_email || '').trim();

    if (!testRecipient) {
      return NextResponse.json(
        { error: 'Please provide a valid recipient email address to send the test email to.' },
        { status: 400 }
      );
    }

    // Use either the transient settings passed from the form, or fall back to saved DB settings
    let settingsToTest: MailSettingsData;

    if (body.smtp_host && body.smtp_user) {
      settingsToTest = {
        provider: body.provider || 'hostinger',
        smtp_host: body.smtp_host.trim(),
        smtp_port: parseInt(body.smtp_port, 10) || 465,
        smtp_secure: body.smtp_secure !== undefined ? Boolean(body.smtp_secure) : true,
        smtp_user: body.smtp_user.trim(),
        smtp_pass: body.smtp_pass || '',
        sender_name: body.sender_name || 'DOER Notifications',
        sender_email: body.sender_email || body.smtp_user.trim(),
        receiver_email: testRecipient,
        enquiry_notification_enabled: 1,
        career_notification_enabled: 1,
        order_notification_enabled: 1,
        customer_reply_enabled: 1,
      };
    } else {
      const dbSettings = await getActiveMailSettings();
      if (!dbSettings) {
        return NextResponse.json(
          { error: 'No mail settings configured. Please fill in your SMTP details.' },
          { status: 400 }
        );
      }
      settingsToTest = dbSettings;
    }

    const result = await testSmtpConnection(settingsToTest, testRecipient);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully dispatched to ${testRecipient}! Check your inbox (or spam folder).`,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('Test email route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error while sending test email' },
      { status: 500 }
    );
  }
}

