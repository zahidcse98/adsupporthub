"use client";

import { Message } from "@/types";
import { ChevronRight } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MessageList({ messages, selectedId, onSelect }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p>No messages found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-20 touch-manipulation">
      {messages.map((message) => (
        <button
          key={message.id}
          type="button"
          onClick={() => onSelect(message.id)}
          className={`w-full text-left p-3 rounded-xl transition-all border relative z-10 active:scale-[0.98] ${
            selectedId === message.id
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm"
              : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-zinc-700 hover:shadow-sm active:bg-gray-50 dark:active:bg-zinc-800"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-[13px] truncate ${
                selectedId === message.id ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
              }`}>
                {message.title}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                {message.body}
              </p>
              <div className="flex gap-2 mt-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                  {message.category}
                </span>
              </div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 mt-0.5 transition-transform ${
              selectedId === message.id ? "text-blue-500 translate-x-1" : "text-gray-300 dark:text-gray-700"
            }`} />
          </div>
        </button>
      ))}
    </div>
  );
}
