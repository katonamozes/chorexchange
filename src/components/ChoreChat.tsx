"use client";
import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button, Card } from "@/components/ui";
import { apiUrl } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import type { ChoreMessage } from "./chore-data";

export function ChoreChat({ choreId, canSend }: { choreId: string; canSend: boolean }) {
  const { t } = useLocale();
  const [messages, setMessages] = useState<ChoreMessage[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = () => {
    const controller = new AbortController();
    setLoading(true);
    fetch(apiUrl(`/api/chore-chat?choreId=${encodeURIComponent(choreId)}`), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error ?? "Couldn’t load messages");
        return response.json() as Promise<ChoreMessage[]>;
      })
      .then(setMessages)
      .catch((error: unknown) => { if (error instanceof Error && error.name !== "AbortError") toast.error(t(error.message)); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  };

  useEffect(() => loadMessages(), [choreId]);

  async function sendMessage() {
    if (!body.trim() || sending || !canSend) return;
    setSending(true);
    const response = await fetch(apiUrl("/api/chore-chat"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ choreId, body }) });
    const result = await response.json();
    setSending(false);
    if (!response.ok) return toast.error(t(result.error ?? "Couldn’t send message"));
    setMessages((current) => [...current, result as ChoreMessage]);
    setBody("");
  }

  return <Card title={t("Arrange the details")} actions={<MessageCircle className="size-4 text-accent-strong" />}>
    <div className="max-h-64 space-y-3 overflow-y-auto rounded-xl bg-surface-inset p-3">
      {loading && <p className="py-5 text-center text-sm text-muted-foreground">{t("Loading conversation…")}</p>}
      {!loading && !messages.length && <p className="py-5 text-center text-sm text-muted-foreground">{t("No messages yet. Say hello and agree on the details.")}</p>}
      {messages.map((message) => <div key={message.id} className="rounded-lg border border-border bg-card px-3 py-2"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-foreground">{message.senderName}</span><time className="text-[11px] text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</time></div><p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-muted-foreground">{message.body}</p></div>)}
    </div>
    {canSend ? <div className="mt-3 flex items-end gap-2"><textarea aria-label={t("Message the chore poster")} className="min-w-0 w-full max-w-sm flex-1 resize-none" rows={2} maxLength={2000} placeholder={t("Confirm timing, access, or other details…")} value={body} onChange={(event) => setBody(event.target.value)} /><Button size="sm" variant="highlight" disabled={sending || !body.trim()} onClick={sendMessage}>{sending ? t("Sending…") : <Send className="size-4" />}<span className="sr-only">{t("Send message")}</span></Button></div> : <p className="mt-3 text-xs text-muted-foreground">{t("This completed conversation is read-only.")}</p>}
  </Card>;
}
