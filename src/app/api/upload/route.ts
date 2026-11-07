import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
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

      const ext = (path.extname(file.name) || (isVideo ? '.mp4' : '.jpg')).toLowerCase();
      const baseName = path
        .basename(file.name, path.extname(file.name))
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 40);

      const uniqueName = `${baseName || 'media'}-${Date.now()}-${Math.round(
        Math.random() * 10000
      )}${ext}`;

      // Save to public/uploads/<subDir> (with automatic fallback to <root>/uploads/<subDir> if needed)
      const primaryDir = path.join(process.cwd(), 'public', 'uploads', subDir);
      const fallbackDir = path.join(process.cwd(), 'uploads', subDir);

      try {
        await mkdir(primaryDir, { recursive: true, mode: 0o775 });
        await writeFile(path.join(primaryDir, uniqueName), buffer, { mode: 0o644 });
      } catch {
        await mkdir(fallbackDir, { recursive: true, mode: 0o775 });
        await writeFile(path.join(fallbackDir, uniqueName), buffer, { mode: 0o644 });
      }

      // Return dynamic API route URL so Next.js production (`next start`) serves runtime uploads immediately
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

