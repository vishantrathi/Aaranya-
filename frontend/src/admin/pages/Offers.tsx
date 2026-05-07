import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Plus, Trash2, Pencil, X, Upload } from "lucide-react";

import api from "../../api/axios";

type Placement = "home" | "blog";

interface OfferItem {
  _id: string;
  title: string;
  offerText: string;
  image: string;
  placement: Placement;
  ctaLabel: string;
  ctaPath: string;
  priority: number;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
}

interface FormState {
  title: string;
  offerText: string;
  image: string;
  placement: Placement;
  ctaLabel: string;
  ctaPath: string;
  priority: string;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

const emptyForm: FormState = {
  title: "",
  offerText: "",
  image: "",
  placement: "home",
  ctaLabel: "Explore",
  ctaPath: "/shop",
  priority: "0",
  isActive: true,
  startAt: "",
  endAt: "",
};

const toLocalDateTimeInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export default function Offers() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    return {
      home: offers.filter((offer) => offer.placement === "home"),
      blog: offers.filter((offer) => offer.placement === "blog"),
    };
  }, [offers]);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { data } = await api.get("/offers/admin");
      setOffers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOffers();
  }, []);

  const openCreate = () => {
    setEditingOffer(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (offer: OfferItem) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      offerText: offer.offerText,
      image: offer.image,
      placement: offer.placement,
      ctaLabel: offer.ctaLabel || "Explore",
      ctaPath: offer.ctaPath || "/shop",
      priority: String(offer.priority ?? 0),
      isActive: Boolean(offer.isActive),
      startAt: toLocalDateTimeInput(offer.startAt),
      endAt: toLocalDateTimeInput(offer.endAt),
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setForm((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.offerText.trim() || !form.image.trim()) {
      setError("Title, offer text, and image are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      offerText: form.offerText.trim(),
      image: form.image.trim(),
      placement: form.placement,
      ctaLabel: form.ctaLabel.trim() || "Explore",
      ctaPath: form.ctaPath.trim() || "/shop",
      priority: Number(form.priority) || 0,
      isActive: form.isActive,
      startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
    };

    try {
      setSaving(true);
      setError("");
      if (editingOffer) {
        await api.put(`/offers/admin/${editingOffer._id}`, payload);
      } else {
        await api.post("/offers/admin", payload);
      }
      setIsModalOpen(false);
      setEditingOffer(null);
      setForm(emptyForm);
      await loadOffers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offerId: string) => {
    try {
      await api.delete(`/offers/admin/${offerId}`);
      await loadOffers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete offer");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Offer Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">Control live offers for Home and Blog pages from one place.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Create Offer
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading offers...</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {(["home", "blog"] as Placement[]).map((placement) => (
            <section key={placement} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Megaphone className="h-4 w-4 text-primary-700" />
                {placement === "home" ? "Home Offers" : "Blog Offers"}
              </h2>

              <div className="space-y-3">
                {grouped[placement].length === 0 ? (
                  <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                    No offers configured for this placement.
                  </p>
                ) : (
                  grouped[placement].map((offer) => (
                    <article key={offer._id} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex gap-3">
                        <img src={offer.image} alt={offer.title} className="h-16 w-16 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">{offer.title}</p>
                          <p className="truncate text-xs text-gray-600">{offer.offerText}</p>
                          <p className="mt-1 text-xs text-gray-500">Priority: {offer.priority} | {offer.isActive ? "Active" : "Inactive"}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(offer)}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                            aria-label="Edit offer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(offer._id)}
                            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                            aria-label="Delete offer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">{editingOffer ? "Edit Offer" : "Create Offer"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Title</label>
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Offer Text</label>
                <input value={form.offerText} onChange={(e) => setForm((s) => ({ ...s, offerText: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Image URL</label>
                <input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-600 hover:border-primary-400 hover:text-primary-700">
                  <Upload className="h-3.5 w-3.5" /> Upload Image
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Placement</label>
                <select value={form.placement} onChange={(e) => setForm((s) => ({ ...s, placement: e.target.value as Placement }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                  <option value="home">Home</option>
                  <option value="blog">Blog</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Priority</label>
                <input type="number" value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">CTA Label</label>
                <input value={form.ctaLabel} onChange={(e) => setForm((s) => ({ ...s, ctaLabel: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">CTA Path</label>
                <input value={form.ctaPath} onChange={(e) => setForm((s) => ({ ...s, ctaPath: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Start At</label>
                <input type="datetime-local" value={form.startAt} onChange={(e) => setForm((s) => ({ ...s, startAt: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">End At</label>
                <input type="datetime-local" value={form.endAt} onChange={(e) => setForm((s) => ({ ...s, endAt: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))} />
                  Active
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60">
                {saving ? "Saving..." : editingOffer ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
