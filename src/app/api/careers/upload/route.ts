import { NextResponse } from 'next/server';
import { writeFile, appendFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_PHOTO_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const ALLOWED_CV_EXTS = new Set(['.pdf', '.doc', '.docx', '.txt']);

function sanitizeFileName(rawName: string, prefix: string): string {
  const ext = (path.extname(rawName) || '').toLowerCase();
  const baseName = path
    .basename(rawName, path.extname(rawName))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 35);

  return `${prefix}-${baseName || 'file'}-${Date.now()}-${Math.round(Math.random() * 10000)}${ext}`;
}

async function writeToDisk(
  category: 'photos' | 'cvs',
  fileName: string,
  buffer: Buffer,
  isAppend: boolean
) {
  const primaryDir = path.join(process.cwd(), 'public', 'uploads', 'careers', category);
  const fallbackDir = path.join(process.cwd(), 'uploads', 'careers', category);

  try {
    await mkdir(primaryDir, { recursive: true, mode: 0o775 });
    const targetPath = path.join(primaryDir, fileName);
    if (isAppend) {
      await appendFile(targetPath, buffer);
    } else {
      await writeFile(targetPath, buffer, { mode: 0o644 });
    }
  } catch {
    await mkdir(fallbackDir, { recursive: true, mode: 0o775 });
    const targetPath = path.join(fallbackDir, fileName);
    if (isAppend) {
      await appendFile(targetPath, buffer);
    } else {
      await writeFile(targetPath, buffer, { mode: 0o644 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 1. Chunked upload (for bypassing Nginx 1MB client_max_body_size)
    const chunkBlob = formData.get('chunk') as File | null;
    if (chunkBlob && typeof chunkBlob.arrayBuffer === 'function') {
      const origName = String(formData.get('fileName') || 'file');
      const category = (formData.get('category') === 'cvs' ? 'cvs' : 'photos') as 'photos' | 'cvs';
      const chunkIndex = parseInt(String(formData.get('chunkIndex') || '0'), 10);
      const existingTargetName = String(formData.get('targetName') || '').trim();
      const ext = path.extname(origName).toLowerCase();

      // Extension validation
      if (category === 'photos' && !ALLOWED_PHOTO_EXTS.has(ext)) {
        return NextResponse.json(
          { error: 'Invalid photo format. Please upload JPG, PNG, WEBP, or AVIF.' },
          { status: 400 }
        );
      }
      if (category === 'cvs' && !ALLOWED_CV_EXTS.has(ext)) {
        return NextResponse.json(
          { error: 'Invalid CV format. Please upload PDF, DOC, or DOCX.' },
          { status: 400 }
        );
      }

      const targetName =
        chunkIndex === 0 || !existingTargetName
          ? sanitizeFileName(origName, category === 'photos' ? 'photo' : 'cv')
          : path.basename(existingTargetName);

      const bytes = await chunkBlob.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeToDisk(category, targetName, buffer, chunkIndex > 0);

      const finalUrl = `/api/uploads/careers/${category}/${targetName}`;
      return NextResponse.json({
        success: true,
        targetName,
        url: finalUrl,
      });
    }

    // 2. Direct single file upload
    const singleFile = (formData.get('file') || formData.get('photo') || formData.get('cv')) as File | null;
    if (!singleFile || typeof singleFile.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (singleFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed 5MB limit.' },
        { status: 400 }
      );
    }

    const category = (formData.get('category') === 'cvs' ? 'cvs' : 'photos') as 'photos' | 'cvs';
    const ext = path.extname(singleFile.name || '').toLowerCase();

    if (category === 'photos' && !ALLOWED_PHOTO_EXTS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid photo format. Please upload JPG, PNG, WEBP, or AVIF.' },
        { status: 400 }
      );
    }
    if (category === 'cvs' && !ALLOWED_CV_EXTS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid CV format. Please upload PDF, DOC, or DOCX.' },
        { status: 400 }
      );
    }

    const targetName = sanitizeFileName(singleFile.name || 'file', category === 'photos' ? 'photo' : 'cv');
    const bytes = await singleFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeToDisk(category, targetName, buffer, false);

    const finalUrl = `/api/uploads/careers/${category}/${targetName}`;
    return NextResponse.json({
      success: true,
      targetName,
      url: finalUrl,
    });
  } catch (err: any) {
    console.error('Error in /api/careers/upload:', err);
    return NextResponse.json(
      { error: 'Upload failed on server.', details: err.message },
      { status: 500 }
    );
  }
}

