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
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

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
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm h-full flex flex-col"
    >
      {/* Compact Header: Focus on Title and Copy Action */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
          {message.title}
        </h2>
        
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
            copied
              ? "bg-green-500 text-white"
              : "bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-600/20"
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Primary Focus: Message Body */}
      <div className="flex-1 p-5 sm:p-8 overflow-y-auto bg-transparent">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 dark:text-zinc-100 leading-relaxed text-lg sm:text-xl font-medium tracking-tight">
            {message.body}
          </div>
        </div>
      </div>

      {/* Expandable Secondary Info: Category, Tags, Keywords */}
      <div className="border-t border-gray-100 dark:border-zinc-800">
        <button 
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <span>Message Details</span>
          <Info className={`w-4 h-4 transition-transform ${isDetailsExpanded ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {isDetailsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-50/50 dark:bg-black/20"
            >
              <div className="p-5 flex flex-col gap-4">
                {/* Category & Tags */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Classification</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      {message.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {message.tags.map(tag => (
                        <span key={tag} className="text-[11px] text-gray-400 font-medium">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Search Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {message.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-[10px] text-gray-500 dark:text-gray-400"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
