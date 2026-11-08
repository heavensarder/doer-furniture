'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCyberDialog } from '@/components/ui/CyberDialog';
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
  { value: 'pending', label: 'Pending', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  { value: 'confirmed', label: 'Confirmed', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { value: 'processing', label: 'Processing', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  { value: 'completed', label: 'Completed', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { value: 'cancelled', label: 'Cancelled', badge: 'bg-red-500/15 text-red-400 border-red-500/30' },
];

export default function AdminOrdersPage() {
  const dialog = useCyberDialog();
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
    const confirmed = await dialog.confirm({
      title: 'Delete Order Record',
      message: `Are you sure you want to permanently delete order ${order.order_number} for customer "${order.customer_name}"? This action cannot be undone.`,
      confirmText: 'Delete Order',
      cancelText: 'Cancel',
      type: 'danger',
      badge: 'ORDER RECORD DELETION',
    });

    if (!confirmed) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#FF3D00] text-xs font-bold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" />
            <span>eCommerce • Direct Customer Orders</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            View and manage all orders and queries submitted through the direct product checkout form.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#0B101D] border border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center sm:justify-start gap-2 shadow-lg cyber-corner">
            <Clock className="w-4 h-4 text-[#FF3D00] shrink-0" />
            <span>
              Pending: <strong className="text-white">{orders.filter((o) => o.status === 'pending').length}</strong>
            </span>
          </div>
          <div className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#0B101D] border border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center sm:justify-start gap-2 shadow-lg cyber-corner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Total: <strong className="text-white">{orders.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 sm:gap-4 bg-[#0B101D] border border-white/10 p-3.5 sm:p-4 rounded-2xl shadow-xl cyber-corner">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone, Email, Company, or Product..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E1526] border border-white/10 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-[#121B30] focus:ring-1 focus:ring-[#FF3D00] focus:border-[#FF3D00]"
          />
        </div>

        {/* Mobile Status Filter Dropdown */}
        <div className="sm:hidden">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#FF3D00]"
          >
            <option value="all" className="bg-[#0E1526] text-white">Status: All Orders ({orders.length})</option>
            {STATUS_OPTIONS.map((st) => {
              const count = orders.filter((o) => o.status === st.value).length;
              return (
                <option key={st.value} value={st.value} className="bg-[#0E1526] text-white">
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
                ? 'bg-[#FF3D00] text-white shadow-[0_0_15px_rgba(255,61,0,0.35)]'
                : 'bg-[#0E1526] text-slate-300 hover:text-white border border-white/10'
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
                    ? 'bg-[#FF3D00] text-white shadow-[0_0_15px_rgba(255,61,0,0.35)]'
                    : 'bg-[#0E1526] text-slate-300 hover:text-white border border-white/10'
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
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00]" />
          <span className="text-sm font-medium">Loading customer orders...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-[#0B101D] border border-dashed border-white/15 rounded-2xl space-y-3 cyber-corner">
          <ClipboardList className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-base font-bold text-white">No orders found</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Orders placed via the product checkout form will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#0B101D] border border-white/10 hover:border-[#FF3D00]/50 rounded-2xl p-5 sm:p-6 shadow-xl transition-all cyber-corner"
            >
              {/* Top Row: Order Number, Date, Status Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-[#FF3D00]/15 border border-[#FF3D00]/30 font-mono text-xs font-bold text-[#FF3D00]">
                    {order.order_number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400">
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
                  <label className="text-xs text-slate-400 font-semibold">Status:</label>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#0E1526] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#FF3D00]"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st.value} value={st.value} className="bg-[#0E1526] text-white">
                        {st.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleDelete(order)}
                    className="p-2 rounded-xl bg-[#0E1526] hover:bg-red-500/15 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body Grid: Ordered Product + Customer Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
                {/* Ordered Product Card */}
                <div className="lg:col-span-5 bg-[#0E1526] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#070A12] border border-white/10 shrink-0">
                    {order.product_image ? (
                      <Image
                        src={order.product_image}
                        alt={order.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00]">
                      Ordered Item (Qty: {order.quantity})
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-2">
                      {order.product_name}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-slate-200">
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
                    <p className="text-sm font-bold text-white">{order.customer_name}</p>
                    {order.company_name && (
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                        <span>{order.company_name}</span>
                      </p>
                    )}
                    <p className="text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                      <a href={`tel:${order.phone}`} className="hover:text-[#FF3D00] font-semibold">
                        {order.phone}
                      </a>
                    </p>
                    <p className="text-slate-300 flex items-center gap-1.5">
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
                    <p className="text-slate-300 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3D00] shrink-0 mt-0.5" />
                      <span>{order.delivery_address}</span>
                    </p>
                    {order.notes && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#070A12] border border-white/10 text-slate-300 flex items-start gap-1.5">
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
