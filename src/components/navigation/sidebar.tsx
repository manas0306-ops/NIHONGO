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

interface NavItem {
  name: string;
  japaneseName: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home / Learn", japaneseName: "学習ホーム", href: "/", icon: BookOpen },
  { name: "Course Map", japaneseName: "コースマップ", href: "/map", icon: Map },
  { name: "Kana Dojo", japaneseName: "仮名道場", href: "/kana", icon: Compass },
  { name: "Kanji Lab", japaneseName: "漢字ラボ", href: "/kanji", icon: Sparkles },
  { name: "Vocabulary", japaneseName: "単語帳", href: "/vocabulary", icon: BookMarked },
  { name: "Grammar Studio", japaneseName: "文法スタジオ", href: "/grammar", icon: FileText },
  { name: "Listening", japaneseName: "聴解トレ", href: "/listening", icon: Volume2 },
  { name: "Speaking", japaneseName: "発音トレ", href: "/speaking", icon: Mic },
  { name: "Stories", japaneseName: "ストーリー", href: "/stories", icon: BookOpen },
  { name: "Review Center", japaneseName: "復習センター", href: "/review", icon: Repeat, badge: "SRS" },
  { name: "Practice Hub", japaneseName: "特訓ハブ", href: "/practice", icon: Zap },
  { name: "Quests", japaneseName: "クエスト", href: "/quests", icon: Target },
  { name: "Leaderboard", japaneseName: "番付表", href: "/leaderboard", icon: Trophy },
  { name: "Achievements", japaneseName: "実績バッジ", href: "/achievements", icon: Award },
  { name: "Profile", japaneseName: "統計・記録", href: "/profile", icon: User },
  { name: "Settings", japaneseName: "設定", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { gamification } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface h-screen sticky top-0 overflow-y-auto select-none p-4">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-2 group">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-bold shadow-soft group-hover:scale-105 transition-transform">
          🐱
        </div>
        <div>
          <div className="font-bold text-lg leading-tight text-ink flex items-center gap-1.5">
            <span>NekoNihongo</span>
            <span className="text-xs bg-primary-light text-primary px-1.5 py-0.5 rounded-full font-medium">
              β
            </span>
          </div>
          <p className="text-xs text-subtle font-jp">猫日本語 • 毎日の一歩</p>
        </div>
      </Link>

      {/* Gamification Bar */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-4 rounded-xl bg-subtle border border-border text-xs">
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

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
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
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-subtle"}`} />
                <span>{item.name}</span>
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
                <span className={`text-[11px] font-jp opacity-60 ${isActive ? "text-white" : ""}`}>
                  {item.japaneseName}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-border px-3 text-[11px] text-muted flex items-center justify-between">
        <span>JLPT N5 → N1</span>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}
