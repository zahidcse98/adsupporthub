"use client";

import { Message } from "@/types";
import { Copy, Check, Share2, Info } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessagePreviewProps {
  message: Message | null;
}

export default function MessagePreview({ message }: MessagePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (!message) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl">
        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Select a message to preview</p>
        <p className="text-sm mt-1">Choose from the list on the left to see details and copy content.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={message.id}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col"
    >
      <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              {message.category}
            </span>
            <div className="flex gap-1">
              {message.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-400">#{tag}</span>
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {message.title}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Message"}
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 dark:bg-black/20">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {message.body}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-zinc-800">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {message.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-600 dark:text-gray-400"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
