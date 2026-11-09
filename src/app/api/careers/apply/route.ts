import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureCareerTables } from '@/lib/career-db';
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

export async function POST(request: Request) {
  try {
    await ensureCareerTables();

    const formData = await request.formData();

    const jobId = Number(formData.get('job_id'));
    const jobTitle = String(formData.get('job_title') || '').trim();
    const position = String(formData.get('position') || jobTitle).trim();
    const fullName = String(formData.get('full_name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const currentAddress = String(formData.get('current_address') || '').trim();
    const highestQualification = String(formData.get('highest_qualification') || '').trim();
    const institution = String(formData.get('institution') || '').trim();
    const experienceYears = String(formData.get('experience_years') || '').trim();
    const whyJoin = String(formData.get('why_join') || '').trim();
    const agreed = formData.get('agreed') === 'true' || formData.get('agreed') === '1' || formData.get('agreed') === 'on';

    const photoFile = formData.get('photo') as File | null;
    const cvFile = formData.get('cv') as File | null;

    // Validation
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

    if (!photoFile || typeof photoFile.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Candidate photo is required.' }, { status: 400 });
    }
    if (photoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Candidate photo must not exceed 5MB.' }, { status: 400 });
    }

    if (!cvFile || typeof cvFile.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'CV document upload is required.' }, { status: 400 });
    }
    if (cvFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'CV document must not exceed 5MB.' }, { status: 400 });
    }

    // Save Photo
    const photoName = sanitizeFileName(photoFile.name || 'photo.jpg', 'photo');
    const photoDir = path.join(process.cwd(), 'public', 'uploads', 'careers', 'photos');
    await mkdir(photoDir, { recursive: true, mode: 0o775 });
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    await writeFile(path.join(photoDir, photoName), photoBuffer);
    const photoUrl = `/uploads/careers/photos/${photoName}`;

    // Save CV
    const cvName = sanitizeFileName(cvFile.name || 'resume.pdf', 'cv');
    const cvDir = path.join(process.cwd(), 'public', 'uploads', 'careers', 'cvs');
    await mkdir(cvDir, { recursive: true, mode: 0o775 });
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    await writeFile(path.join(cvDir, cvName), cvBuffer);
    const cvUrl = `/uploads/careers/cvs/${cvName}`;

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

    return NextResponse.json({
      success: true,
      application_id: result.insertId,
      message: 'Your application has been successfully submitted to DOER Talent Acquisition.',
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.', details: error.message },
      { status: 500 }
    );
  }
}

