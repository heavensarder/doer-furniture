import nodemailer from 'nodemailer';
import pool from './db';
import { ensureMailTables } from './mail-db';

export interface MailSettingsData {
  id?: number;
  provider: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: number | boolean;
  smtp_user: string;
  smtp_pass?: string | null;
  sender_name: string;
  sender_email: string;
  receiver_email: string;
  order_receiver_email?: string | null;
  cc_email?: string | null;
  order_cc_email?: string | null;
  reply_to_email?: string | null;
  enquiry_notification_enabled: number | boolean;
  career_notification_enabled: number | boolean;
  order_notification_enabled: number | boolean;
  customer_reply_enabled: number | boolean;
  updated_at?: string;
}

export interface MailTemplateData {
  id?: number;
  template_key: string;
  name: string;
  category: string;
  subject: string;
  body_html: string;
  description?: string;
  available_variables: string;
  is_active: number | boolean;
}

export async function getActiveMailSettings(): Promise<MailSettingsData | null> {
  try {
    await ensureMailTables();
    const [rows]: any = await pool.execute('SELECT * FROM mail_settings LIMIT 1');
    return rows && rows[0] ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching mail settings:', error);
    return null;
  }
}

export async function getMailTemplate(key: string): Promise<MailTemplateData | null> {
  try {
    await ensureMailTables();
    const [rows]: any = await pool.execute('SELECT * FROM mail_templates WHERE template_key = ? LIMIT 1', [key]);
    return rows && rows[0] ? rows[0] : null;
  } catch (error) {
    console.error(`Error fetching mail template ${key}:`, error);
    return null;
  }
}

export function replacePlaceholders(content: string, variables: Record<string, string | number | null | undefined>): string {
  if (!content) return '';
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const valStr = value !== null && value !== undefined ? String(value) : '';
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    result = result.replace(regex, valStr);
  }
  return result;
}

