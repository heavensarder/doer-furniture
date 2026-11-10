import pool from './db';

let initialized = false;

export async function ensureMailTables() {
  if (initialized) return;

  try {
    // 1. mail_settings table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS mail_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        provider VARCHAR(50) NOT NULL DEFAULT 'hostinger',
        smtp_host VARCHAR(255) NOT NULL DEFAULT 'smtp.titan.email',
        smtp_port INT NOT NULL DEFAULT 465,
        smtp_secure TINYINT(1) NOT NULL DEFAULT 1,
        smtp_user VARCHAR(255) NOT NULL DEFAULT 'info@doerbd.com',
        smtp_pass VARCHAR(255) NULL,
        sender_name VARCHAR(255) NOT NULL DEFAULT 'DOER Notifications',
        sender_email VARCHAR(255) NOT NULL DEFAULT 'info@doerbd.com',
        receiver_email VARCHAR(255) NOT NULL DEFAULT 'doer.interior@gmail.com',
        order_receiver_email VARCHAR(255) NOT NULL DEFAULT 'orders@doerbd.com',
        cc_email VARCHAR(255) NULL,
        order_cc_email VARCHAR(255) NULL,
        reply_to_email VARCHAR(255) NULL,
        enquiry_notification_enabled TINYINT(1) NOT NULL DEFAULT 1,
        career_notification_enabled TINYINT(1) NOT NULL DEFAULT 1,
        order_notification_enabled TINYINT(1) NOT NULL DEFAULT 1,
        customer_reply_enabled TINYINT(1) NOT NULL DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 1.1 Check and add ecommerce order recipient columns if not already present
    try {
      const [colRows]: any = await pool.execute("SHOW COLUMNS FROM mail_settings LIKE 'order_receiver_email'");
      if (!colRows || colRows.length === 0) {
        await pool.execute("ALTER TABLE mail_settings ADD COLUMN order_receiver_email VARCHAR(255) NOT NULL DEFAULT 'orders@doerbd.com' AFTER receiver_email");
      }
      // Ensure existing records have dedicated e-commerce order receiver
      await pool.execute("UPDATE mail_settings SET order_receiver_email = 'orders@doerbd.com' WHERE order_receiver_email IS NULL OR order_receiver_email = ''");
    } catch (e) {
      console.warn('Could not alter mail_settings for order_receiver_email:', e);
    }

    try {
      const [ccColRows]: any = await pool.execute("SHOW COLUMNS FROM mail_settings LIKE 'order_cc_email'");
      if (!ccColRows || ccColRows.length === 0) {
        await pool.execute('ALTER TABLE mail_settings ADD COLUMN order_cc_email VARCHAR(255) NULL AFTER cc_email');
      }
    } catch (e) {
      console.warn('Could not alter mail_settings for order_cc_email:', e);
    }

    // 2. mail_templates table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS mail_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        template_key VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'enquiries',
        subject VARCHAR(255) NOT NULL,
        body_html LONGTEXT NOT NULL,
        description VARCHAR(255) NULL,
        available_variables TEXT NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_template_key (template_key),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Seed default mail_settings if empty
    const [settingsRows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM mail_settings');
    if (!settingsRows || settingsRows[0]?.cnt === 0) {
      await pool.execute(
        `INSERT INTO mail_settings (
          provider,
          smtp_host,
          smtp_port,
          smtp_secure,
          smtp_user,
          smtp_pass,
          sender_name,
          sender_email,
          receiver_email,
          order_receiver_email,
          cc_email,
          order_cc_email,
          enquiry_notification_enabled,
          career_notification_enabled,
          order_notification_enabled,
          customer_reply_enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'hostinger',
          'smtp.titan.email',
          465,
          1,
          'info@doerbd.com',
          '',
          'DOER Notifications',
          'info@doerbd.com',
          'doer.interior@gmail.com',
          null,
          null,
          null,
          1,
          1,
          1,
          1,
        ]
      );
    }

    // 4. Default Email Templates
    const defaultTemplates = [
      {
        key: 'enquiry_admin',
        name: 'New Project Enquiry (Admin Notification)',
        category: 'enquiries',
        description: 'Sent to the Receiver Email when a client submits the contact or project inquiry form.',
        subject: '⚡ New Project Enquiry: {{service_interested}} from {{full_name}}',
        variables: JSON.stringify([
          { key: 'full_name', label: 'Full Name', desc: 'Customer name entered in the form' },
          { key: 'company_name', label: 'Company Name', desc: 'Company or organization name' },
          { key: 'email', label: 'Email Address', desc: 'Customer email address' },
          { key: 'phone', label: 'Phone Number', desc: 'Customer phone number' },
          { key: 'service_interested', label: 'Service Interested In', desc: 'Selected interior/console service' },
          { key: 'project_location', label: 'Project Location', desc: 'Project site or city location' },
          { key: 'project_details', label: 'Project Details', desc: 'Detailed project requirements message' },
          { key: 'submission_time', label: 'Submission Time', desc: 'Formatted date and time of inquiry' },
          { key: 'inquiry_id', label: 'Inquiry ID', desc: 'Database record ID number' },
          { key: 'admin_dashboard_url', label: 'Admin Dashboard URL', desc: 'Direct link to open in Admin Portal' },
          { key: 'site_name', label: 'Site Name', desc: 'DOER brand name' },
          { key: 'site_url', label: 'Website URL', desc: 'Website domain link' },
          { key: 'logo_url', label: 'Site Logo URL', desc: 'Direct URL to DOER white brand logo' },
        ]),
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>New Project Enquiry - DOER</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; }

    @media screen and (max-width: 600px) {
      .outer-wrapper { padding: 10px 4px !important; }
      .main-card { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; border-left: none !important; border-right: none !important; }
      .mobile-pad-header { padding: 20px 16px 16px !important; }
      .mobile-stack-header-left { display: block !important; width: 100% !important; text-align: left !important; }
      .mobile-stack-header-right { display: block !important; width: 100% !important; text-align: left !important; margin-top: 10px !important; }
      .mobile-pad-body { padding: 20px 16px 12px !important; }
      .mobile-pad-table { padding: 6px 16px 18px !important; }
      .mobile-pad-section { padding: 0 16px 18px !important; }
      .mobile-pad-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.3 !important; }
      .mobile-subtitle { font-size: 12px !important; line-height: 1.5 !important; }
      .mobile-row-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 10px 14px 2px !important; border-bottom: none !important; font-size: 10px !important; }
      .mobile-row-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 14px 10px !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; font-size: 13px !important; word-break: break-word !important; }
      .mobile-cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 14px 18px !important; text-align: center !important; font-size: 13px !important; }
      .mobile-box-padding { padding: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="background-color: #05070B; min-height: 100vh; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="main-card" style="max-width: 620px; background-color: #0A0F1D; border-radius: 18px; border: 1px solid rgba(0, 240, 255, 0.25); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin: 0 auto;">
          
          <!-- Top Cyber Neon Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF3D00 0%, #00F0FF 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="mobile-pad-header" style="padding: 30px 36px 18px; background-color: #080C16; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="mobile-stack-header-left">
                    <a href="{{site_url}}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="{{logo_url}}" alt="{{site_name}}" width="130" height="28" border="0" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
                    </a>
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; margin-top: 6px;">
                      Mission-Critical Command Interiors
                    </div>
                  </td>
                  <td class="mobile-stack-header-right" align="right">
                    <span style="display: inline-block; padding: 5px 12px; background-color: rgba(255, 61, 0, 0.15); border: 1px solid rgba(255, 61, 0, 0.4); border-radius: 8px; font-size: 11px; font-weight: 700; color: #FF3D00; text-transform: uppercase; letter-spacing: 0.5px;">
                      New Lead #{{inquiry_id}}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Hero Headline -->
          <tr>
            <td class="mobile-pad-body" style="padding: 26px 36px 12px;">
              <h1 class="mobile-title" style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
                New Project Inquiry Received
              </h1>
              <p class="mobile-subtitle" style="margin: 8px 0 0; font-size: 13px; color: #94A3B8; line-height: 1.5;">
                A visitor submitted a new project consultation request through the <strong style="color: #FFFFFF;">{{site_name}}</strong> website.
              </p>
            </td>
          </tr>

          <!-- Client & Project Details Table -->
          <tr>
            <td class="mobile-pad-table" style="padding: 12px 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 35%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Client Name
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #FFFFFF;">
                    {{full_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Company / Org
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; color: #CBD5E1;">
                    {{company_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Email Address
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; color: #00F0FF;">
                    <a href="mailto:{{email}}" style="color: #00F0FF; text-decoration: none;">{{email}}</a>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Phone Number
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #FFFFFF;">
                    <a href="tel:{{phone}}" style="color: #FFFFFF; text-decoration: none;">{{phone}}</a>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Service Interested
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #FF3D00;">
                    {{service_interested}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Project Location
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; font-size: 13px; font-weight: 500; color: #E2E8F0;">
                    {{project_location}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message / Scope Section -->
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 24px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94A3B8; margin-bottom: 8px;">
                Project Scope &amp; Client Message
              </div>
              <div class="mobile-box-padding" style="padding: 18px; background-color: #0E1526; border-left: 3px solid #FF3D00; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #F1F5F9; white-space: pre-wrap; word-break: break-word;">{{project_details}}</div>
            </td>
          </tr>

          <!-- Action CTA Button -->
          <tr>
            <td class="mobile-pad-section" style="padding: 4px 36px 32px;" align="center">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{admin_dashboard_url}}" target="_blank" class="mobile-cta-btn" style="display: inline-block; padding: 14px 32px; background-color: #FF3D00; color: #FFFFFF; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 10px; box-shadow: 0 0 20px rgba(255, 61, 0, 0.45);">
                      Open in Admin Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td class="mobile-pad-footer" style="padding: 24px 36px; background-color: #060911; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                This automated notification was generated on {{submission_time}}.<br>
                DOER Interior &amp; Control Room Engineering &bull; Khilkhet, Dhaka-1229, Bangladesh
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        key: 'enquiry_customer',
        name: 'Enquiry Acknowledgment (Sent to Customer)',
        category: 'enquiries',
        description: 'Auto-reply sent directly to the client confirming their project parameters were received.',
        subject: 'Thank You for Contacting DOER – Project Inquiry Confirmed',
        variables: JSON.stringify([
          { key: 'full_name', label: 'Full Name', desc: 'Customer name' },
          { key: 'service_interested', label: 'Service Interested', desc: 'Selected service' },
          { key: 'project_details', label: 'Project Message', desc: 'Summary of project details' },
          { key: 'site_name', label: 'Site Name', desc: 'DOER brand name' },
          { key: 'hotline', label: 'Direct Hotline', desc: '+880 1976-535654' },
          { key: 'site_url', label: 'Website URL', desc: 'Website URL link' },
          { key: 'logo_url', label: 'Site Logo URL', desc: 'Direct URL to DOER white brand logo' },
        ]),
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Inquiry Confirmed - DOER</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; }

    @media screen and (max-width: 600px) {
      .outer-wrapper { padding: 10px 4px !important; }
      .main-card { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; border-left: none !important; border-right: none !important; }
      .mobile-pad-header { padding: 20px 16px 16px !important; }
      .mobile-pad-body { padding: 20px 16px 14px !important; }
      .mobile-pad-section { padding: 0 16px 18px !important; }
      .mobile-pad-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.3 !important; }
      .mobile-box-padding { padding: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="background-color: #05070B; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="main-card" style="max-width: 600px; background-color: #0A0F1D; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; margin: 0 auto;">
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF3D00 0%, #00F0FF 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          <tr>
            <td class="mobile-pad-header" style="padding: 30px 36px 18px; background-color: #080C16; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <a href="{{site_url}}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="{{logo_url}}" alt="{{site_name}}" width="130" height="28" border="0" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
              </a>
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; margin-top: 6px;">
                Control Room Interiors &amp; Metal Art Supply
              </div>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-body" style="padding: 26px 36px 18px;">
              <h1 class="mobile-title" style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF;">
                Hello {{full_name}},
              </h1>
              <p style="margin: 12px 0 0; font-size: 14px; color: #CBD5E1; line-height: 1.6;">
                Thank you for reaching out to <strong style="color: #FFFFFF;">DOER</strong> regarding <strong style="color: #FF3D00;">{{service_interested}}</strong>.
              </p>
              <p style="margin: 12px 0 0; font-size: 13px; color: #94A3B8; line-height: 1.6;">
                Our project engineers and interior design specialists have received your inquiry. We are reviewing your technical specifications and will contact you shortly to discuss layout concepts, timeline, and preliminary quotations.
              </p>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 24px;">
              <div class="mobile-box-padding" style="padding: 16px; background-color: #0E1526; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B; margin-bottom: 4px;">
                  Need Immediate Assistance?
                </div>
                <div style="font-size: 13px; color: #E2E8F0;">
                  Call our technical hotline directly at <a href="tel:+8801976535654" style="color: #00F0FF; font-weight: 700; text-decoration: none;">{{hotline}}</a> or connect on WhatsApp.
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-footer" style="padding: 22px 36px; background-color: #060911; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                &copy; 2026 DOER. All Rights Reserved.<br>
                Kazi Bari Road, Jagannathpur, Khilkhet, Dhaka-1229, Bangladesh
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        key: 'career_admin',
        name: 'New Job Application (Admin Notification)',
        category: 'careers',
        description: 'Sent to the Receiver Email when a candidate applies for an open position.',
        subject: '💼 New Job Application: {{job_title}} from {{full_name}}',
        variables: JSON.stringify([
          { key: 'full_name', label: 'Candidate Name', desc: 'Candidate name' },
          { key: 'job_title', label: 'Job Title', desc: 'Applied job title' },
          { key: 'email', label: 'Email Address', desc: 'Candidate email' },
          { key: 'phone', label: 'Phone Number', desc: 'Candidate phone' },
          { key: 'experience_years', label: 'Years Experience', desc: 'Years of professional experience' },
          { key: 'highest_qualification', label: 'Qualification', desc: 'Highest educational qualification' },
          { key: 'institution', label: 'Institution', desc: 'University or institute' },
          { key: 'cv_url', label: 'CV Download Link', desc: 'Direct URL to candidate resume' },
          { key: 'admin_dashboard_url', label: 'Admin Portal URL', desc: 'Link to application in Admin' },
          { key: 'site_name', label: 'Site Name', desc: 'DOER brand name' },
          { key: 'site_url', label: 'Website URL', desc: 'Website domain link' },
          { key: 'logo_url', label: 'Site Logo URL', desc: 'Direct URL to DOER white brand logo' },
        ]),
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>New Job Application - DOER</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; }

    @media screen and (max-width: 600px) {
      .outer-wrapper { padding: 10px 4px !important; }
      .main-card { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; border-left: none !important; border-right: none !important; }
      .mobile-pad-header { padding: 20px 16px 16px !important; }
      .mobile-stack-header-left { display: block !important; width: 100% !important; text-align: left !important; }
      .mobile-stack-header-right { display: block !important; width: 100% !important; text-align: left !important; margin-top: 10px !important; }
      .mobile-pad-body { padding: 20px 16px 12px !important; }
      .mobile-pad-table { padding: 6px 16px 18px !important; }
      .mobile-pad-section { padding: 0 16px 18px !important; }
      .mobile-pad-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.3 !important; }
      .mobile-subtitle { font-size: 12px !important; line-height: 1.5 !important; }
      .mobile-row-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 10px 14px 2px !important; border-bottom: none !important; font-size: 10px !important; }
      .mobile-row-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 14px 10px !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; font-size: 13px !important; word-break: break-word !important; }
      .mobile-cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 14px 18px !important; text-align: center !important; font-size: 13px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="background-color: #05070B; min-height: 100vh; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="main-card" style="max-width: 620px; background-color: #0A0F1D; border-radius: 18px; border: 1px solid rgba(255, 61, 0, 0.3); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin: 0 auto;">
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF3D00 0%, #00F0FF 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          <tr>
            <td class="mobile-pad-header" style="padding: 30px 36px 18px; background-color: #080C16; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="mobile-stack-header-left">
                    <a href="{{site_url}}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="{{logo_url}}" alt="{{site_name}}" width="130" height="28" border="0" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
                    </a>
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; margin-top: 6px;">
                      Recruitment &amp; Careers
                    </div>
                  </td>
                  <td class="mobile-stack-header-right" align="right">
                    <span style="display: inline-block; padding: 5px 12px; background-color: rgba(255, 61, 0, 0.15); border: 1px solid rgba(255, 61, 0, 0.4); border-radius: 8px; font-size: 11px; font-weight: 700; color: #FF3D00; text-transform: uppercase; letter-spacing: 0.5px;">
                      Applicant Alert
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-body" style="padding: 26px 36px 12px;">
              <h1 class="mobile-title" style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
                New Candidate Application
              </h1>
              <p class="mobile-subtitle" style="margin: 8px 0 0; font-size: 13px; color: #94A3B8; line-height: 1.5;">
                A new resume has been submitted for position <strong style="color: #FF3D00;">{{job_title}}</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-table" style="padding: 12px 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 35%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Candidate Name
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #FFFFFF;">
                    {{full_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Applied Role
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #00F0FF;">
                    {{job_title}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Email Address
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; color: #CBD5E1;">
                    <a href="mailto:{{email}}" style="color: #CBD5E1; text-decoration: none;">{{email}}</a>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Phone Number
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #FF3D00;">
                    <a href="tel:{{phone}}" style="color: #FF3D00; text-decoration: none;">{{phone}}</a>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Experience
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; color: #E2E8F0;">
                    {{experience_years}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Education &amp; Institute
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; font-size: 13px; font-weight: 500; color: #CBD5E1;">
                    {{highest_qualification}} &bull; {{institution}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-section" style="padding: 4px 36px 32px;" align="center">
              <a href="{{admin_dashboard_url}}" target="_blank" class="mobile-cta-btn" style="display: inline-block; padding: 14px 32px; background-color: #FF3D00; color: #FFFFFF; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 10px; box-shadow: 0 0 20px rgba(255, 61, 0, 0.45);">
                Review Candidate Application &rarr;
              </a>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-footer" style="padding: 24px 36px; background-color: #060911; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                DOER Recruitment &bull; Human Resources Department &bull; Dhaka, Bangladesh
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        key: 'career_applicant',
        name: 'Application Received Confirmation (Sent to Applicant)',
        category: 'careers',
        description: 'Auto-reply sent directly to the candidate confirming that their resume and job application were successfully received by DOER Talent Acquisition.',
        subject: 'Application Received: {{job_title}} | DOER Careers',
        variables: JSON.stringify([
          { key: 'full_name', label: 'Candidate Name', desc: 'Candidate full name' },
          { key: 'job_title', label: 'Applied Role', desc: 'Job vacancy applied for' },
          { key: 'email', label: 'Email Address', desc: 'Candidate email address' },
          { key: 'phone', label: 'Phone Number', desc: 'Candidate phone' },
          { key: 'submission_time', label: 'Submission Time', desc: 'Date and time application was received' },
          { key: 'hotline', label: 'Talent Hotline', desc: '+880 1976-535654' },
          { key: 'site_name', label: 'Site Name', desc: 'DOER brand name' },
          { key: 'site_url', label: 'Website URL', desc: 'Website domain link' },
          { key: 'logo_url', label: 'Site Logo URL', desc: 'Direct URL to DOER white brand logo' },
        ]),
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Application Received - DOER Careers</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; }

    @media screen and (max-width: 600px) {
      .outer-wrapper { padding: 10px 4px !important; }
      .main-card { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; border-left: none !important; border-right: none !important; }
      .mobile-pad-header { padding: 20px 16px 16px !important; }
      .mobile-stack-header-left { display: block !important; width: 100% !important; text-align: left !important; }
      .mobile-stack-header-right { display: block !important; width: 100% !important; text-align: left !important; margin-top: 10px !important; }
      .mobile-pad-body { padding: 20px 16px 12px !important; }
      .mobile-pad-table { padding: 6px 16px 18px !important; }
      .mobile-pad-section { padding: 0 16px 18px !important; }
      .mobile-pad-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.3 !important; }
      .mobile-subtitle { font-size: 12px !important; line-height: 1.5 !important; }
      .mobile-row-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 10px 14px 2px !important; border-bottom: none !important; font-size: 10px !important; }
      .mobile-row-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 14px 10px !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; font-size: 13px !important; word-break: break-word !important; }
      .mobile-box-padding { padding: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="background-color: #05070B; min-height: 100vh; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="main-card" style="max-width: 620px; background-color: #0A0F1D; border-radius: 18px; border: 1px solid rgba(0, 240, 255, 0.25); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin: 0 auto;">
          
          <!-- Top Cyber Neon Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF3D00 0%, #00F0FF 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="mobile-pad-header" style="padding: 30px 36px 18px; background-color: #080C16; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="mobile-stack-header-left">
                    <a href="{{site_url}}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="{{logo_url}}" alt="{{site_name}}" width="130" height="28" border="0" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
                    </a>
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; margin-top: 6px;">
                      Careers &amp; Talent Acquisition
                    </div>
                  </td>
                  <td class="mobile-stack-header-right" align="right">
                    <span style="display: inline-block; padding: 6px 14px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; font-size: 11px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✓ Application Received
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="mobile-pad-body" style="padding: 26px 36px 12px;">
              <h1 class="mobile-title" style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
                Thank You, {{full_name}}!
              </h1>
              <p class="mobile-subtitle" style="margin: 10px 0 0; font-size: 14px; color: #CBD5E1; line-height: 1.6;">
                Thank you for applying for the position of <strong style="color: #00F0FF;">{{job_title}}</strong> at DOER. We have successfully received your resume and application credentials.
              </p>
            </td>
          </tr>

          <!-- Application Overview Card -->
          <tr>
            <td class="mobile-pad-table" style="padding: 12px 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr style="background-color: rgba(255,255,255,0.02);">
                  <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF;">
                    Application Summary
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 35%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Applied Position
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #00F0FF;">
                    {{job_title}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Candidate Name
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #FFFFFF;">
                    {{full_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Current Status
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #10B981;">
                    Under Review &bull; Talent Acquisition
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Received At
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; font-size: 13px; font-weight: 500; color: #CBD5E1;">
                    {{submission_time}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps Box -->
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr style="background-color: rgba(255,255,255,0.02);">
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF;">
                    What Happens Next?
                  </td>
                </tr>
                <tr>
                  <td class="mobile-box-padding" style="padding: 16px 18px; font-size: 13px; line-height: 1.7; color: #CBD5E1;">
                    <div style="margin-bottom: 8px;">
                      <strong style="color: #FF3D00;">1. Screening:</strong> Our hiring team will review your qualifications, CV, and portfolio against role criteria.
                    </div>
                    <div style="margin-bottom: 8px;">
                      <strong style="color: #00F0FF;">2. Interview:</strong> If your profile is shortlisted, our recruitment team will reach out via phone or email for an interview.
                    </div>
                    <div>
                      <strong style="color: #10B981;">3. Feedback:</strong> We strive to review applications within 5–7 business days.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support Hotline Box -->
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 28px;">
              <div class="mobile-box-padding" style="padding: 18px; background-color: #0E1526; border-left: 3px solid #00F0FF; border-radius: 10px;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #FFFFFF; margin-bottom: 4px;">
                  Have Questions or Inquiries?
                </div>
                <div style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
                  Contact our Talent Acquisition team at <a href="tel:+8801976535654" style="color: #00F0FF; font-weight: 700; text-decoration: none;">{{hotline}}</a> or reply directly to this email.
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="mobile-pad-footer" style="padding: 24px 36px; background-color: #060911; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.6;">
                &copy; 2026 DOER. All Rights Reserved.<br>
                Human Resources Department &bull; Khilkhet, Dhaka-1229, Bangladesh &bull; <a href="{{site_url}}" style="color: #00F0FF; text-decoration: none;">doerbd.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        key: 'order_admin',
        name: 'New E-commerce Order (Admin Notification)',
        category: 'orders',
        description: 'Sent to the Receiver Email when a customer places an order via direct checkout.',
        subject: '🛒 New Order #{{order_number}}: {{product_name}} (Qty: {{quantity}})',
        variables: JSON.stringify([
          { key: 'order_number', label: 'Order Number', desc: 'Unique order identifier' },
          { key: 'customer_name', label: 'Customer Name', desc: 'Customer full name' },
          { key: 'product_name', label: 'Product Name', desc: 'Purchased product title' },
          { key: 'quantity', label: 'Quantity', desc: 'Order quantity units' },
          { key: 'product_price', label: 'Unit Price', desc: 'Product unit price (BDT)' },
          { key: 'total_price', label: 'Total Price', desc: 'Total payable BDT amount' },
          { key: 'phone', label: 'Phone Number', desc: 'Customer contact phone' },
          { key: 'email', label: 'Email Address', desc: 'Customer email address' },
          { key: 'company_name', label: 'Company / Org', desc: 'Company or institution name' },
          { key: 'delivery_address', label: 'Delivery Address', desc: 'Shipping destination address' },
          { key: 'notes', label: 'Customer Notes', desc: 'Special delivery instructions' },
          { key: 'order_date', label: 'Order Date', desc: 'Timestamp when order was placed' },
          { key: 'admin_dashboard_url', label: 'Admin Portal URL', desc: 'Link to manage order in Admin' },
          { key: 'site_name', label: 'Site Name', desc: 'DOER brand name' },
          { key: 'site_url', label: 'Website URL', desc: 'Website domain link' },
          { key: 'logo_url', label: 'Site Logo URL', desc: 'Direct URL to DOER white brand logo' },
        ]),
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>New Order Alert - DOER</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; }

    @media screen and (max-width: 600px) {
      .outer-wrapper { padding: 10px 4px !important; }
      .main-card { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; border-left: none !important; border-right: none !important; }
      .mobile-pad-header { padding: 20px 16px 16px !important; }
      .mobile-stack-header-left { display: block !important; width: 100% !important; text-align: left !important; }
      .mobile-stack-header-right { display: block !important; width: 100% !important; text-align: left !important; margin-top: 10px !important; }
      .mobile-pad-body { padding: 20px 16px 12px !important; }
      .mobile-pad-table { padding: 6px 16px 18px !important; }
      .mobile-pad-section { padding: 0 16px 18px !important; }
      .mobile-pad-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.3 !important; }
      .mobile-subtitle { font-size: 12px !important; line-height: 1.5 !important; }
      .mobile-row-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 10px 14px 2px !important; border-bottom: none !important; font-size: 10px !important; }
      .mobile-row-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 14px 10px !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; font-size: 13px !important; word-break: break-word !important; }
      .mobile-cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 14px 18px !important; text-align: center !important; font-size: 13px !important; }
      .mobile-box-padding { padding: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="background-color: #05070B; min-height: 100vh; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="main-card" style="max-width: 620px; background-color: #0A0F1D; border-radius: 18px; border: 1px solid rgba(0, 240, 255, 0.25); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin: 0 auto;">
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF3D00 0%, #00F0FF 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>
          <tr>
            <td class="mobile-pad-header" style="padding: 30px 36px 18px; background-color: #080C16; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="mobile-stack-header-left">
                    <a href="{{site_url}}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="{{logo_url}}" alt="{{site_name}}" width="130" height="28" border="0" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
                    </a>
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; margin-top: 6px;">
                      E-Commerce Order Notification
                    </div>
                  </td>
                  <td class="mobile-stack-header-right" align="right">
                    <span style="display: inline-block; padding: 5px 12px; background-color: rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; font-size: 11px; font-weight: 700; color: #00F0FF; text-transform: uppercase; letter-spacing: 0.5px;">
                      Order #{{order_number}}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-body" style="padding: 26px 36px 12px;">
              <h1 class="mobile-title" style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
                New E-Commerce Order Placed!
              </h1>
              <p class="mobile-subtitle" style="margin: 8px 0 0; font-size: 13px; color: #94A3B8; line-height: 1.5;">
                A customer just completed checkout for <strong style="color: #FFFFFF;">{{product_name}}</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-table" style="padding: 12px 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 35%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Product
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #FFFFFF;">
                    {{product_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Quantity &amp; Amount
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 800; color: #00F0FF;">
                    {{quantity}} Unit(s) &bull; ৳ {{total_price}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Customer Name
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #FFFFFF;">
                    {{customer_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Phone Number
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #FF3D00;">
                    <a href="tel:{{phone}}" style="color: #FF3D00; text-decoration: none;">{{phone}}</a>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Email Address
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; color: #CBD5E1;">
                    <a href="mailto:{{email}}" style="color: #CBD5E1; text-decoration: none;">{{email}}</a>
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Company / Org
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 500; color: #E2E8F0;">
                    {{company_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Delivery Address
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; font-size: 13px; font-weight: 500; color: #E2E8F0;">
                    {{delivery_address}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 24px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94A3B8; margin-bottom: 8px;">
                Customer Notes / Special Request
              </div>
              <div class="mobile-box-padding" style="padding: 16px; background-color: #0E1526; border-left: 3px solid #00F0FF; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #F1F5F9; word-break: break-word;">
                {{notes}}
              </div>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-section" style="padding: 4px 36px 32px;" align="center">
              <a href="{{admin_dashboard_url}}" target="_blank" class="mobile-cta-btn" style="display: inline-block; padding: 14px 32px; background-color: #FF3D00; color: #FFFFFF; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 10px; box-shadow: 0 0 20px rgba(255, 61, 0, 0.45);">
                Manage Order in Admin Portal &rarr;
              </a>
            </td>
          </tr>
          <tr>
            <td class="mobile-pad-footer" style="padding: 24px 36px; background-color: #060911; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                Placed on {{order_date}} &bull; DOER Interior &amp; Console Engineering
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        key: 'order_customer',
        name: 'Order Received Confirmation (Customer Reply)',
        category: 'orders',
        description: 'Sent directly to the customer confirming their order reference number, product details, and shipping address.',
        subject: '✅ Order Confirmed #{{order_number}} – {{product_name}} | DOER',
        variables: JSON.stringify([
          { key: 'order_number', label: 'Order Number', desc: 'Unique order identifier' },
          { key: 'customer_name', label: 'Customer Name', desc: 'Customer full name' },
          { key: 'product_name', label: 'Product Name', desc: 'Purchased product title' },
          { key: 'quantity', label: 'Quantity', desc: 'Order quantity units' },
          { key: 'product_price', label: 'Unit Price', desc: 'Product unit price (BDT)' },
          { key: 'total_price', label: 'Total Price', desc: 'Total payable BDT amount' },
          { key: 'delivery_address', label: 'Delivery Address', desc: 'Shipping destination address' },
          { key: 'phone', label: 'Phone Number', desc: 'Customer contact phone' },
          { key: 'company_name', label: 'Company / Org', desc: 'Company or institution name' },
          { key: 'notes', label: 'Customer Notes', desc: 'Customer instructions' },
          { key: 'order_date', label: 'Order Date', desc: 'Timestamp when order was placed' },
          { key: 'hotline', label: 'Customer Hotline', desc: '+880 1976-535654' },
          { key: 'site_name', label: 'Site Name', desc: 'DOER brand name' },
          { key: 'site_url', label: 'Website URL', desc: 'Website domain link' },
          { key: 'logo_url', label: 'Site Logo URL', desc: 'Direct URL to DOER white brand logo' },
        ]),
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Order Confirmed - DOER</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; -webkit-font-smoothing: antialiased; }

    @media screen and (max-width: 600px) {
      .outer-wrapper { padding: 10px 4px !important; }
      .main-card { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; border-left: none !important; border-right: none !important; }
      .mobile-pad-header { padding: 20px 16px 16px !important; }
      .mobile-stack-header-left { display: block !important; width: 100% !important; text-align: left !important; }
      .mobile-stack-header-right { display: block !important; width: 100% !important; text-align: left !important; margin-top: 10px !important; }
      .mobile-pad-body { padding: 20px 16px 12px !important; }
      .mobile-pad-table { padding: 6px 16px 18px !important; }
      .mobile-pad-section { padding: 0 16px 18px !important; }
      .mobile-pad-footer { padding: 20px 16px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.3 !important; }
      .mobile-row-label { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 10px 14px 2px !important; border-bottom: none !important; font-size: 10px !important; }
      .mobile-row-value { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 14px 10px !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; font-size: 13px !important; word-break: break-word !important; }
      .mobile-box-padding { padding: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="background-color: #05070B; min-height: 100vh; padding: 30px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="main-card" style="max-width: 620px; background-color: #0A0F1D; border-radius: 18px; border: 1px solid rgba(0, 240, 255, 0.25); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin: 0 auto;">
          
          <!-- Top Cyber Neon Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FF3D00 0%, #00F0FF 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="mobile-pad-header" style="padding: 30px 36px 18px; background-color: #080C16; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="mobile-stack-header-left">
                    <a href="{{site_url}}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="{{logo_url}}" alt="{{site_name}}" width="130" height="28" border="0" style="display: block; width: 130px; max-width: 130px; height: auto; border: 0; outline: none; text-decoration: none;" />
                    </a>
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #00F0FF; margin-top: 6px;">
                      Mission-Critical Furniture &amp; Interior
                    </div>
                  </td>
                  <td class="mobile-stack-header-right" align="right">
                    <span style="display: inline-block; padding: 6px 14px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; font-size: 11px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✓ Order Confirmed
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="mobile-pad-body" style="padding: 26px 36px 12px;">
              <h1 class="mobile-title" style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; line-height: 1.3;">
                Thank You, {{customer_name}}!
              </h1>
              <p class="mobile-subtitle" style="margin: 10px 0 0; font-size: 14px; color: #CBD5E1; line-height: 1.6;">
                We have received your order <strong style="color: #00F0FF;">#{{order_number}}</strong>. Our logistics and production team is now processing your items for quality inspection and delivery.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td class="mobile-pad-table" style="padding: 12px 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr style="background-color: rgba(255,255,255,0.02);">
                  <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF;">
                    Order Summary
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 35%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Order Reference
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 700; color: #00F0FF;">
                    #{{order_number}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Item Ordered
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; font-weight: 700; color: #FFFFFF;">
                    {{product_name}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Quantity
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 600; color: #E2E8F0;">
                    {{quantity}} Unit(s)
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Total Payable
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 16px; font-weight: 800; color: #FF3D00;">
                    ৳ {{total_price}}
                  </td>
                </tr>
                <tr>
                  <td class="mobile-row-label" style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B;">
                    Payment Method
                  </td>
                  <td class="mobile-row-value" style="padding: 14px 18px; font-size: 13px; font-weight: 600; color: #CBD5E1;">
                    Cash on Delivery / Bank Transfer upon delivery
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Box -->
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A12; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden;">
                <tr style="background-color: rgba(255,255,255,0.02);">
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF;">
                    Delivery Information
                  </td>
                </tr>
                <tr>
                  <td class="mobile-box-padding" style="padding: 16px 18px; font-size: 13px; line-height: 1.6; color: #CBD5E1;">
                    <div style="font-weight: 700; color: #FFFFFF; font-size: 14px; margin-bottom: 4px;">{{customer_name}}</div>
                    <div>{{delivery_address}}</div>
                    <div style="margin-top: 6px; font-weight: 600; color: #00F0FF;">Phone: {{phone}}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support Hotline Box -->
          <tr>
            <td class="mobile-pad-section" style="padding: 0 36px 28px;">
              <div class="mobile-box-padding" style="padding: 18px; background-color: #0E1526; border-left: 3px solid #00F0FF; border-radius: 10px;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #FFFFFF; margin-bottom: 4px;">
                  Need Quick Assistance or Order Customization?
                </div>
                <div style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
                  Reach our customer desk directly at <a href="tel:+8801976535654" style="color: #00F0FF; font-weight: 700; text-decoration: none;">{{hotline}}</a> or reply directly to this email. We are available 7 days a week.
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="mobile-pad-footer" style="padding: 24px 36px; background-color: #060911; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.6;">
                &copy; 2026 DOER. All Rights Reserved.<br>
                Kazi Bari Road, Jagannathpur, Khilkhet, Dhaka-1229, Bangladesh &bull; <a href="{{site_url}}" style="color: #00F0FF; text-decoration: none;">doerbd.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
    ];

    for (const t of defaultTemplates) {
      const [existing]: any = await pool.execute('SELECT id, body_html FROM mail_templates WHERE template_key = ?', [t.key]);
      if (!existing || existing.length === 0) {
        await pool.execute(
          `INSERT INTO mail_templates (
            template_key, name, category, subject, body_html, description, available_variables
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [t.key, t.name, t.category, t.subject, t.body, t.description, t.variables]
        );
      } else {
        // Upgrade existing template to the 100% mobile-responsive edition with official site logo
        if (!existing[0]?.body_html || !existing[0].body_html.includes('logo_url')) {
          await pool.execute(
            `UPDATE mail_templates SET name = ?, subject = ?, body_html = ?, available_variables = ?, updated_at = NOW() WHERE template_key = ?`,
            [t.name, t.subject, t.body, t.variables, t.key]
          );
        }
      }
    }

    initialized = true;
  } catch (error) {
    console.error('Error ensuring mail tables:', error);
    throw error;
  }
}

