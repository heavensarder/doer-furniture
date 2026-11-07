'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ClipboardList,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Package,
} from 'lucide-react';

interface OrderItem {
  id: number;
  order_number: string;
  product_id: number | null;
  product_name: string;
  product_slug: string | null;
  product_image: string | null;
  product_price: number | null;
  quantity: number;
  customer_name: string;
  phone: string;
  email: string;
  company_name: string | null;
  delivery_address: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'confirmed', label: 'Confirmed', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'processing', label: 'Processing', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'completed', label: 'Completed', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', badge: 'bg-red-50 text-red-700 border-red-200' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (order: OrderItem) => {
    if (!window.confirm(`Delete order ${order.order_number} from ${order.customer_name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      o.order_number.toLowerCase().includes(term) ||
      o.customer_name.toLowerCase().includes(term) ||
      o.phone.toLowerCase().includes(term) ||
      o.email.toLowerCase().includes(term) ||
      (o.company_name || '').toLowerCase().includes(term) ||
      o.product_name.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (st: string) => {
    return (
      STATUS_OPTIONS.find((s) => s.value === st)?.badge ||
      'bg-slate-100 text-slate-700 border-slate-200'
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#FF3D00] text-xs font-bold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" />
            <span>eCommerce • Direct Customer Orders</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View and manage all orders and queries submitted through the direct product checkout form.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="px-3.5 sm:px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-2 shadow-2xs">
            <Clock className="w-4 h-4 text-[#FF3D00] shrink-0" />
            <span>
              Pending: <strong className="text-slate-900">{orders.filter((o) => o.status === 'pending').length}</strong>
            </span>
          </div>
          <div className="px-3.5 sm:px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Total: <strong className="text-slate-900">{orders.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 sm:gap-4 bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone, Email, Company, or Product..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-[#FF3D00]"
          />
        </div>

        {/* Mobile Status Filter Dropdown */}
        <div className="sm:hidden">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-[#FF3D00]"
          >
            <option value="all">Status: All Orders ({orders.length})</option>
            {STATUS_OPTIONS.map((st) => {
              const count = orders.filter((o) => o.status === st.value).length;
              return (
                <option key={st.value} value={st.value}>
                  Status: {st.label} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Tablet/Desktop Status Filter Pills */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#FF3D00] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map((st) => {
            const count = orders.filter((o) => o.status === st.value).length;
            return (
              <button
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st.value
                    ? 'bg-[#FF3D00] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00]" />
          <span className="text-sm font-medium">Loading customer orders...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-slate-300 rounded-2xl space-y-3">
          <ClipboardList className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-base font-bold text-slate-800">No orders found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Orders placed via the product checkout form will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs transition-all"
            >
              {/* Top Row: Order Number, Date, Status Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-[#FF3D00]/10 border border-[#FF3D00]/25 font-mono text-xs font-bold text-[#FF3D00]">
                    {order.order_number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="text-xs text-slate-500 font-semibold">Status:</label>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-[#FF3D00]"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(order)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body Grid: Ordered Product + Customer Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
                {/* Ordered Product Card */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                    {order.product_image ? (
                      <Image
                        src={order.product_image}
                        alt={order.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00]">
                      Ordered Item (Qty: {order.quantity})
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {order.product_name}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-slate-700">
                        {order.product_price && Number(order.product_price) > 0
                          ? `৳ ${(Number(order.product_price) * order.quantity).toLocaleString()}`
                          : 'Price on Request / Custom Quote'}
                      </span>
                      {order.product_slug && (
                        <Link
                          href={`/products/${order.product_slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF3D00] hover:underline"
                        >
                          <span>Product</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Details & Delivery Address */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Customer Details
                    </p>
                    <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                    {order.company_name && (
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                        <span>{order.company_name}</span>
                      </p>
                    )}
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                      <a href={`tel:${order.phone}`} className="hover:text-[#FF3D00] font-semibold">
                        {order.phone}
                      </a>
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                      <a href={`mailto:${order.email}`} className="hover:text-[#FF3D00]">
                        {order.email}
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Delivery / Site Address
                    </p>
                    <p className="text-slate-700 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3D00] shrink-0 mt-0.5" />
                      <span>{order.delivery_address}</span>
                    </p>
                    {order.notes && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF3D00] shrink-0 mt-0.5" />
                        <span>{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
