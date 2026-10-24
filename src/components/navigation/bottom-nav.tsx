"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Map,
  Compass,
  Repeat,
  Menu,
  X,
  Sparkles,
  BookMarked,
  FileText,
  Volume2,
  Mic,
  Zap,
  Target,
  Trophy,
  Award,
  User,
  Settings,
} from "lucide-react";
import { DayNightToggle } from "./day-night-toggle";

interface DrawerSection {
  title: string;
  items: { name: string; href: string; icon: React.ElementType }[];
}

const DRAWER_SECTIONS: DrawerSection[] = [
  {
    title: "LEARN (学ぶ)",
    items: [
      { name: "Grammar Studio", href: "/grammar", icon: FileText },
      { name: "Vocabulary Library", href: "/vocabulary", icon: BookMarked },
      { name: "Kanji Lab", href: "/kanji", icon: Sparkles },
    ],
  },
  {
    title: "PRACTICE (特訓)",
    items: [
      { name: "Practice Hub", href: "/practice", icon: Zap },
      { name: "Listening Studio", href: "/listening", icon: Volume2 },
      { name: "Speaking Studio", href: "/speaking", icon: Mic },
      { name: "Stories & Culture", href: "/stories", icon: BookOpen },
    ],
  },
  {
    title: "PROGRESS & PROFILE (記録・設定)",
    items: [
      { name: "Quests & Challenges", href: "/quests", icon: Target },
      { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { name: "Achievements", href: "/achievements", icon: Award },
      { name: "Profile & Analytics", href: "/profile", icon: User },
      { name: "Settings & Appearance", href: "/settings", icon: Settings },
    ],
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainLinks = [
    { name: "Learn", href: "/", icon: BookOpen },
    { name: "Map", href: "/map", icon: Map },
    { name: "Kana", href: "/kana", icon: Compass },
    { name: "Review", href: "/review", icon: Repeat },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-surface h-full border-r border-border p-4 overflow-y-auto flex flex-col z-10 shadow-card">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <span className="font-bold text-base text-ink flex items-center gap-2">
                <span>🐱</span> NekoNihongo
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-subtle hover:bg-subtle"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorized Drawer Navigation */}
            <div className="space-y-4 flex-1">
              {DRAWER_SECTIONS.map((sec) => (
                <div key={sec.title} className="space-y-1">
                  <div className="text-[10px] font-bold tracking-wider text-muted px-2 uppercase">
                    {sec.title}
                  </div>
                  {sec.items.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                          isActive
                            ? "bg-primary text-white font-semibold shadow-soft"
                            : "text-subtle hover:bg-subtle hover:text-ink"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile Drawer Day & Night Mode Switcher */}
            <div className="pt-3 mt-3 border-t border-border">
              <DayNightToggle variant="pill" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around shadow-soft">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? "text-primary font-bold" : "text-subtle hover:text-ink"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium text-subtle hover:text-ink"
          aria-label="More navigation options"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
