"use client";

import { useState, useMemo } from "react";
import messagesData from "@/data/messages.json";
import { Message, Category, Tag } from "@/types";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import MessageList from "@/components/MessageList";
import MessagePreview from "@/components/MessagePreview";
import { MessageSquare, Library, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

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

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-100 dark:selection:bg-blue-900/40">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-900 px-4 sm:px-6 py-4 transition-all duration-300",
        showMobilePreview ? "hidden lg:block" : "block"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-2 min-w-max">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden xsm:block">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">ADSupportHub</h1>
              <p className="hidden sm:block text-[10px] text-gray-400 font-semibold uppercase tracking-widest leading-none">Message Library</p>
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
        "max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300",
        showMobilePreview ? "h-screen py-4" : "h-[calc(100vh-81px)] py-6 sm:py-8"
      )}>
        <div className="grid grid-cols-12 gap-8 h-full">
          {/* Left Panel: Filters and List */}
          <aside className={cn(
            "col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar transition-all duration-300",
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
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 px-2">Results ({filteredMessages.length})</h2>
              <MessageList
                messages={filteredMessages}
                selectedId={selectedMessageId}
                onSelect={handleMessageSelect}
              />
            </div>
          </aside>

          {/* Right Panel: Preview */}
          <section className={cn(
            "col-span-12 lg:col-span-8 h-full overflow-hidden transition-all duration-300",
            showMobilePreview ? "flex" : "hidden lg:flex"
          )}>
            <div className="flex flex-col w-full h-full gap-4">
              {showMobilePreview && (
                <button 
                  onClick={() => setShowMobilePreview(false)}
                  className="lg:hidden flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors px-2 mb-2 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to List
                </button>
              )}
              <MessagePreview message={selectedMessage} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
