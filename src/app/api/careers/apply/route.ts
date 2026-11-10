import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureCareerTables } from '@/lib/career-db';
import { sendCareerNotification } from '@/lib/mail-sender';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function sanitizeFileName(rawName: string, prefix: string): string {
  const ext = (path.extname(rawName) || '').toLowerCase();
  const baseName = path
    .basename(rawName, path.extname(rawName))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30);

  return `${prefix}-${baseName || 'file'}-${Date.now()}-${Math.round(Math.random() * 10000)}${ext}`;
}

async function saveFileBuffer(category: 'photos' | 'cvs', fileName: string, buffer: Buffer): Promise<string> {
  const primaryDir = path.join(process.cwd(), 'public', 'uploads', 'careers', category);
  const fallbackDir = path.join(process.cwd(), 'uploads', 'careers', category);

  try {
    await mkdir(primaryDir, { recursive: true, mode: 0o775 });
    await writeFile(path.join(primaryDir, fileName), buffer, { mode: 0o644 });
  } catch {
    await mkdir(fallbackDir, { recursive: true, mode: 0o775 });
    await writeFile(path.join(fallbackDir, fileName), buffer, { mode: 0o644 });
  }

  return `/api/uploads/careers/${category}/${fileName}`;
}

export async function POST(request: Request) {
  try {
    await ensureCareerTables();

    const contentType = request.headers.get('content-type') || '';

    let jobId = 0;
    let jobTitle = '';
    let position = '';
    let fullName = '';
    let email = '';
    let phone = '';
    let currentAddress = '';
    let highestQualification = '';
    let institution = '';
    let experienceYears = '';
    let whyJoin = '';
    let agreed = false;
    let photoUrl = '';
    let cvUrl = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      jobId = Number(body.job_id);
      jobTitle = String(body.job_title || '').trim();
      position = String(body.position || jobTitle).trim();
      fullName = String(body.full_name || '').trim();
      email = String(body.email || '').trim();
      phone = String(body.phone || '').trim();
      currentAddress = String(body.current_address || '').trim();
      highestQualification = String(body.highest_qualification || '').trim();
      institution = String(body.institution || '').trim();
      experienceYears = String(body.experience_years || '').trim();
      whyJoin = String(body.why_join || '').trim();
      agreed = Boolean(body.agreed);
      photoUrl = String(body.photo_url || '').trim();
      cvUrl = String(body.cv_url || '').trim();
    } else {
      const formData = await request.formData();

      jobId = Number(formData.get('job_id'));
      jobTitle = String(formData.get('job_title') || '').trim();
      position = String(formData.get('position') || jobTitle).trim();
      fullName = String(formData.get('full_name') || '').trim();
      email = String(formData.get('email') || '').trim();
      phone = String(formData.get('phone') || '').trim();
      currentAddress = String(formData.get('current_address') || '').trim();
      highestQualification = String(formData.get('highest_qualification') || '').trim();
      institution = String(formData.get('institution') || '').trim();
      experienceYears = String(formData.get('experience_years') || '').trim();
      whyJoin = String(formData.get('why_join') || '').trim();
      agreed =
        formData.get('agreed') === 'true' ||
        formData.get('agreed') === '1' ||
        formData.get('agreed') === 'on';

      photoUrl = String(formData.get('photo_url') || '').trim();
      cvUrl = String(formData.get('cv_url') || '').trim();

      const photoFile = formData.get('photo') as File | null;
      const cvFile = formData.get('cv') as File | null;

      // Handle direct file uploads if URLs were not pre-provided
      if (!photoUrl && photoFile && typeof photoFile.arrayBuffer === 'function') {
        if (photoFile.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'Candidate photo must not exceed 5MB.' },
            { status: 400 }
          );
        }
        const photoName = sanitizeFileName(photoFile.name || 'photo.jpg', 'photo');
        const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
        photoUrl = await saveFileBuffer('photos', photoName, photoBuffer);
      }

      if (!cvUrl && cvFile && typeof cvFile.arrayBuffer === 'function') {
        if (cvFile.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'CV document must not exceed 5MB.' },
            { status: 400 }
          );
        }
        const cvName = sanitizeFileName(cvFile.name || 'resume.pdf', 'cv');
        const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
        cvUrl = await saveFileBuffer('cvs', cvName, cvBuffer);
      }
    }

    // Comprehensive Validations
    if (!jobId || !jobTitle) {
      return NextResponse.json({ error: 'Valid job position must be selected.' }, { status: 400 });
    }
    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }
    if (!currentAddress) {
      return NextResponse.json({ error: 'Current address is required.' }, { status: 400 });
    }
    if (!highestQualification) {
      return NextResponse.json({ error: 'Highest educational qualification is required.' }, { status: 400 });
    }
    if (!institution) {
      return NextResponse.json({ error: 'University or institution name is required.' }, { status: 400 });
    }
    if (!experienceYears) {
      return NextResponse.json({ error: 'Years of professional experience is required.' }, { status: 400 });
    }
    if (!whyJoin) {
      return NextResponse.json({ error: 'Please share why you want to join DOER.' }, { status: 400 });
    }
    if (!agreed) {
      return NextResponse.json(
        { error: 'You must confirm the accuracy of information and agree to the Privacy Policy.' },
        { status: 400 }
      );
    }
    if (!photoUrl) {
      return NextResponse.json({ error: 'Candidate photo upload is required.' }, { status: 400 });
    }
    if (!cvUrl) {
      return NextResponse.json({ error: 'CV document upload is required.' }, { status: 400 });
    }

    // Save record to MySQL
    const [result]: any = await pool.execute(
      `INSERT INTO job_applications (
        job_id, job_title, position, photo_url, full_name, email, phone,
        current_address, highest_qualification, institution,
        experience_years, cv_url, why_join, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        jobId,
        jobTitle,
        position,
        photoUrl,
        fullName,
        email,
        phone,
        currentAddress,
        highestQualification,
        institution,
        experienceYears,
        cvUrl,
        whyJoin,
      ]
    );

    // Dispatch asynchronous email notifications (Admin alert + Candidate acknowledgment)
    sendCareerNotification({
      id: result.insertId,
      job_id: jobId,
      job_title: jobTitle,
      position: position,
      photo_url: photoUrl,
      full_name: fullName,
      email: email,
      phone: phone,
      current_address: currentAddress,
      highest_qualification: highestQualification,
      institution: institution,
      experience_years: experienceYears,
      cv_url: cvUrl,
      why_join: whyJoin,
      created_at: new Date(),
    }).catch((mailErr) => {
      console.error('Non-blocking error dispatching career application emails:', mailErr);
    });

    return NextResponse.json({
      success: true,
      application_id: result.insertId,
      message: 'Your application has been successfully submitted to DOER Talent Acquisition.',
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please check your data and try again.', details: error.message },
      { status: 500 }
    );
  }
}
