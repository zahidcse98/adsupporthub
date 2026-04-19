"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-20 h-10" />;
  }

  const isDark = theme === "dark";

  return (
    <div 
      className="relative flex items-center bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-[72px] h-9 sm:w-20 sm:h-10 cursor-pointer select-none border border-gray-200 dark:border-zinc-700 shadow-inner overflow-hidden"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Sliding Highlight */}
      <motion.div
        className="absolute w-[32px] sm:w-[36px] h-[28px] sm:h-[32px] bg-white dark:bg-zinc-950 rounded-lg shadow-sm z-0"
        initial={false}
        animate={{
          x: isDark ? "100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ width: "calc(50% - 4px)" }}
      />

      {/* Icons Grid */}
      <div className="grid grid-cols-2 w-full z-10 pointer-events-none">
        <div className={`flex items-center justify-center h-7 sm:h-8 transition-colors duration-200 ${!isDark ? "text-amber-500" : "text-gray-400"}`}>
          <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className={`flex items-center justify-center h-7 sm:h-8 transition-colors duration-200 ${isDark ? "text-blue-400" : "text-gray-500"}`}>
          <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
}