export function createNodemailerTransporter(settings: MailSettingsData) {
  const isSecure = settings.smtp_secure === 1 || settings.smtp_secure === true || Number(settings.smtp_port) === 465;

  return nodemailer.createTransport({
    host: settings.smtp_host || 'smtp.titan.email',
    port: Number(settings.smtp_port) || 465,
    secure: isSecure,
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass || '',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Tests SMTP credentials by verifying handshake and optionally sending a test message
 */
export async function testSmtpConnection(settings: MailSettingsData, testRecipient: string) {
  try {
    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
      return {
        success: false,
        error: 'Missing SMTP credentials. Please fill Host, Username, and Password.',
      };
    }

    const transporter = createNodemailerTransporter(settings);

    // 1. Verify connection
    await transporter.verify();

    // 2. Send test email
    const fromAddress = `"${settings.sender_name || 'DOER Notifications'}" <${settings.sender_email || settings.smtp_user}>`;
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const info = await transporter.sendMail({
      from: fromAddress,
      to: testRecipient,
      subject: `✅ SMTP Connection Successful | DOER [${now}]`,
      html: `
        <div style="font-family:sans-serif; background:#05070B; color:#E2E8F0; padding:25px; border-radius:12px;">
          <h2 style="color:#00F0FF; margin-top:0;">Hostinger Titan SMTP Configured Successfully!</h2>
          <p>This is a test notification confirming that DOER's email server is connected and authenticated.</p>
          <table style="width:100%; border-collapse:collapse; margin-top:15px; color:#CBD5E1; font-size:13px;">
            <tr><td style="padding:6px; border-bottom:1px solid #1E293B; width:35%;"><strong>SMTP Host:</strong></td><td style="padding:6px; border-bottom:1px solid #1E293B;">${settings.smtp_host}</td></tr>
            <tr><td style="padding:6px; border-bottom:1px solid #1E293B;"><strong>SMTP Port:</strong></td><td style="padding:6px; border-bottom:1px solid #1E293B;">${settings.smtp_port} (Secure: ${Boolean(settings.smtp_secure)})</td></tr>
            <tr><td style="padding:6px; border-bottom:1px solid #1E293B;"><strong>Sender Account:</strong></td><td style="padding:6px; border-bottom:1px solid #1E293B;">${settings.sender_email}</td></tr>
            <tr><td style="padding:6px; border-bottom:1px solid #1E293B;"><strong>Tested At:</strong></td><td style="padding:6px; border-bottom:1px solid #1E293B;">${now} (Bangladesh Time)</td></tr>
          </table>
          <p style="margin-top:20px; font-size:12px; color:#94A3B8;">DOER &bull; High-End Console Tables, Control Room Interiors &amp; Metal Art</p>
        </div>
      `,
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error: any) {
    console.error('SMTP Test Failed:', error);
    return {
      success: false,
      error: error.message || 'SMTP Authentication Failed. Check username, password, or port.',
    };
  }
}

/**
 * Triggers the New Enquiry Email workflow when a visitor submits the contact form
 */
export async function sendEnquiryNotification(inquiry: {
  id?: number;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  serviceInterested: string;
  projectLocation?: string;
  projectDetails: string;
}) {
  try {
    const settings = await getActiveMailSettings();
    if (!settings) {
      console.warn('Mail settings not found in database. Skipping email notification.');
      return;
    }

    // Check if notifications are enabled and SMTP credentials exist
    const isEnabled = settings.enquiry_notification_enabled === 1 || settings.enquiry_notification_enabled === true;
    if (!isEnabled) {
      console.log('Enquiry email notification is disabled in Mail Config.');
      return;
    }

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass || !settings.receiver_email) {
      console.warn('SMTP credentials or receiver email not fully configured. Skipping email.');
      return;
    }

    const template = await getMailTemplate('enquiry_admin');
    if (!template || !template.is_active) {
      console.warn('Template enquiry_admin is inactive or missing.');
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://doerbd.com';
    const submissionTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const variables: Record<string, string | number> = {
      full_name: inquiry.fullName,
      company_name: inquiry.companyName || 'Not specified',
      email: inquiry.email,
      phone: inquiry.phone,
      service_interested: inquiry.serviceInterested,
      project_location: inquiry.projectLocation || 'Not specified',
      project_details: inquiry.projectDetails,
      submission_time: submissionTime,
      inquiry_id: inquiry.id ? String(inquiry.id) : 'NEW',
      admin_dashboard_url: `${siteUrl}/admin/dashboard/enquiries`,
      site_name: 'DOER',
      site_url: siteUrl,
      hotline: '+880 1976-535654',
    };

    const parsedSubject = replacePlaceholders(template.subject, variables);
    const parsedHtml = replacePlaceholders(template.body_html, variables);

    const transporter = createNodemailerTransporter(settings);
    const fromAddress = `"${settings.sender_name || 'DOER Notifications'}" <${settings.sender_email || settings.smtp_user}>`;

    // 1. Send to Admin Receiver
    await transporter.sendMail({
      from: fromAddress,
      to: settings.receiver_email,
      cc: settings.cc_email || undefined,
      replyTo: inquiry.email,
      subject: parsedSubject,
      html: parsedHtml,
    });

    console.log(`Enquiry notification email sent to ${settings.receiver_email}`);

    // 2. Send Acknowledgment to Customer if enabled
    const isCustomerReplyEnabled = settings.customer_reply_enabled === 1 || settings.customer_reply_enabled === true;
    if (isCustomerReplyEnabled && inquiry.email) {
      const customerTemplate = await getMailTemplate('enquiry_customer');
      if (customerTemplate && customerTemplate.is_active) {
        const custSubject = replacePlaceholders(customerTemplate.subject, variables);
        const custHtml = replacePlaceholders(customerTemplate.body_html, variables);

        await transporter.sendMail({
          from: fromAddress,
          to: inquiry.email,
          replyTo: settings.reply_to_email || settings.sender_email || undefined,
          subject: custSubject,
          html: custHtml,
        });

        console.log(`Enquiry acknowledgment sent to customer: ${inquiry.email}`);
      }
    }
  } catch (err: any) {
    console.error('Failed to send enquiry notification email:', err.message || err);
    // Don't throw to avoid interrupting user submission
  }
}

/**
 * Triggers order notification emails:
 * 1. Admin order alert dispatched to receiver_email
 * 2. Automated order confirmation dispatched directly to the customer's email
 */
export async function sendOrderNotifications(order: {
  id?: number;
  order_number: string;
  product_id?: number | null;
  product_name: string;
  product_slug?: string;
  product_image?: string;
  product_price?: number | null;
  quantity: number;
  customer_name: string;
  phone: string;
  email: string;
  company_name?: string;
  delivery_address: string;
  notes?: string;
  status?: string;
  created_at?: string | Date;
}) {
  try {
    const settings = await getActiveMailSettings();
    if (!settings) {
      console.warn('Mail settings not found. Skipping order email notifications.');
      return;
    }

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
      console.warn('SMTP credentials not configured. Skipping order email notifications.');
      return;
    }

    const transporter = createNodemailerTransporter(settings);
    const fromAddress = `"${settings.sender_name || 'DOER Orders'}" <${settings.sender_email || settings.smtp_user}>`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://doerbd.com';

    const orderDate = order.created_at
      ? new Date(order.created_at).toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'full',
          timeStyle: 'medium',
        })
      : new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'full',
          timeStyle: 'medium',
        });

    const unitPrice =
      order.product_price && Number(order.product_price) > 0
        ? Number(order.product_price).toLocaleString('en-BD')
        : 'Call for Price';

    const totalPrice =
      order.product_price && Number(order.product_price) > 0
        ? (Number(order.product_price) * (order.quantity || 1)).toLocaleString('en-BD')
        : 'Call for Price';

    const variables: Record<string, string | number> = {
      order_number: order.order_number,
      customer_name: order.customer_name,
      email: order.email,
      phone: order.phone,
      company_name: order.company_name || 'Not specified',
      delivery_address: order.delivery_address,
      product_name: order.product_name,
      quantity: String(order.quantity || 1),
      product_price: unitPrice,
      total_price: totalPrice,
      notes: order.notes || 'None',
      order_date: orderDate,
      admin_dashboard_url: `${siteUrl}/admin/dashboard/orders`,
      site_name: 'DOER',
      site_url: siteUrl,
      hotline: '+880 1976-535654',
    };

    // 1. Send Order Notification to Admin (STRICT SEPARATION: Delivered exclusively to order_receiver_email; Primary Receiver is isolated)
    const isOrderAdminEnabled =
      settings.order_notification_enabled === 1 || settings.order_notification_enabled === true;

    const adminOrderReceiver = (settings.order_receiver_email || '').trim();
    const adminOrderCc = (settings.order_cc_email || '').trim();

    if (isOrderAdminEnabled && adminOrderReceiver) {
      const adminTemplate = await getMailTemplate('order_admin');
      if (adminTemplate && adminTemplate.is_active) {
        const adminSubject = replacePlaceholders(adminTemplate.subject, variables);
        const adminHtml = replacePlaceholders(adminTemplate.body_html, variables);

        await transporter.sendMail({
          from: fromAddress,
          to: adminOrderReceiver,
          cc: adminOrderCc || undefined,
          replyTo: order.email,
          subject: adminSubject,
          html: adminHtml,
        });

        console.log(`Order notification #${order.order_number} sent exclusively to e-commerce receiver: ${adminOrderReceiver}`);
      }
    } else if (isOrderAdminEnabled && !adminOrderReceiver) {
      console.warn('E-commerce Primary Receiver Email (order_receiver_email) is not configured. E-commerce order email skipped (Primary Receiver does not receive e-commerce notifications per strict separation).');
    }

    // 2. Send Order Confirmation Reply to Customer
    const isCustomerReplyEnabled =
      settings.customer_reply_enabled === 1 || settings.customer_reply_enabled === true;

    if (isCustomerReplyEnabled && order.email) {
      const customerTemplate = await getMailTemplate('order_customer');
      if (customerTemplate && customerTemplate.is_active) {
        const custSubject = replacePlaceholders(customerTemplate.subject, variables);
        const custHtml = replacePlaceholders(customerTemplate.body_html, variables);

        await transporter.sendMail({
          from: fromAddress,
          to: order.email,
          replyTo: settings.reply_to_email || settings.sender_email || undefined,
          subject: custSubject,
          html: custHtml,
        });

        console.log(`Order confirmation reply #${order.order_number} sent to customer: ${order.email}`);
      }
    }
  } catch (err: any) {
    console.error('Failed to dispatch order notification emails:', err.message || err);
    // Don't throw to avoid interrupting order placement
  }
}

