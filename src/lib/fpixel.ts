/**
 * Meta (Facebook) Pixel Helper Library
 * Provides type-safe wrappers for standard & custom Meta Pixel events.
 * https://developers.facebook.com/docs/meta-pixel/reference
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Tracks standard PageView event.
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

/**
 * Tracks generic standard event.
 */
export const trackEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, options);
  }
};

/**
 * Tracks custom event.
 */
export const trackCustomEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, options);
  }
};

/**
 * Standard Event: ViewContent
 * Triggered when a user views a product, key service, or showcase page.
 */
export const trackViewContent = (params: {
  content_name: string;
  content_category?: string;
  content_ids?: string[] | number[];
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  trackEvent('ViewContent', {
    content_name: params.content_name,
    content_category: params.content_category || 'Console Tables & Furniture',
    content_ids: (params.content_ids || []).map(String),
    content_type: params.content_type || 'product',
    value: params.value ?? 0,
    currency: params.currency || 'BDT',
  });
};

/**
 * Standard Event: AddToCart
 * Triggered when a user clicks 'Order Now', 'Direct Checkout', or custom configure.
 */
export const trackAddToCart = (params: {
  content_name: string;
  content_ids?: string[] | number[];
  value?: number;
  currency?: string;
  quantity?: number;
}) => {
  trackEvent('AddToCart', {
    content_name: params.content_name,
    content_ids: (params.content_ids || []).map(String),
    content_type: 'product',
    value: params.value ?? 0,
    currency: params.currency || 'BDT',
    num_items: params.quantity || 1,
  });
};

/**
 * Standard Event: InitiateCheckout
 * Triggered when a user lands on the /checkout page with selected items.
 */
export const trackInitiateCheckout = (params: {
  content_name?: string;
  content_ids?: string[] | number[];
  num_items?: number;
  value?: number;
  currency?: string;
}) => {
  trackEvent('InitiateCheckout', {
    content_name: params.content_name || 'DOER Checkout',
    content_ids: (params.content_ids || []).map(String),
    content_type: 'product',
    num_items: params.num_items || 1,
    value: params.value ?? 0,
    currency: params.currency || 'BDT',
  });
};

/**
 * Standard Event: Purchase
 * Triggered when an order is successfully submitted.
 */
export const trackPurchase = (params: {
  order_id: string | number;
  content_name?: string;
  content_ids?: string[] | number[];
  num_items?: number;
  value: number;
  currency?: string;
}) => {
  trackEvent('Purchase', {
    order_id: String(params.order_id),
    content_name: params.content_name || 'DOER Order',
    content_ids: (params.content_ids || []).map(String),
    content_type: 'product',
    num_items: params.num_items || 1,
    value: params.value ?? 0,
    currency: params.currency || 'BDT',
  });
};

/**
 * Standard Event: Lead
 * Triggered when an inquiry form (contact form, workshop tour, or custom layout) is submitted.
 */
export const trackLead = (params: {
  content_name: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  trackEvent('Lead', {
    content_name: params.content_name,
    content_category: params.content_category || 'Customer Inquiry',
    value: params.value ?? 0,
    currency: params.currency || 'BDT',
  });
};

/**
 * Standard Event: Contact
 * Triggered when user clicks WhatsApp button, phone call link, or email link.
 */
export const trackContact = (params: {
  channel: 'WhatsApp' | 'Phone' | 'Email' | 'Chat';
  content_name?: string;
  target?: string;
}) => {
  trackEvent('Contact', {
    contact_channel: params.channel,
    content_name: params.content_name || 'DOER Direct Communication',
    target: params.target || '',
  });
};

/**
 * Standard Event: Search
 * Triggered when a user performs a search in the catalog.
 */
export const trackSearch = (searchQuery: string) => {
  if (!searchQuery.trim()) return;
  trackEvent('Search', {
    search_string: searchQuery.trim(),
  });
};

/**
 * Standard Event: CustomizeProduct
 * Triggered when a user requests custom dimensions / multi-screen layout.
 */
export const trackCustomizeProduct = (productOrFeature: string) => {
  trackEvent('CustomizeProduct', {
    feature: productOrFeature,
  });
};

