"use client";

import { Message } from "@/types";
import {
  Edit2,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  title: string;
  body: string;
  category: string;
  tags: string;
  keywords: string;
};

const EMPTY_FORM: FormData = { title: "", body: "", category: "", tags: "", keywords: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formToPayload(form: FormData) {
  return {
    title: form.title.trim(),
    body: form.body.trim(),
    category: form.category.trim(),
    tags: parseList(form.tags),
    keywords: parseList(form.keywords),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {message}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function MessageForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);

  function field(name: keyof FormData) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [name]: e.target.value })),
    };
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-5 p-6"
    >
      <div>
        <label className={labelClass}>Title <span className="text-red-500">*</span></label>
        <input {...field("title")} required className={inputClass} placeholder="e.g. Warm Welcome & Greeting" />
      </div>

      <div>
        <label className={labelClass}>Body <span className="text-red-500">*</span></label>
        <textarea
          {...field("body")}
          required
          rows={6}
          className={`${inputClass} resize-y`}
          placeholder="Full message content…"
        />
      </div>

      <div>
        <label className={labelClass}>Category <span className="text-red-500">*</span></label>
        <input {...field("category")} required className={inputClass} placeholder="e.g. General Communication" />
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <input {...field("tags")} className={inputClass} placeholder="greeting, welcome, first response  (comma-separated)" />
      </div>

      <div>
        <label className={labelClass}>Keywords</label>
        <input {...field("keywords")} className={inputClass} placeholder="hello, hi, welcome  (comma-separated)" />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all active:scale-[0.98]"
        >
          {submitting ? "Saving…" : "Save Message"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <div className="p-6 flex flex-col gap-6">
        <p className="text-sm text-gray-600 dark:text-zinc-400">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setMessages(data);
    } catch {
      showToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // ── Filtered list ────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [messages, search]);

  // ── Unique categories count ──────────────────────────────────────────────

  const categoryCount = useMemo(
    () => new Set(messages.map((m) => m.category)).size,
    [messages]
  );

  // ── Handlers ────────────────────────────────────────────────────────────

  async function handleCreate(form: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Message created", "success");
      setShowCreate(false);
      fetchMessages();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Create failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(form: FormData) {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/messages/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(form)),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Message updated", "success");
      setEditTarget(null);
      fetchMessages();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Message deleted", "success");
      setDeleteTarget(null);
      fetchMessages();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function editFormInitial(msg: Message): FormData {
    return {
      title: msg.title,
      body: msg.body,
      category: msg.category,
      tags: msg.tags.join(", "),
      keywords: msg.keywords.join(", "),
    };
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold leading-none">ADSupportHub</h1>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <Shield className="w-2.5 h-2.5" />
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5 leading-none">
                Message Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:block text-sm text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              ← Back to app
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Messages", value: messages.length },
            { label: "Categories", value: categoryCount },
            { label: "Showing", value: filtered.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 px-5 py-4"
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, or tag…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all active:scale-[0.98] shadow-sm shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Message
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Loading messages…</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {search ? "No messages match your search" : "No messages yet"}
                </p>
                {!search && (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Add your first message
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Tags
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60">
                  {filtered.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs w-12">
                        #{msg.id}
                      </td>
                      <td className="px-5 py-4 font-medium max-w-xs">
                        <p className="truncate">{msg.title}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {msg.body.substring(0, 60).replace(/\n/g, " ")}…
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium">
                          {msg.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {msg.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {msg.tags.length > 3 && (
                            <span className="px-2 py-0.5 text-gray-400 text-xs">
                              +{msg.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditTarget(msg)}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(msg)}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Add New Message" onClose={() => setShowCreate(false)}>
          <MessageForm
            initial={EMPTY_FORM}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title={`Edit: ${editTarget.title}`} onClose={() => setEditTarget(null)}>
          <MessageForm
            initial={editFormInitial(editTarget)}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={submitting}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