export interface CareerApplicationData {
  id?: number | string;
  job_id?: number | string | null;
  job_title: string;
  position?: string | null;
  photo_url?: string | null;
  full_name: string;
  email: string;
  phone: string;
  current_address?: string | null;
  highest_qualification?: string | null;
  institution?: string | null;
  experience_years?: string | null;
  cv_url?: string | null;
  why_join?: string | null;
  created_at?: string | Date | null;
}

export async function sendCareerNotification(application: CareerApplicationData): Promise<void> {
  try {
    const settings = await getActiveMailSettings();
    if (!settings) {
      console.warn('Mail settings not configured. Career notification email skipped.');
      return;
    }

    const transporter = createNodemailerTransporter(settings);
    const fromAddress = `"${settings.sender_name || 'DOER Careers'}" <${settings.sender_email || settings.smtp_user}>`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://doerbd.com';

    const submissionTime = application.created_at
      ? new Date(application.created_at).toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'full',
          timeStyle: 'medium',
        })
      : new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'full',
          timeStyle: 'medium',
        });

    // Format full CV and photo URLs so links work directly from email clients
    const cvUrl = application.cv_url
      ? application.cv_url.startsWith('http')
        ? application.cv_url
        : `${siteUrl}${application.cv_url.startsWith('/') ? '' : '/'}${application.cv_url}`
      : '#';

    const photoUrl = application.photo_url
      ? application.photo_url.startsWith('http')
        ? application.photo_url
        : `${siteUrl}${application.photo_url.startsWith('/') ? '' : '/'}${application.photo_url}`
      : '';

    const variables: Record<string, string | number> = {
      job_title: application.job_title || 'Position Not Specified',
      position: application.position || application.job_title || 'General Application',
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      experience_years: application.experience_years || 'Not specified',
      highest_qualification: application.highest_qualification || 'Not specified',
      institution: application.institution || 'Not specified',
      current_address: application.current_address || 'Not specified',
      why_join: application.why_join || 'No cover note provided',
      cv_url: cvUrl,
      photo_url: photoUrl,
      submission_time: submissionTime,
      application_id: String(application.id || 'N/A'),
      admin_dashboard_url: `${siteUrl}/admin/dashboard/career/applications`,
      site_name: 'DOER',
      site_url: siteUrl,
      hotline: '+880 1976-535654',
    };

    // 1. Dispatch New Career Application Alert to Admin Inbox
    const isCareerAdminEnabled =
      settings.career_notification_enabled === 1 || settings.career_notification_enabled === true;

    if (isCareerAdminEnabled && settings.receiver_email) {
      const adminTemplate = await getMailTemplate('career_admin');
      if (adminTemplate && adminTemplate.is_active) {
        const adminSubject = replacePlaceholders(adminTemplate.subject, variables);
        const adminHtml = replacePlaceholders(adminTemplate.body_html, variables);

        await transporter.sendMail({
          from: fromAddress,
          to: settings.receiver_email,
          cc: settings.cc_email || undefined,
          replyTo: application.email,
          subject: adminSubject,
          html: adminHtml,
        });

        console.log(`Career application notification for "${application.job_title}" from ${application.full_name} sent to admin: ${settings.receiver_email}`);
      }
    }

    // 2. Dispatch Confirmation & Next-Steps Auto-Reply to Candidate
    const isCandidateReplyEnabled =
      settings.customer_reply_enabled === 1 || settings.customer_reply_enabled === true;

    if (isCandidateReplyEnabled && application.email) {
      const candidateTemplate = await getMailTemplate('career_applicant');
      if (candidateTemplate && candidateTemplate.is_active) {
        const candidateSubject = replacePlaceholders(candidateTemplate.subject, variables);
        const candidateHtml = replacePlaceholders(candidateTemplate.body_html, variables);

        await transporter.sendMail({
          from: fromAddress,
          to: application.email,
          replyTo: settings.reply_to_email || settings.sender_email || undefined,
          subject: candidateSubject,
          html: candidateHtml,
        });

        console.log(`Career acknowledgment auto-reply sent to candidate: ${application.email}`);
      }
    }
  } catch (err: any) {
    console.error('Failed to dispatch career application notification emails:', err.message || err);
    // Don't throw to prevent interrupting the candidate's submission
  }
}



