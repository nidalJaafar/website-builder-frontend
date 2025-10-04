"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useConfig } from "@/app/context/ConfigContext";
import { useNotifier } from "@/app/context/NotificationContext";

type ChatMessage = {
  id: string;
  role: "system" | "user";
  content: string;
  timestamp: number;
};

type ReviewChatProps = {
  onRegenerate: () => void;
  onEditSettings: () => void;
};

const SUGGESTIONS = [
  "Adjust hero colors",
  "Add pricing section",
  "Shorten the testimonials",
  "Swap CTA style",
  "Make layout more minimal",
];

export const ReviewChat: React.FC<ReviewChatProps> = ({
  onRegenerate,
  onEditSettings,
}) => {
  const {
    lastGeneratedPrompt,
    promptText,
    setPromptText,
  } = useConfig();
  const { notify } = useNotifier();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const lastPromptRef = useRef<string>("");

  useEffect(() => {
    if (!lastGeneratedPrompt || lastGeneratedPrompt === lastPromptRef.current) {
      return;
    }
    lastPromptRef.current = lastGeneratedPrompt;
    setMessages([
      {
        id: "seed",
        role: "system",
        content: lastGeneratedPrompt,
        timestamp: Date.now(),
      },
    ]);
  }, [lastGeneratedPrompt]);

  const hasConversation = useMemo(() => messages.length > 1, [messages]);

  const makeId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

  const appendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      },
    ]);

    const base = (promptText || lastGeneratedPrompt || "").trim();
    const addition = `\n\nUpdate request: ${trimmed}`;
    setPromptText(`${base}${addition}`.trim());
    notify("Request added to prompt context");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    appendMessage(input);
    setInput("");
  };

  const handleChip = (suggestion: string) => {
    appendMessage(suggestion);
  };

  return (
    <div className="h-full rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Iterate with AstraSite</h2>
            <p className="text-sm text-slate-400">
              Latest prompt is pinned at the top. Use chat to request adjustments and
              regenerate when ready.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-neon-500/20 text-neon-100 ring-1 ring-neon-400/30 hover:bg-neon-500/30 shadow-glow transition text-sm"
              onClick={onRegenerate}
            >
              Regenerate
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
              onClick={onEditSettings}
            >
              Edit settings
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              className="px-3 py-1.5 rounded-full bg-slate-800/70 ring-1 ring-white/10 text-xs hover:bg-slate-800 transition"
              onClick={() => handleChip(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1" id="review-chat-log">
        {messages.length === 0 ? (
          <div className="rounded-xl bg-slate-900/50 ring-1 ring-white/10 p-4 text-sm text-slate-400">
            Generate a website to start the conversation. Your prompt will appear here ready for
            refinements.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl px-4 py-3 text-sm leading-relaxed ring-1 transition ${
                message.role === "system"
                  ? "bg-slate-800/70 ring-white/10 text-slate-200"
                  : "bg-neon-500/10 ring-neon-400/20 text-neon-100"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wide opacity-60 mb-1">
                {message.role === "system" ? "Generated prompt" : "Your request"}
              </div>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <textarea
          className="w-full min-h-[6rem] rounded-xl bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 text-sm placeholder-slate-500"
          placeholder="Describe the tweak you'd like to see..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {hasConversation ? "Changes queued in prompt context." : "First change request starts a new iteration."}
          </span>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-neon-500/20 text-neon-100 ring-1 ring-neon-400/30 hover:bg-neon-500/30 shadow-glow transition text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};