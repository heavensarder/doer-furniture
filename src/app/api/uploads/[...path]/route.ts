import { NextResponse } from 'next/server';
import { readFile, stat, open } from 'fs/promises';
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
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
};

export async function GET(
  request: Request,
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
    let fileSize = 0;

    for (const candidate of candidatePaths) {
      try {
        const fileStat = await stat(candidate);
        if (fileStat.isFile()) {
          foundPath = candidate;
          fileSize = fileStat.size;
          break;
        }
      } catch {
        // File not in this candidate location
      }
    }

    if (!foundPath) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const rangeHeader = request.headers.get('range');

    // Support HTTP Range requests (206 Partial Content) required for <video> playback & seeking on mobile/desktop
    if (rangeHeader && fileSize > 0) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (!isNaN(start) && !isNaN(end) && start >= 0 && end < fileSize && start <= end) {
        const chunkSize = end - start + 1;
        const fileHandle = await open(foundPath, 'r');
        try {
          const buffer = Buffer.alloc(chunkSize);
          await fileHandle.read(buffer, 0, chunkSize, start);

          return new NextResponse(buffer, {
            status: 206,
            headers: {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': String(chunkSize),
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        } finally {
          await fileHandle.close();
        }
      }
    }

    const fileBuffer = await readFile(foundPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileBuffer.length),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
