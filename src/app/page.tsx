"use client";

import FilterPanel from "@/components/FilterPanel";
import MessageList from "@/components/MessageList";
import MessagePreview from "@/components/MessagePreview";
import SearchBar from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import messagesData from "@/data/messages.json";
import { cn } from "@/lib/utils";
import { Category, Message, Tag } from "@/types";
import { ChevronLeft, Library, MessageSquare, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const messages = messagesData as Message[];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Derived data
  const categories = useMemo(() => {
    return Array.from(new Set(messages.map((m) => m.category))).sort();
  }, []);

  const tags = useMemo(() => {
    const allTags = messages.flatMap((m) => m.tags);
    return Array.from(new Set(allTags)).sort();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Search matching
      const matchesSearch =
        searchQuery === "" ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category matching
      const matchesCategory =
        selectedCategory === null || m.category === selectedCategory;

      // Tags matching (must have all selected tags)
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => m.tags.includes(t));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchQuery, selectedCategory, selectedTags]);

  const selectedMessage = useMemo(() => {
    return filteredMessages.find((m) => m.id === selectedMessageId) || null;
  }, [filteredMessages, selectedMessageId]);

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleMessageSelect = (id: string) => {
    setSelectedMessageId(id);
    setShowMobilePreview(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0;

  return (
    <main className="h-[100dvh] flex flex-col bg-background text-foreground selection:bg-blue-100 dark:selection:bg-blue-900/40 overflow-hidden">
      {/* Header */}
      <header className={cn(
        "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 px-4 sm:px-6 py-4 transition-all duration-300 shrink-0",
        showMobilePreview ? "hidden lg:block" : "block"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-2 min-w-max">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-sm sm:text-xl font-bold tracking-tight leading-none">ADSupportHub</h1>
              <p className="block text-[7px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-widest leading-none mt-1">Support Message Library</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 text-sm font-medium text-gray-500">
               <Library className="w-4 h-4" />
               <span>{filteredMessages.length}</span>
             </div>
             <ThemeToggle />
          </div>
        </div>
      </header>

      <div className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300 w-full flex-1 overflow-hidden",
        showMobilePreview ? "py-2" : "py-6 sm:py-8"
      )}>
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 h-full">
          {/* Left Panel: Filters and List */}
          <aside className={cn(
            "w-full lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto lg:pr-2 custom-scrollbar transition-all duration-300",
            showMobilePreview ? "hidden lg:flex" : "flex"
          )}>
            <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm shrink-0">
              <FilterPanel
                categories={categories}
                tags={tags}
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
                onCategorySelect={setSelectedCategory}
                onTagToggle={handleTagToggle}
              />
            </div>
            
            <div className="shrink-0 pb-20 lg:pb-0">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Results ({filteredMessages.length})</h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter transition-all active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Filters
                  </button>
                )}
              </div>
              <MessageList
                messages={filteredMessages}
                selectedId={selectedMessageId}
                onSelect={handleMessageSelect}
              />
            </div>
          </aside>

          {/* Right Panel: Preview */}
          <section className={cn(
            "w-full lg:col-span-8 h-full overflow-hidden transition-all duration-300",
            showMobilePreview ? "flex" : "hidden lg:flex"
          )}>
            <div className="flex flex-col w-full h-full">
              {showMobilePreview && (
                <div className="flex items-center justify-between px-1 py-2">
                  <button
                    onClick={() => setShowMobilePreview(false)}
                    className="flex lg:hidden items-center gap-1.5 text-blue-600 font-bold active:bg-blue-50 dark:active:bg-blue-900/20 px-2 py-2 rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm">Back</span>
                  </button>
                  <div className="lg:hidden">
                    <ThemeToggle />
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-hidden mb-12 lg:mb-0">
                <MessagePreview message={messages.find(m => m.id === selectedMessageId) || null} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
