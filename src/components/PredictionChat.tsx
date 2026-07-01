"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I can explain your predictions, match points, extras, standings, and the leaderboard. What would you like to check?",
};

export function PredictionChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let active = true;

    async function personalizeGreeting() {
      try {
        const response = await fetch("/api/chat", { cache: "no-store" });
        if (!response.ok) return;
        const data: { username?: string } = await response.json();
        if (!active || !data.username) return;

        setMessages((current) =>
          current.length === 1 && current[0].content === WELCOME.content
            ? [
                {
                  role: "assistant",
                  content: `Hi ${data.username}! I can explain your predictions, match points, extras, standings, and the leaderboard. What would you like to check?`,
                },
              ]
            : current
        );
      } catch {
        // The generic greeting remains available if the session cannot be read.
      }
    }

    void personalizeGreeting();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(1),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to answer right now.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to answer right now."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-[80] sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Open ZiZu AI Assistant"
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-2 flex h-[min(58dvh,420px)] w-[calc(100vw-1rem)] max-w-[340px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:static sm:mb-3 sm:h-[min(72vh,590px)] sm:w-[calc(100vw-2rem)] sm:max-w-[390px] sm:rounded-3xl"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-emerald-500/15 via-transparent to-amber-400/10 px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-xl sm:h-10 sm:w-10 sm:text-2xl">
                ⚽
              </span>
              <div>
                <h2 className="font-bold text-white">ZiZu</h2>
                <p className="text-[11px] text-emerald-300">
                  AI Assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close prediction assistant"
            >
              ×
            </button>
          </header>

          <div
            ref={scrollRef}
            className="min-h-0 min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-4 sm:py-4"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-emerald-500 text-slate-950"
                      : "rounded-bl-md border border-white/10 bg-white/10 text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/10 px-4 py-3">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-300"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-black/20 p-3">
            {error && (
              <p className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}
            <form onSubmit={sendMessage} className="flex min-w-0 items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={1500}
                placeholder="Ask about your predictions…"
                className="max-h-28 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 text-base text-white outline-none placeholder:text-gray-500 focus:border-emerald-400/60 sm:px-4 sm:py-3 sm:text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send question"
              >
                ↑
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-gray-600">
              Prediction help only · verify important scores on your profile
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close prediction assistant" : "Open prediction assistant"}
        aria-expanded={open}
        className="group relative ml-auto grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-slate-900/65 text-3xl shadow-xl shadow-black/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
      >
        <span className="absolute inset-1 animate-pulse rounded-full border border-emerald-300/20" />
        <span className="relative drop-shadow-lg transition group-hover:rotate-6">
          ⚽
        </span>
        {!open && (
          <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
        )}
      </button>
    </div>
  );
}
