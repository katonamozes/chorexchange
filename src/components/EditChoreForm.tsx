"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { apiUrl } from "@/lib/utils";
import { categories, type Chore } from "./chore-data";
import { useLocale } from "@/lib/i18n";

export function EditChoreForm({ chore, onSaved, onCancel }: { chore: Chore; onSaved: () => void; onCancel: () => void }) {
  const { t } = useLocale();
  const [form, setForm] = useState({ title: chore.title, category: chore.category, neighborhood: chore.neighborhood, timing: chore.timing, credits: String(chore.credits), details: chore.details ?? "" });
  const [saving, setSaving] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); const response = await fetch(apiUrl("/api/chores"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", id: chore.id, ...form, credits: Number(form.credits) }) }); const result = await response.json(); setSaving(false); if (!response.ok) return toast.error(t(result.error ?? "Couldn’t save chore")); toast.success(t("Chore updated")); onSaved(); }
  return <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border border-border-secondary bg-surface-inset p-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1 block text-xs font-medium">{t("Title")}</span><input value={form.title} onChange={(event) => update("title", event.target.value)} /></label><label><span className="mb-1 block text-xs font-medium">{t("Category")}</span><select value={form.category} onChange={(event) => update("category", event.target.value)}>{categories.slice(1).map((category) => <option key={category} value={category}>{t(category)}</option>)}</select></label><label><span className="mb-1 block text-xs font-medium">{t("Credits")}</span><input type="number" min="1" step="1" value={form.credits} onChange={(event) => update("credits", event.target.value)} /></label><label><span className="mb-1 block text-xs font-medium">{t("Neighborhood")}</span><input value={form.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} /></label><label><span className="mb-1 block text-xs font-medium">{t("When?")}</span><input value={form.timing} onChange={(event) => update("timing", event.target.value)} /></label><label className="sm:col-span-2"><span className="mb-1 block text-xs font-medium">{t("Details")}</span><textarea rows={3} value={form.details} onChange={(event) => update("details", event.target.value)} /></label><div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" size="sm" variant="ghost" onClick={onCancel}>{t("Cancel")}</Button><Button type="submit" size="sm" variant="highlight" disabled={saving}>{saving ? t("Saving…") : t("Save changes")}<ArrowRight className="size-4" /></Button></div></form>;
}
