"use client";

import { Tag as TagIcon, LayoutGrid, ChevronDown, ChevronUp } from "lucide-react";
import { Category, Tag } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterPanelProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory: Category | null;
  selectedTags: Tag[];
  onCategorySelect: (category: Category | null) => void;
  onTagToggle: (tag: Tag) => void;
}

const INITIAL_VISIBLE_COUNT = 6;

export default function FilterPanel({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategorySelect,
  onTagToggle,
}: FilterPanelProps) {
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  const visibleCategories = isCategoriesExpanded ? categories : categories.slice(0, INITIAL_VISIBLE_COUNT);
  const visibleTags = isTagsExpanded ? tags : tags.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <div className="space-y-6 py-2">
      {/* Categories Section */}
      <div>
        <button 
          onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
            <LayoutGrid className="w-4 h-4" />
            Categories
          </div>
          {categories.length > INITIAL_VISIBLE_COUNT && (
            <div className="text-xs text-blue-500 font-medium flex items-center gap-1">
              {isCategoriesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {isCategoriesExpanded ? "Show Less" : `+${categories.length - INITIAL_VISIBLE_COUNT} more`}
            </div>
          )}
        </button>
        
        <div className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out">
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
              selectedCategory === null
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            All
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <button 
          onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
            <TagIcon className="w-4 h-4" />
            Tags
          </div>
          {tags.length > INITIAL_VISIBLE_COUNT && (
            <div className="text-xs text-blue-500 font-medium flex items-center gap-1">
              {isTagsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {isTagsExpanded ? "Show Less" : `+${tags.length - INITIAL_VISIBLE_COUNT} more`}
            </div>
          )}
        </button>

        <div className="flex flex-wrap gap-2 transition-all duration-300 ease-in-out">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  : "bg-transparent border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-600"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
