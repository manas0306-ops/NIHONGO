"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Map,
  Compass,
  FileText,
  Volume2,
  Mic,
  BookMarked,
  Repeat,
  Zap,
  Target,
  Trophy,
  Award,
  User,
  Settings,
  Flame,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/providers/state-context";
import { DayNightToggle } from "./day-night-toggle";

interface NavItem {
  name: string;
  japaneseName: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  jpTitle: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "LEARN",
    jpTitle: "学ぶ",
    items: [
      { name: "Home Dashboard", japaneseName: "学習ホーム", href: "/", icon: BookOpen },
      { name: "Course Map", japaneseName: "コースマップ", href: "/map", icon: Map },
      { name: "Grammar Studio", japaneseName: "文法スタジオ", href: "/grammar", icon: FileText },
      { name: "Vocabulary", japaneseName: "単語帳", href: "/vocabulary", icon: BookMarked },
      { name: "Kanji Lab", japaneseName: "漢字ラボ", href: "/kanji", icon: Sparkles },
    ],
  },
  {
    title: "PRACTICE",
    jpTitle: "特訓",
    items: [
      { name: "Practice Hub", japaneseName: "特訓ハブ", href: "/practice", icon: Zap },
      { name: "Kana Dojo", japaneseName: "仮名道場", href: "/kana", icon: Compass },
      { name: "Listening", japaneseName: "聴解トレ", href: "/listening", icon: Volume2 },
      { name: "Speaking", japaneseName: "発音トレ", href: "/speaking", icon: Mic },
      { name: "Stories", japaneseName: "ストーリー", href: "/stories", icon: BookOpen },
    ],
  },
  {
    title: "REVIEW",
    jpTitle: "復習",
    items: [
      { name: "Review Center", japaneseName: "復習センター", href: "/review", icon: Repeat, badge: "SRS" },
    ],
  },
  {
    title: "RECORD & SETTINGS",
    jpTitle: "記録・設定",
    items: [
      { name: "Quests", japaneseName: "クエスト", href: "/quests", icon: Target },
      { name: "Leaderboard", japaneseName: "番付表", href: "/leaderboard", icon: Trophy },
      { name: "Achievements", japaneseName: "実績バッジ", href: "/achievements", icon: Award },
      { name: "Profile & Stats", japaneseName: "統計・記録", href: "/profile", icon: User },
      { name: "Settings", japaneseName: "設定", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { gamification, learnerModel } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface h-screen sticky top-0 overflow-y-auto select-none p-4">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-3 py-3 mb-1 group">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold shadow-soft group-hover:scale-105 transition-transform">
          🐱
        </div>
        <div>
          <div className="font-bold text-lg leading-tight text-ink flex items-center gap-1.5">
            <span>NekoNihongo</span>
            <span className="text-[10px] bg-primary-light text-primary px-1.5 py-0.5 rounded-full font-medium">
              β
            </span>
          </div>
          <p className="text-[11px] text-subtle font-jp">猫日本語 • 毎日の一歩</p>
        </div>
      </Link>

      {/* Gamification Bar */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-3 rounded-xl bg-subtle border border-border text-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-600">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{gamification.streak} 日</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-primary">
          <span>⚡ {gamification.xp} XP</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-rose-500">
          <span>❤️ {gamification.hearts}</span>
        </div>
      </div>

      {/* 4-Pillar Pedagogical Navigation Groups */}
      <nav className="flex-1 space-y-4">
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-3 pt-1 text-[10px] font-bold tracking-wider text-muted flex items-center justify-between uppercase">
              <span>{sec.title}</span>
              <span className="font-jp text-[11px] font-normal">{sec.jpTitle}</span>
            </div>
            {sec.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-soft font-semibold"
                      : "text-subtle hover:bg-subtle hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-subtle"}`} />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {item.badge ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive ? "bg-white/20 text-white" : "bg-primary-light text-primary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-jp opacity-60 ${isActive ? "text-white" : ""}`}
                    >
                      {item.japaneseName}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Day / Night Mode Quick Switcher */}
      <div className="mt-3">
        <DayNightToggle variant="pill" />
      </div>

      {/* Footer info */}
      <div className="mt-2 pt-2 border-t border-border px-3 text-[10px] text-muted flex items-center justify-between">
        <span>JLPT N5 → N1</span>
        <span>Mastery: {learnerModel.overallMastery}%</span>
      </div>
    </aside>
  );
}
