'use client';

import React, { useState, useEffect } from 'react';
import { useCyberDialog } from '@/components/ui/CyberDialog';
import {
  FolderTree,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: number;
  product_count?: number;
}

function toSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCategoriesPage() {
  const dialog = useCyberDialog();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Create / Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Drag & Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) {
      setSlug(toSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    if (val.trim() === '') {
      setSlugManuallyEdited(false);
    } else {
      setSlugManuallyEdited(true);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setSlugManuallyEdited(false);
    setDescription('');
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSlugManuallyEdited(cat.slug !== toSlug(cat.name));
    setDescription(cat.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() ? toSlug(slug) : toSlug(name);

    try {
      setSubmitting(true);
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim(),
          is_active: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      showToast(
        'success',
        editingId
          ? 'Category updated! Navbar and shop synced.'
          : 'Category created and added to Navbar under Products!'
      );
      resetForm();
      await fetchCategories();
      window.dispatchEvent(new Event('categories-updated'));
    } catch (err: any) {
      showToast('error', err.message || 'Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    const confirmed = await dialog.confirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${cat.name}"? Products currently inside this category will be preserved as uncategorized.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      badge: 'CATEGORY REMOVAL',
    });

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', `Category "${cat.name}" removed.`);
        await fetchCategories();
        window.dispatchEvent(new Event('categories-updated'));
      }
    } catch (err) {
      showToast('error', 'Failed to delete category');
    }
  };

  const persistNewOrder = async (newOrderedCategories: Category[]) => {
    setCategories(newOrderedCategories);
    try {
      setSavingOrder(true);
      const orderedIds = newOrderedCategories.map((c) => c.id);
      const res = await fetch('/api/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        showToast('success', 'Category order updated in Navbar & Shop page!');
        window.dispatchEvent(new Event('categories-updated'));
      }
    } catch (err) {
      showToast('error', 'Failed to save new category order');
    } finally {
      setSavingOrder(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...categories];
    const [moved] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, moved);

    setDraggedIdx(null);
    setDragOverIdx(null);

    await persistNewOrder(updated);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const moveItem = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const updated = [...categories];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);

    await persistNewOrder(updated);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#FF3D00] text-xs font-bold uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" />
            <span>eCommerce • Category Hierarchy</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Product Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Categories added here automatically appear under the <strong className="text-white">Products</strong> menu in the Navbar. Drag and drop rows or tap arrows to change display order.
          </p>
        </div>

        <Link
          href="/products"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B101D] hover:bg-[#0E1526] border border-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all shrink-0 w-full sm:w-auto shadow-lg cyber-corner"
        >
          <span>Preview Shop Page</span>
          <ExternalLink className="w-4 h-4 text-[#FF3D00]" />
        </Link>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-[#0B101D] border-emerald-500/40 text-emerald-400'
              : 'bg-[#0B101D] border-red-500/40 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* LEFT: Create / Edit Category Form */}
        <div className="lg:col-span-4 bg-[#0B101D] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl cyber-corner">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit3 className="w-4 h-4 text-[#FF3D00]" />
                  <span>Edit Category</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#FF3D00]" />
                  <span>Add New Category</span>
                </>
              )}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Control Room Consoles"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 h-5 mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                  Category Slug
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(toSlug(name));
                    setSlugManuallyEdited(false);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF3D00]/15 hover:bg-[#FF3D00] text-[#FF3D00] hover:text-white border border-[#FF3D00]/30 text-[10px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="control-room-consoles"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white font-mono text-sm sm:text-xs focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
              />
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                Used in filter URL: <code className="text-cyan-400">/products?category={slug || 'slug'}</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief category subtitle shown on the Shop page section header..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-5 bg-[#FF3D00] hover:bg-[#eb3800] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : editingId ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Category</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Drag-and-Drop Category List */}
        <div className="lg:col-span-8 bg-[#0B101D] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl cyber-corner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Category Display Order</span>
                {savingOrder && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-normal text-[#FF3D00]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving order...
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Drag any row by the handle <GripVertical className="w-3.5 h-3.5 inline text-slate-500" /> or use the arrow buttons to reorder.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#0E1526] border border-white/10 text-slate-300 text-xs font-bold self-start sm:self-auto">
              {categories.length} Categories
            </span>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#FF3D00]" />
              <span className="text-sm font-medium">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-dashed border-white/15 rounded-xl">
              <p className="text-sm">No categories found. Add your first category above.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {categories.map((cat, idx) => {
                const isDragged = draggedIdx === idx;
                const isDragOver = dragOverIdx === idx;

                return (
                  <div
                    key={cat.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all select-none cyber-corner ${
                      isDragged
                        ? 'opacity-40 bg-[#070A12] border-[#FF3D00]'
                        : isDragOver
                        ? 'bg-[#FF3D00]/10 border-[#FF3D00] scale-[1.01] shadow-xl'
                        : 'bg-[#0E1526] border-white/10 hover:border-[#FF3D00]/50 hover:bg-[#121B30]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0">
                      {/* Drag Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent transition-colors shrink-0 mt-0.5 sm:mt-0"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Order Badge */}
                      <div className="w-7 h-7 rounded-lg bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white text-sm sm:text-base break-words">
                            {cat.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-[#070A12] border border-white/10 text-cyan-400 font-mono text-[11px] truncate max-w-[180px]">
                            /{cat.slug}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                            {cat.product_count || 0} Products
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Controls: Up/Down + Edit/Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-2 rounded-xl bg-[#070A12] hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-sm active:scale-95"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === categories.length - 1}
                          className="p-2 rounded-xl bg-[#070A12] hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-sm active:scale-95"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="inline-flex items-center gap-1 px-2.5 sm:p-2 py-1.5 rounded-xl bg-[#070A12] hover:bg-[#FF3D00]/15 text-slate-300 hover:text-[#FF3D00] border border-white/10 hover:border-[#FF3D00]/30 transition-colors cursor-pointer sm:ml-1 shadow-sm text-xs font-semibold"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="sm:hidden">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-2 rounded-xl bg-[#070A12] hover:bg-red-500/15 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer shadow-sm"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
