import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { writeFile, appendFile, mkdir } from 'fs/promises';
import path from 'path';

function sanitizeFileName(rawName: string, isVideo: boolean): string {
  const ext = (path.extname(rawName) || (isVideo ? '.mp4' : '.jpg')).toLowerCase();
  const baseName = path
    .basename(rawName, path.extname(rawName))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  return `${baseName || 'media'}-${Date.now()}-${Math.round(Math.random() * 10000)}${ext}`;
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    // 1. Check if this is a chunked upload (bypasses Nginx 1MB client_max_body_size limit)
    const chunkBlob = formData.get('chunk') as File | null;
    if (chunkBlob && typeof chunkBlob.arrayBuffer === 'function') {
      const origName = String(formData.get('fileName') || 'upload.jpg');
      const mimeType = String(formData.get('mimeType') || '');
      const chunkIndex = parseInt(String(formData.get('chunkIndex') || '0'), 10);
      const existingTargetName = String(formData.get('targetName') || '');

      const isVideo = mimeType.startsWith('video/') || /\.(mp4|webm|ogg)$/i.test(origName);
      const subDir = isVideo ? 'videos' : 'products';

      const targetName =
        chunkIndex === 0 || !existingTargetName
          ? sanitizeFileName(origName, isVideo)
          : path.basename(existingTargetName);

      const bytes = await chunkBlob.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const primaryDir = path.join(process.cwd(), 'public', 'uploads', subDir);
      const fallbackDir = path.join(process.cwd(), 'uploads', subDir);

      try {
        await mkdir(primaryDir, { recursive: true, mode: 0o775 });
        const targetPath = path.join(primaryDir, targetName);
        if (chunkIndex === 0) {
          await writeFile(targetPath, buffer, { mode: 0o644 });
        } else {
          await appendFile(targetPath, buffer);
        }
      } catch {
        await mkdir(fallbackDir, { recursive: true, mode: 0o775 });
        const targetPath = path.join(fallbackDir, targetName);
        if (chunkIndex === 0) {
          await writeFile(targetPath, buffer, { mode: 0o644 });
        } else {
          await appendFile(targetPath, buffer);
        }
      }

      const finalUrl = `/api/uploads/${subDir}/${targetName}`;
      return NextResponse.json({
        targetName,
        url: finalUrl,
        urls: [finalUrl],
      });
    }

    // 2. Standard single / multi-file upload
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles: File[] = [];
    if (singleFile && typeof singleFile.arrayBuffer === 'function') {
      allFiles.push(singleFile);
    }
    for (const f of files) {
      if (f && typeof f.arrayBuffer === 'function') {
        allFiles.push(f);
      }
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const isVideo = file.type.startsWith('video/');
      const subDir = isVideo ? 'videos' : 'products';
      const uniqueName = sanitizeFileName(file.name, isVideo);

      const primaryDir = path.join(process.cwd(), 'public', 'uploads', subDir);
      const fallbackDir = path.join(process.cwd(), 'uploads', subDir);

      try {
        await mkdir(primaryDir, { recursive: true, mode: 0o775 });
        await writeFile(path.join(primaryDir, uniqueName), buffer, { mode: 0o644 });
      } catch {
        await mkdir(fallbackDir, { recursive: true, mode: 0o775 });
        await writeFile(path.join(fallbackDir, uniqueName), buffer, { mode: 0o644 });
      }

      uploadedUrls.push(`/api/uploads/${subDir}/${uniqueName}`);
    }

    return NextResponse.json({
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
