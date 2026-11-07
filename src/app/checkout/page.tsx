'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Loader2,
  ShieldCheck,
  MapPin,
  User,
  Mail,
  Building2,
  FileText,
  Package,
} from 'lucide-react';

interface CheckoutProduct {
  id: number;
  name: string;
  slug: string;
  category_name?: string;
  price: number | null;
  is_call_for_price: boolean;
  main_image: string;
  short_description: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product') || '';
  const initialQty = Math.max(1, parseInt(searchParams.get('qty') || '1', 10) || 1);

  const [product, setProduct] = useState<CheckoutProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(Boolean(productSlug));
  const [quantity, setQuantity] = useState<number>(initialQty);

  // Checkout Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (!productSlug) {
      setLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await fetch(`/api/products/${encodeURIComponent(productSlug)}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        }
      } catch (err) {
        console.error('Error loading checkout product:', err);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product?.id || null,
          product_name: product?.name || 'Custom Product Order',
          product_slug: product?.slug || '',
          product_image: product?.main_image || '',
          product_price:
            product && !product.is_call_for_price && product.price
              ? product.price
              : null,
          quantity,
          customer_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          company_name: companyName.trim(),
          delivery_address: address.trim(),
          notes: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setPlacedOrder(data.order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    const productLink =
      typeof window !== 'undefined' && placedOrder.product_slug
        ? `${window.location.origin}/products/${placedOrder.product_slug}`
        : '';
    const waText = `Hello, I placed Order #${placedOrder.order_number} for ${placedOrder.product_name} (Qty: ${placedOrder.quantity}).${
      productLink ? `\nProduct Link: ${productLink}` : ''
    }`;

    return (
      <div className="min-h-screen bg-slate-50 pt-24 sm:pt-36 pb-16 sm:pb-20 px-3.5 sm:px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-xl text-center space-y-5 sm:space-y-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF3D00] font-mono text-xs font-bold">
              Order Ref: {placedOrder.order_number}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 pt-1">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-base text-slate-600 max-w-lg mx-auto">
              Thank you, <strong>{placedOrder.customer_name}</strong>. Your order for{' '}
              <strong>{placedOrder.product_name}</strong> has been received by our administration team.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-left space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex justify-between gap-2 py-1 border-b border-slate-200/80">
              <span className="text-slate-500 shrink-0">Product:</span>
              <span className="font-bold text-slate-900 text-right">
                {placedOrder.product_name} (×{placedOrder.quantity})
              </span>
            </div>
            <div className="flex justify-between gap-2 py-1 border-b border-slate-200/80">
              <span className="text-slate-500 shrink-0">Total Amount:</span>
              <span className="font-bold text-slate-900 text-right">
                {placedOrder.product_price && Number(placedOrder.product_price) > 0
                  ? `৳ ${(Number(placedOrder.product_price) * placedOrder.quantity).toLocaleString()}`
                  : 'Custom Quote / Call for Price'}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-1 border-b border-slate-200/80">
              <span className="text-slate-500 shrink-0">Phone:</span>
              <span className="font-semibold text-slate-900 text-right">{placedOrder.phone}</span>
            </div>
            <div className="flex justify-between gap-2 py-1">
              <span className="text-slate-500 shrink-0">Delivery Address:</span>
              <span className="font-semibold text-slate-900 text-right max-w-xs">
                {placedOrder.delivery_address}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1">
            <a
              href={`https://wa.me/8801976535654?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              <Image
                src="/whatsapp.png"
                alt="WhatsApp"
                width={16}
                height={16}
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>Confirm on WhatsApp</span>
            </a>

            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Browsing Shop</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasPrice =
    product &&
    !product.is_call_for_price &&
    product.price !== null &&
    Number(product.price) > 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Top App Back Bar */}
        <div className="mb-4 sm:mb-6 pt-2 sm:pt-0">
          <Link
            href={product ? `/products/${product.slug}` : '/products'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-0 sm:py-0 rounded-lg bg-white sm:bg-transparent border border-slate-200 sm:border-0 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#FF3D00] transition-colors shadow-2xs sm:shadow-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate max-w-[240px] sm:max-w-none">
              {product ? `Back to ${product.name}` : 'Back to Shop'}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-start">
          {/* LEFT 7 COLS ON DESKTOP (ORDER 2 ON MOBILE): SIMPLE CHECKOUT FORM */}
          <div className="order-2 lg:order-1 lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 lg:p-10 shadow-xs">
            <div className="border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF3D00]">
                Direct Order Placement
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
                Complete Your Order
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your contact and delivery details below. No online payment required—our team will confirm your order directly.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF3D00] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF3D00] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF3D00] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company Name (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your Company / Organization"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF3D00] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Delivery / Installation Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <textarea
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, building/floor, area, city..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF3D00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Message / Special Instructions (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Custom dimensions, color preferences, delivery schedule, or any special notes..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:border-[#FF3D00] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#FF3D00]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT 5 COLS ON DESKTOP (ORDER 1 ON MOBILE): PRODUCT ORDER SUMMARY */}
          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 sm:pb-4">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Order Summary
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF3D00]/15 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
                  Direct Order
                </span>
              </div>

              {loadingProduct ? (
                <div className="py-10 flex items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF3D00]" />
                  <span className="text-xs">Loading selected product...</span>
                </div>
              ) : product ? (
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00]">
                        {product.category_name || 'DOER Product'}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug mt-0.5 line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between py-2.5 sm:py-3 border-y border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Quantity
                    </span>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-[#FF3D00] active:scale-90 text-white font-bold text-sm transition-all"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-[#FF3D00] active:scale-90 text-white font-bold text-sm transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Calculation */}
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Unit Price:</span>
                      <span className="font-semibold text-white">
                        {hasPrice
                          ? `৳ ${Number(product.price).toLocaleString()}`
                          : 'Call for Price / Custom Quote'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-slate-800">
                      <span>Total:</span>
                      <span className="text-[#FF3D00]">
                        {hasPrice
                          ? `৳ ${(Number(product.price) * quantity).toLocaleString()}`
                          : 'To Be Quoted'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center text-slate-400 space-y-2">
                  <Package className="w-8 h-8 text-[#FF3D00] mx-auto" />
                  <p className="text-sm font-semibold text-white">Direct Custom Product Order</p>
                  <p className="text-xs">
                    Specify your product requirements in the message box.
                  </p>
                </div>
              )}

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-[#FF3D00] shrink-0" />
                  <span>Direct Factory Fulfillment</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
                  No online prepayment required. Once your order is placed, our team will contact you to confirm delivery and installation details.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Need immediate help?</span>
                <a
                  href="tel:+8801976535654"
                  className="font-bold text-[#FF3D00] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+8801976535654</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
