"use client";

import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! Ask me about your predictions, match points, football, World Cup history—or ask me to tell you a football joke. What would you like to know?",
};

const ZIZU_HIGHLIGHT_UNTIL = Date.parse("2026-07-03T23:59:59+05:30");

function inlineFormat(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-emerald-200">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function AssistantContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  const sectionNames = new Set([
    "Points summary",
    "Group predictions",
    "Tournament predictions",
    "Calculation guide",
  ]);

  for (let index = 0; index < lines.length; ) {
    const line = lines[index].trimEnd();
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (
      line.trim().startsWith("|") &&
      lines[index + 1]?.trim().match(/^\|?[\s:-]+\|/)
    ) {
      const tableLines: string[] = [line];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      const rows = tableLines.map((row) =>
        row
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim())
      );
      blocks.push(
        <div
          key={`table-${index}`}
          className="my-2 overflow-x-auto rounded-xl border border-emerald-400/20"
        >
          <table className="w-full min-w-max text-left text-xs">
            <thead className="bg-emerald-400/15 text-emerald-200">
              <tr>
                {rows[0].map((cell, cellIndex) => (
                  <th key={cellIndex} className="px-2.5 py-2 font-semibold">
                    {inlineFormat(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-white/[0.03]">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-2.5 py-2 ${
                        /\b(points?|total|\+\d+)\b/i.test(cell)
                          ? "font-medium text-amber-200"
                          : "text-gray-200"
                      }`}
                    >
                      {inlineFormat(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const cardLines = [line];
      index += 1;
      while (index < lines.length && /^\s{2,}\S/.test(lines[index])) {
        cardLines.push(lines[index].trim());
        index += 1;
      }
      blocks.push(
        <div
          key={`card-${index}`}
          className="my-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] px-3 py-2"
        >
          {cardLines.map((cardLine, cardIndex) => (
            <p
              key={cardIndex}
              className={
                cardIndex === 0
                  ? "font-semibold text-sky-200"
                  : /\bpoints?:/i.test(cardLine)
                    ? "mt-1 text-xs font-medium text-amber-200"
                    : "mt-1 text-xs text-gray-300"
              }
            >
              {inlineFormat(cardLine)}
            </p>
          ))}
        </div>
      );
      continue;
    }

    const cleanHeading = line.replace(/^#{1,4}\s*/, "").trim();
    if (/^#{1,4}\s/.test(line) || sectionNames.has(cleanHeading)) {
      blocks.push(
        <h3
          key={`heading-${index}`}
          className="mb-1 mt-3 border-b border-emerald-400/20 pb-1 font-semibold text-emerald-200 first:mt-0"
        >
          {inlineFormat(cleanHeading)}
        </h3>
      );
    } else if (/^[-*]\s+/.test(line.trim())) {
      blocks.push(
        <div key={`bullet-${index}`} className="flex gap-2 py-0.5">
          <span className="text-emerald-300">•</span>
          <span>{inlineFormat(line.trim().replace(/^[-*]\s+/, ""))}</span>
        </div>
      );
    } else {
      const isTotal = /\b(total|points summary|rank)\b/i.test(line);
      const isPending = /\bpending\b/i.test(line);
      blocks.push(
        <p
          key={`line-${index}`}
          className={`py-0.5 ${
            isPending
              ? "text-amber-200"
              : isTotal
                ? "font-medium text-emerald-200"
                : ""
          }`}
        >
          {inlineFormat(line)}
        </p>
      );
    }
    index += 1;
  }

  return <div className="space-y-0.5">{blocks}</div>;
}

export function PredictionChat() {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setHighlighted(
      Date.now() < ZIZU_HIGHLIGHT_UNTIL &&
        localStorage.getItem("zizu-discovered") !== "true"
    );
  }, []);

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
                  content: `Hi ${data.username}! Ask me about your predictions, match points, football, World Cup history—or ask me to tell you a football joke. What would you like to know?`,
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
    if (open && window.matchMedia("(min-width: 640px)").matches) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(event?: FormEvent, suggestedQuestion?: string) {
    event?.preventDefault();
    const question = (suggestedQuestion || input).trim();
    if (!question || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSuggestions([]);
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
      setSuggestions(
        Array.isArray(data.suggestions)
          ? data.suggestions.filter(
              (suggestion: unknown): suggestion is string =>
                typeof suggestion === "string" && suggestion.trim().length > 0
            )
          : []
      );
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

  function toggleChat() {
    setOpen((current) => {
      if (current) setFullScreen(false);
      return !current;
    });
    if (!open && highlighted) {
      localStorage.setItem("zizu-discovered", "true");
      setHighlighted(false);
    }
  }

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-5 z-[80] sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Open ZiZu AI Assistant"
          className={
            fullScreen
              ? "fixed inset-0 z-[100] flex h-dvh w-screen flex-col overflow-hidden bg-slate-950 shadow-2xl"
              : "fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-2 flex h-[min(58dvh,420px)] w-[calc(100vw-1rem)] max-w-[340px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:static sm:mb-3 sm:h-[min(72vh,590px)] sm:w-[calc(100vw-2rem)] sm:max-w-[390px] sm:rounded-3xl"
          }
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
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFullScreen((current) => !current)}
                className="grid h-9 w-9 place-items-center rounded-full text-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label={
                  fullScreen
                    ? "Exit full-screen assistant"
                    : "Open assistant full screen"
                }
                title={fullScreen ? "Exit full screen" : "Full screen"}
              >
                {fullScreen ? "↙" : "↗"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFullScreen(false);
                  setOpen(false);
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Minimize prediction assistant"
                title="Minimize"
              >
                −
              </button>
            </div>
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
                  className={`whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "max-w-[88%] rounded-br-md bg-emerald-500 text-slate-950"
                      : "max-w-[96%] rounded-bl-md border border-white/10 bg-white/10 text-gray-100"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <AssistantContent content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {!loading && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pl-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(undefined, suggestion)}
                    className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-left text-xs font-medium text-emerald-200 transition hover:border-emerald-300/60 hover:bg-emerald-400/20"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
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
                placeholder="Ask ZiZu about football…"
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
              Predictions · football questions · jokes
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={toggleChat}
        aria-label={open ? "Close prediction assistant" : "Open prediction assistant"}
        aria-expanded={open}
        className={`group relative ml-auto grid h-16 w-16 place-items-center rounded-full border bg-slate-900/75 text-3xl shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 ${
          highlighted
            ? "border-amber-300 shadow-amber-400/40 ring-4 ring-amber-300/30"
            : "border-white/25 shadow-black/40"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 h-24 w-24 overflow-visible text-emerald-200 drop-shadow-[0_0_5px_rgba(110,231,183,0.8)]"
        >
          <defs>
            <path id="zizu-label-arc" d="M 10,55 A 42,42 0 0,1 90,55" />
          </defs>
          <text
            fill="currentColor"
            fontSize="10"
            fontWeight="800"
            letterSpacing="2"
            className="animate-pulse"
          >
            <textPath
              href="#zizu-label-arc"
              startOffset="50%"
              textAnchor="middle"
            >
              ASK ZIZU
            </textPath>
          </text>
        </svg>
        {highlighted && (
          <>
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-amber-300/35" />
            <span className="absolute right-[4.5rem] top-1/2 w-max -translate-y-1/2 animate-bounce rounded-full border border-amber-300/50 bg-slate-950/95 px-3 py-1.5 text-xs font-bold text-amber-200 shadow-lg">
              New · Ask ZiZu
            </span>
          </>
        )}
        <span className="absolute inset-1 animate-pulse rounded-full border border-emerald-300/20" />
        <span className="relative animate-[bounce_2.2s_ease-in-out_infinite] drop-shadow-lg transition group-hover:rotate-6">
          ⚽
        </span>
        {!open && (
          <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
        )}
      </button>
    </div>
  );
}
