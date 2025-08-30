"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const sessionIdRef = useRef<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const sid = (typeof window !== "undefined" && localStorage.getItem("chat_session_id")) || "";
    if (sid) sessionIdRef.current = sid;
    else {
      sessionIdRef.current = crypto.randomUUID();
      try { localStorage.setItem("chat_session_id", sessionIdRef.current); } catch {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setShowPanel(true);
      setClosing(false);
    } else if (showPanel) {
      setClosing(true);
      const t = setTimeout(() => { setShowPanel(false); setClosing(false); }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function send() {
    if (!input.trim() || busy) return;
    const next: Msg = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((m) => [...m, next]);
    setInput("");
    setBusy(true);
    setError(null);
  
    try {
      const payload = {
        sessionId: sessionIdRef.current,
        messages: [...messages, next].map(({ role, content }) => ({ role, content })),
        metadata: { source: "landing" },
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error((data as any)?.error || "Chat failed");

      const pick = (p: any): string => {
        try {
          if (!p) return "";
          if (typeof p === "string") return p;
          const direct = ["reply","text","message","result","output","content","answer"]
            .map((k) => p?.[k])
            .find((v) => typeof v === "string" && v.trim().length > 0);
          if (typeof direct === "string") return direct;
          const nested = [
            p?.data,
            p?.data?.text,
            p?.data?.reply,
            p?.response?.text,
            p?.output?.text,
            p?.choices?.[0]?.message?.content,
            p?.messages?.[0]?.content,
          ].find((v) => typeof v === "string" && v.trim().length > 0);
          if (typeof nested === "string") return nested;
          return "";
        } catch { return ""; }
      };

      const text = pick(data);
      if (!text) {
        // Show raw payload to aid debugging instead of failing silently
        const raw = typeof data === "string" ? data : JSON.stringify(data);
        const reply: Msg = { id: crypto.randomUUID(), role: "assistant", content: raw || "(no content)" };
        setMessages((m) => [...m, reply]);
        return;
      }

      const reply: Msg = { id: crypto.randomUUID(), role: "assistant", content: text };
      setMessages((m) => [...m, reply]);
  
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }
  

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function toggleOpen() {
    if (open) {
      setConfirmExit(true);
      return;
    }
    setOpen(true);
  }

  if (!mounted) return null;
  return createPortal(
    <>
      <button
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`group z-[70] h-[72px] w-[72px] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl transition-transform duration-200 hover:scale-110 active:scale-95 grid place-items-center relative overflow-visible`}
        style={{ position: 'fixed', left: 24, bottom: 24 }}
      >
        {/* Halo effects */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 blur-md" />
        <span className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-ping" />
        <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-8 ring-white/20 transition-all duration-300 pointer-events-none" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" className="relative transition-transform duration-300 group-hover:rotate-6">
          <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v8A2.5 2.5 0 0 1 19.5 16H8l-4.293 4.293A1 1 0 0 1 2 19.586V5.5Z"/>
        </svg>
      </button>

      {showPanel && (
        <div className={`z-[70] rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden transform transition-all duration-300 ${closing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          style={{ position: 'fixed', left: 24, bottom: 24 + 72 + 16, width: '40vw', height: '50vh' }}
        >
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 text-sm font-semibold">NeshTech Assistant</div>
          <div ref={listRef} className="chat-scroll h-[calc(50vh-112px)] overflow-y-auto p-4 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="text-zinc-500">Hi! Ask us about services, pricing, or bookings.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block px-3 py-2 rounded-2xl whitespace-pre-line break-words ${m.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy && <div className="text-zinc-500">Typing…</div>}
            {error && <div className="text-red-600">{error}</div>}
          </div>
          <div className="p-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type your message"
              className="flex-1 rounded-xl border border-black/20 dark:border-white/20 px-3 py-2 text-sm bg-white dark:bg-zinc-900"
            />
            <button onClick={send} disabled={busy || !input.trim()} className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white disabled:opacity-60 transition-transform duration-200 hover:scale-105 active:scale-95">Send</button>
          </div>

          {confirmExit && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-[min(90%,320px)] rounded-xl bg-white dark:bg-zinc-800 p-4 text-sm shadow-xl border border-black/10 dark:border-white/10">
                <p className="font-semibold">Close chat?</p>
                <p className="mt-1 text-zinc-600 dark:text-zinc-300">Your messages will be kept for this session.</p>
                <div className="mt-4 flex gap-2 justify-end">
                  <button onClick={() => setConfirmExit(false)} className="rounded-lg px-3 py-1.5 border border-black/10 dark:border-white/20">Keep chatting</button>
                  <button onClick={() => { setConfirmExit(false); setOpen(false); }} className="rounded-lg px-3 py-1.5 bg-blue-600 text-white">Close chat</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>,
    document.body
  );
}
 
