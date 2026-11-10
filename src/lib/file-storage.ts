import { unlink, stat } from 'fs/promises';
import path from 'path';

/**
 * Normalizes a file path or URL and deletes the file from local disk
 * if it is located inside the application's uploads directory.
 *
 * Supported formats:
 * - "/api/uploads/products/image-123.jpg"
 * - "/uploads/products/image-123.jpg"
 * - "uploads/careers/cvs/cv-123.pdf"
 * - "http://localhost:3000/api/uploads/..." or "https://doerbd.com/api/uploads/..."
 *
 * Protects against:
 * - Directory traversal ("../")
 * - Deleting static assets outside of uploads (e.g. "/images/...", "/public/favicon.ico")
 * - Crashing when files do not exist or are external URLs
 */
export async function deleteUploadedFile(fileUrlOrPath: string | null | undefined): Promise<boolean> {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') {
    return false;
  }

  const trimmed = fileUrlOrPath.trim();
  if (!trimmed) return false;

  try {
    // If it's a full URL, strip protocol and host
    let pathname = trimmed;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const parsed = new URL(trimmed);
        pathname = parsed.pathname;
      } catch {
        // invalid URL format, ignore
        return false;
      }
    }

    // Only allow files originating from uploads directory
    // Matches /api/uploads/..., /uploads/..., uploads/...
    const uploadsMatch = pathname.match(/(?:\/api)?\/uploads\/(.+)$/i);
    if (!uploadsMatch || !uploadsMatch[1]) {
      return false;
    }

    const relativeSubPath = uploadsMatch[1].replace(/\\/g, '/');

    // Prevent directory traversal
    if (relativeSubPath.includes('..')) {
      console.warn(`[FileStorage] Blocked attempted directory traversal: ${relativeSubPath}`);
      return false;
    }

    // Candidate locations: public/uploads/... and root uploads/...
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', relativeSubPath),
      path.join(process.cwd(), 'uploads', relativeSubPath),
    ];

    let deleted = false;
    for (const filePath of candidatePaths) {
      try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          await unlink(filePath);
          console.log(`[FileStorage] Deleted file from disk: ${filePath}`);
          deleted = true;
        }
      } catch {
        // File does not exist at this candidate path; continue
      }
    }

    return deleted;
  } catch (err: any) {
    console.error(`[FileStorage] Error deleting file "${fileUrlOrPath}":`, err.message || err);
    return false;
  }
}

/**
 * Deletes multiple files safely from disk.
 * Handles arrays, JSON strings (e.g. gallery_images), comma-separated strings, or mixed inputs.
 */
export async function deleteUploadedFiles(files: any): Promise<number> {
  if (!files) return 0;

  let fileList: string[] = [];

  if (Array.isArray(files)) {
    fileList = files;
  } else if (typeof files === 'string') {
    const trimmed = files.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          fileList = parsed;
        }
      } catch {
        fileList = [trimmed];
      }
    } else if (trimmed.includes(',')) {
      fileList = trimmed.split(',').map((s) => s.trim());
    } else {
      fileList = [trimmed];
    }
  }

  let deletedCount = 0;
  for (const f of fileList) {
    if (typeof f === 'string' && f.trim()) {
      const ok = await deleteUploadedFile(f);
      if (ok) deletedCount++;
    }
  }

  return deletedCount;
}
