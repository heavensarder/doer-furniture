import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const segments = resolvedParams.path || [];

    if (segments.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Prevent directory traversal
    const safeSegments = segments.map((seg) => path.basename(seg));

    // Check both `public/uploads/...` and `uploads/...` on the VPS
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', ...safeSegments),
      path.join(process.cwd(), 'uploads', ...safeSegments),
    ];

    let foundPath: string | null = null;
    for (const candidate of candidatePaths) {
      try {
        const fileStat = await stat(candidate);
        if (fileStat.isFile()) {
          foundPath = candidate;
          break;
        }
      } catch {
        // File not in this candidate location
      }
    }

    if (!foundPath) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const fileBuffer = await readFile(foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

