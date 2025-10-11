"use client";

import React, { useMemo, useState } from "react";
import { useConfig } from "@/app/context/ConfigContext";

type ReviewChatProps = {
  onRegenerate: () => Promise<void>;
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
    chatMessages,
    sendChatMessage,
    isSendingChatMessage,
    buildStatus,
    buildStatusMessage,
  } = useConfig();
  const [input, setInput] = useState("");

  const hasConversation = useMemo(
    () => chatMessages.length > 1,
    [chatMessages]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    await sendChatMessage(trimmed);
    setInput("");
  };

  const handleChip = async (suggestion: string) => {
    await sendChatMessage(suggestion);
    setInput("");
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "agent":
        return "Requirements agent";
      case "user":
        return "Your request";
      default:
        return "Generated prompt";
    }
  };

  const roleClassName = (role: string) => {
    if (role === "user") {
      return "bg-neon-500/10 ring-neon-400/20 text-neon-100";
    }
    if (role === "agent") {
      return "bg-slate-800/70 ring-neon-400/30 text-slate-200";
    }
    return "bg-slate-800/70 ring-white/10 text-slate-200";
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
              onClick={() => void onRegenerate()}
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
              className={`px-3 py-1.5 rounded-full bg-slate-800/70 ring-1 ring-white/10 text-xs transition ${
                isSendingChatMessage ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-800"
              }`}
              disabled={isSendingChatMessage}
              onClick={() => void handleChip(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        {buildStatus !== "idle" && (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-xs ring-1 transition ${
              buildStatus === "completed"
                ? "bg-emerald-500/10 text-emerald-200 ring-emerald-400/30"
                : buildStatus === "pending"
                ? "bg-amber-500/10 text-amber-200 ring-amber-400/30"
                : "bg-rose-500/10 text-rose-200 ring-rose-400/30"
            }`}
          >
            {buildStatusMessage || "Status unavailable."}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1" id="review-chat-log">
        {chatMessages.length === 0 ? (
          <div className="rounded-xl bg-slate-900/50 ring-1 ring-white/10 p-4 text-sm text-slate-400">
            Generate a website to start the conversation. Your prompt will appear here ready for
            refinements.
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl px-4 py-3 text-sm leading-relaxed ring-1 transition ${roleClassName(message.role)}`}
            >
              <div className="text-[11px] uppercase tracking-wide opacity-60 mb-1">
                {roleLabel(message.role)}
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
            disabled={isSendingChatMessage}
            className={`px-4 py-2 rounded-lg bg-neon-500/20 text-neon-100 ring-1 ring-neon-400/30 shadow-glow transition text-sm ${
              isSendingChatMessage ? "opacity-70 cursor-progress" : "hover:bg-neon-500/30"
            }`}
          >
            {isSendingChatMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
