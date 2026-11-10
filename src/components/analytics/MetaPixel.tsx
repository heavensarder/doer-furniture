'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, trackContact, trackAddToCart } from '@/lib/fpixel';

interface MetaPixelProps {
  initialPixelId?: string;
}

function PixelRouteListener({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;
    // Track PageView on route changes
    pageview();
  }, [pathname, searchParams, pixelId]);

  useEffect(() => {
    if (!pixelId) return;

    // Global click listener to automatically capture all WhatsApp, Phone & Email clicks
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      const href = anchor.href.toLowerCase();

      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        trackContact({
          channel: 'WhatsApp',
          content_name: anchor.innerText?.trim() || anchor.title || 'WhatsApp Click',
          target: anchor.href,
        });
      } else if (href.startsWith('tel:')) {
        trackContact({
          channel: 'Phone',
          content_name: anchor.innerText?.trim() || 'Direct Phone Call',
          target: anchor.href,
        });
      } else if (href.startsWith('mailto:')) {
        trackContact({
          channel: 'Email',
          content_name: anchor.innerText?.trim() || 'Direct Email Click',
          target: anchor.href,
        });
      } else if (href.includes('/checkout?product=')) {
        try {
          const urlObj = new URL(anchor.href, window.location.origin);
          const prod = urlObj.searchParams.get('product') || '';
          trackAddToCart({
            content_name: prod ? `Product: ${prod}` : 'Checkout Started',
          });
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [pixelId]);

  return null;
}

export default function MetaPixel({ initialPixelId }: MetaPixelProps) {
  const [pixelId, setPixelId] = useState<string>(initialPixelId || '');

  useEffect(() => {
    if (!initialPixelId) {
      // If not passed through SSR, fetch dynamically from public config API
      fetch('/api/seo/pixel')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.pixelId) {
            setPixelId(data.pixelId.trim());
          }
        })
        .catch(() => {});
    }
  }, [initialPixelId]);

  // Clean pixel id in case full snippet was pasted by accident
  const cleanPixelId = pixelId
    ? pixelId.replace(/[^0-9]/g, '') || pixelId.trim()
    : '';

  if (!cleanPixelId) {
    return null;
  }

  return (
    <>
      {/* Meta Pixel Base Code */}
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${cleanPixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${cleanPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <Suspense fallback={null}>
        <PixelRouteListener pixelId={cleanPixelId} />
      </Suspense>
    </>
  );
}
