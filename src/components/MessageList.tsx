"use client";

import { Message } from "@/types";
import { ChevronRight, RotateCcw, SearchX } from "lucide-react";
import { useEffect } from "react";

interface MessageListProps {
  messages: Message[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery?: string;
  hasActiveFilters?: boolean;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
}

export default function MessageList({
  messages,
  selectedId,
  onSelect,
  searchQuery = "",
  hasActiveFilters = false,
  onClearSearch,
  onClearFilters,
}: MessageListProps) {
  useEffect(() => {
    if (!selectedId) return;
    document
      .querySelector(`[data-message-id="${selectedId}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  if (messages.length === 0) {
    const hasSearch = searchQuery.trim().length > 0;
    const both = hasSearch && hasActiveFilters;

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <SearchX className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
        </div>

        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          {hasSearch
            ? <>No results for &ldquo;<span className="text-blue-600 dark:text-blue-400">{searchQuery}</span>&rdquo;</>
            : "No messages match your filters"}
        </p>

        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5 max-w-[200px]">
          {both
            ? "Try clearing your filters or broadening your search."
            : hasSearch
            ? "Check the spelling or try a shorter keyword."
            : "Try selecting fewer categories or tags."}
        </p>

        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          {hasSearch && (
            <button
              onClick={onClearSearch}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <SearchX className="w-3.5 h-3.5" />
              Clear search
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-20 touch-manipulation">
      {messages.map((message) => (
        <button
          key={message.id}
          data-message-id={message.id}
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
