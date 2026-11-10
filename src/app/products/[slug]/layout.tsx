import type { Metadata } from 'next';
import pool from '@/lib/db';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';
import { ensureSeoTables } from '@/lib/seo-db';
import JsonLd, { getProductSchema, getBreadcrumbSchema } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const baseUrl = 'http://doerbd.com';
  const slug = params?.slug;

  try {
    await ensureEcommerceTables();
    await ensureSeoTables();

    const [rows]: any = await pool.execute(
      `SELECT 
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.price,
        p.main_image,
        p.meta_title,
        p.meta_description,
        p.focus_keywords,
        p.canonical_url,
        p.og_image,
        p.robots_index,
        c.name AS category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE p.slug = ?
      LIMIT 1`,
      [slug]
    );

    if (rows && rows.length > 0) {
      const prod = rows[0];
      const cleanDesc = (prod.short_description || prod.description || '')
        .replace(/<[^>]*>?/gm, '')
        .trim();

      const title = prod.meta_title || `${prod.name} | DOER Console Tables`;
      const description =
        prod.meta_description ||
        cleanDesc ||
        `Order ${prod.name} from DOER. 24/7 ergonomic command console tables and modular control room workstations manufactured in Dhaka.`;

      const keywords =
        prod.focus_keywords ||
        `${prod.name}, console table, control room console, command workstation, 24/7 operator desk`;

      const canonical = prod.canonical_url || `${baseUrl}/products/${prod.slug}`;

      // User comment requirement: Product OG image automatically uses main_image
      const ogImg = prod.og_image || prod.main_image || '/images/introduction-image.png';
      const fullOgImg = ogImg.startsWith('http')
        ? ogImg
        : `${baseUrl}${ogImg.startsWith('/') ? ogImg : `/${ogImg}`}`;

      const isIndexable = prod.robots_index !== 0;

      return {
        title,
        description,
        keywords,
        alternates: {
          canonical,
        },
        robots: {
          index: isIndexable,
          follow: isIndexable,
          googleBot: {
            index: isIndexable,
            follow: isIndexable,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: 'DOER – Console Tables & Control Room Interior',
          locale: 'en_US',
          type: 'website',
          images: [
            {
              url: fullOgImg,
              secureUrl: fullOgImg,
              width: 1200,
              height: 630,
              alt: prod.name,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [fullOgImg],
        },
      };
    }
  } catch (err) {
    console.error('Error generating product metadata:', err);
  }

  return {
    title: 'Console Table Details | DOER Control Room Consoles',
    description: 'Precision-engineered console tables and mission-critical command workstations by DOER.',
  };
}

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const baseUrl = 'http://doerbd.com';
  let productData: any = null;

  try {
    await ensureEcommerceTables();
    await ensureSeoTables();

    const [rows]: any = await pool.execute(
      `SELECT 
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.price,
        p.main_image,
        p.gallery_images,
        p.sku,
        p.mpn,
        p.schema_rating_value,
        p.schema_review_count,
        c.name AS category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE p.slug = ?
      LIMIT 1`,
      [params?.slug]
    );

    if (rows && rows.length > 0) {
      productData = rows[0];
      if (typeof productData.gallery_images === 'string') {
        try {
          productData.gallery_images = JSON.parse(productData.gallery_images);
        } catch {
          productData.gallery_images = [];
        }
      }
    }
  } catch (err) {
    console.error('Error fetching product schema data:', err);
  }

  const productSchema = productData ? getProductSchema(productData, baseUrl) : null;
  const breadcrumbSchema = productData
    ? getBreadcrumbSchema(
        [
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          ...(productData.category_name
            ? [{ name: productData.category_name, url: `/products` }]
            : []),
          { name: productData.name, url: `/products/${productData.slug}` },
        ],
        baseUrl
      )
    : null;

  return (
    <>
      {productSchema && <JsonLd data={productSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      {children}
    </>
  );
}

