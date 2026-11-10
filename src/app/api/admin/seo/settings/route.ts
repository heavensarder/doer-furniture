import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureSeoTables } from '@/lib/seo-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureSeoTables();

    const [rows]: any = await pool.execute('SELECT * FROM seo_settings LIMIT 1');
    return NextResponse.json({
      success: true,
      settings: rows && rows[0] ? rows[0] : null,
    });
  } catch (error: any) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureSeoTables();
    const body = await request.json();

    const siteName = String(body.site_name || 'DOER').trim();
    const titleTemplate = String(body.title_template || '%s | DOER – Console Tables & Control Room Interior').trim();
    const defaultMetaTitle = String(body.default_meta_title || '').trim();
    const defaultMetaDescription = String(body.default_meta_description || '').trim();
    const defaultKeywords = String(body.default_keywords || '').trim();
    const canonicalBaseUrl = String(body.canonical_base_url || 'http://doerbd.com').trim().replace(/\/$/, '');
    const defaultOgImage = String(body.default_og_image || '/images/introduction-image.png').trim();
    const twitterCardType = String(body.twitter_card_type || 'summary_large_image').trim();
    const twitterHandle = String(body.twitter_handle || '@doerbd').trim();

    let googleSiteVerification = String(body.google_site_verification || '').trim();
    const googleSnippetMatch = googleSiteVerification.match(/content=["']([^"']+)["']/i);
    if (googleSnippetMatch && googleSnippetMatch[1]) {
      googleSiteVerification = googleSnippetMatch[1];
    }

    let bingSiteVerification = String(body.bing_site_verification || '').trim();
    const bingSnippetMatch = bingSiteVerification.match(/content=["']([^"']+)["']/i);
    if (bingSnippetMatch && bingSnippetMatch[1]) {
      bingSiteVerification = bingSnippetMatch[1];
    }

    let facebookPixelId = String(body.facebook_pixel_id || '').trim();
    const pixelSnippetMatch = facebookPixelId.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/i);
    if (pixelSnippetMatch && pixelSnippetMatch[1]) {
      facebookPixelId = pixelSnippetMatch[1];
    }
    const robotsDefaultIndex = body.robots_default_index !== undefined ? (body.robots_default_index ? 1 : 0) : 1;
    const robotsDefaultFollow = body.robots_default_follow !== undefined ? (body.robots_default_follow ? 1 : 0) : 1;
    const robotsCustomDirectives = String(body.robots_custom_directives || '').trim();

    await pool.execute(
      `UPDATE seo_settings SET
        site_name = ?,
        title_template = ?,
        default_meta_title = ?,
        default_meta_description = ?,
        default_keywords = ?,
        canonical_base_url = ?,
        default_og_image = ?,
        twitter_card_type = ?,
        twitter_handle = ?,
        google_site_verification = ?,
        bing_site_verification = ?,
        facebook_pixel_id = ?,
        robots_default_index = ?,
        robots_default_follow = ?,
        robots_custom_directives = ?
      WHERE id = 1`,
      [
        siteName,
        titleTemplate,
        defaultMetaTitle,
        defaultMetaDescription,
        defaultKeywords,
        canonicalBaseUrl,
        defaultOgImage,
        twitterCardType,
        twitterHandle,
        googleSiteVerification,
        bingSiteVerification,
        facebookPixelId,
        robotsDefaultIndex,
        robotsDefaultFollow,
        robotsCustomDirectives,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Global SEO settings updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

