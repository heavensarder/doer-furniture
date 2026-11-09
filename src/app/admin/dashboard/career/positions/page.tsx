'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  Trash2,
  Search,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  UserPlus,
} from 'lucide-react';

interface PositionItem {
  id: number;
  name: string;
  created_at: string;
}

export default function AdminPositionsPage() {
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create state
  const [newPositionName, setNewPositionName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/career/positions');
      if (res.ok) {
        const data = await res.json();
        setPositions(data.positions || []);
      }
    } catch (err) {
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositionName.trim()) return;

    setError(null);
    setSuccessMsg(null);

    try {
      setSaving(true);
      const res = await fetch('/api/admin/career/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPositionName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create position.');
      }

      setSuccessMsg(`Position "${newPositionName.trim()}" created successfully!`);
      setNewPositionName('');
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchPositions();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating position.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePosition = async (id: number) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/career/positions?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete position.');
      }

      setPositions((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
      setSuccessMsg('Position deleted successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting position.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPositions = positions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Recruitment ATS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Job Designations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-3">
            <Layers className="w-7 h-7 text-[#FF3D00]" />
            <span>Manage Positions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, manage, and delete standard position designations used when publishing jobs and receiving candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/dashboard/career/create-job"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,61,0,0.35)] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Job</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Create Position Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B101D] border border-white/10 shadow-xl cyber-corner space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-[#FF3D00]" />
          <span>Create New Position</span>
        </h2>

        <form onSubmit={handleCreatePosition} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <input
            type="text"
            required
            value={newPositionName}
            onChange={(e) => setNewPositionName(e.target.value)}
            placeholder="e.g. Lead Control Room Architectural Project Coordinator"
            className="flex-1 min-w-[240px] px-4 py-3 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FF3D00] transition-colors"
          />

          <button
            type="submit"
            disabled={saving || !newPositionName.trim()}
            className="px-6 py-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.4)] transition-all cursor-pointer shrink-0"
          >
            {saving ? 'Creating...' : '+ Add Position'}
          </button>
        </form>
      </div>

      {/* Positions Search & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search positions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF3D00]"
          />
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Positions: <strong className="text-white">{positions.length}</strong>
        </span>
      </div>

      {/* Positions List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading positions...</p>
        </div>
      ) : filteredPositions.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-[#0B101D] border border-white/10 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Positions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'No positions match your search query.' : 'Add your first job designation using the form above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredPositions.map((pos) => (
            <div
              key={pos.id}
              className="p-4 rounded-xl bg-[#0B101D] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4 flex-wrap text-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
                <span className="text-sm font-bold text-white tracking-wide truncate">
                  {pos.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard/career/create-job`}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1526] hover:bg-[#132247] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Create Job for This
                </Link>

                <button
                  type="button"
                  onClick={() => setDeletingId(pos.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                  title="Delete Position"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white">Delete Position Designation?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete this position? It will be removed from future job creation dropdowns.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeletePosition(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

