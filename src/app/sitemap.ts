import { MetadataRoute } from 'next';
import pool from '@/lib/db';
import { ensureSeoTables } from '@/lib/seo-db';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://doerbd.com';
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    await ensureEcommerceTables();
    await ensureSeoTables();

    // 1. Fetch configured static and landing pages from seo_pages
    const [pages]: any = await pool.execute(
      'SELECT page_path, sitemap_changefreq, sitemap_priority, updated_at FROM seo_pages WHERE robots_index = 1 ORDER BY sitemap_priority DESC'
    );

    if (Array.isArray(pages) && pages.length > 0) {
      for (const p of pages) {
        const path = p.page_path.startsWith('/') ? p.page_path : `/${p.page_path}`;
        sitemapEntries.push({
          url: `${baseUrl}${path}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: (p.sitemap_changefreq as any) || 'weekly',
          priority: Number(p.sitemap_priority) || 0.8,
        });
      }
    } else {
      // Fallback static pages if table was empty
      const staticRoutes = [
        { path: '', priority: 1.0, freq: 'daily' },
        { path: '/products', priority: 0.9, freq: 'daily' },
        { path: '/services', priority: 0.85, freq: 'weekly' },
        { path: '/workshop', priority: 0.85, freq: 'weekly' },
        { path: '/projects', priority: 0.8, freq: 'weekly' },
        { path: '/about', priority: 0.7, freq: 'monthly' },
        { path: '/contact', priority: 0.7, freq: 'monthly' },
        { path: '/career', priority: 0.6, freq: 'monthly' },
      ];
      for (const r of staticRoutes) {
        sitemapEntries.push({
          url: `${baseUrl}${r.path}`,
          lastModified: new Date(),
          changeFrequency: r.freq as any,
          priority: r.priority,
        });
      }
    }

    // 2. Fetch all active product categories
    const [categories]: any = await pool.execute(
      'SELECT slug, updated_at FROM product_categories WHERE is_active = 1 ORDER BY display_order ASC'
    );

    if (Array.isArray(categories)) {
      for (const cat of categories) {
        sitemapEntries.push({
          url: `${baseUrl}/products?category=${cat.slug}`,
          lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.85,
        });
      }
    }

    // 3. Fetch all published products (Console Tables, Workstations, etc.)
    const [products]: any = await pool.execute(
      "SELECT slug, main_image, updated_at FROM products WHERE status = 'published' ORDER BY updated_at DESC"
    );

    if (Array.isArray(products)) {
      for (const prod of products) {
        const prodImg = prod.main_image
          ? prod.main_image.startsWith('http')
            ? prod.main_image
            : `${baseUrl}${prod.main_image.startsWith('/') ? prod.main_image : `/${prod.main_image}`}`
          : undefined;

        sitemapEntries.push({
          url: `${baseUrl}/products/${prod.slug}`,
          lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
          ...(prodImg ? { images: [prodImg] } : {}),
        });
      }
    }

    // 4. Fetch active career jobs (if table exists)
    try {
      const [jobs]: any = await pool.execute(
        'SELECT slug, updated_at FROM career_jobs WHERE is_active = 1'
      );
      if (Array.isArray(jobs)) {
        for (const job of jobs) {
          sitemapEntries.push({
            url: `${baseUrl}/career/${job.slug}`,
            lastModified: job.updated_at ? new Date(job.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    } catch {
      // Career jobs table might not exist yet
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return minimal fallback so Google never encounters 500 error
    sitemapEntries.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  return sitemapEntries;
}

