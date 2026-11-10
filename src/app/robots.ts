import { MetadataRoute } from 'next';
import pool from '@/lib/db';
import { ensureSeoTables } from '@/lib/seo-db';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = 'http://doerbd.com';
  let defaultIndex = true;
  let customDisallows = ['/admin', '/admin/', '/api', '/api/', '/checkout', '/checkout/'];

  try {
    await ensureSeoTables();
    const [rows]: any = await pool.execute('SELECT robots_default_index, robots_custom_directives FROM seo_settings LIMIT 1');
    if (rows && rows[0]) {
      defaultIndex = rows[0].robots_default_index !== 0;
      if (rows[0].robots_custom_directives) {
        const lines = String(rows[0].robots_custom_directives)
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        for (const line of lines) {
          if (line.toLowerCase().startsWith('disallow:')) {
            const rule = line.replace(/disallow:/i, '').trim();
            if (rule && !customDisallows.includes(rule)) {
              customDisallows.push(rule);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching robots settings:', err);
  }

  if (!defaultIndex) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: customDisallows,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: customDisallows,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: customDisallows,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

