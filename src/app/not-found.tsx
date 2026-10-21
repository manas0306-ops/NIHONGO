"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  // Client-side route recovery for GitHub Pages SPA behavior
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      // If path is a known deep route with or without trailing slash/basePath, check if redirect is helpful
      const cleanPath = path.replace(/^\/NIHONGO/, "").replace(/\/$/, "");
      const knownRoutes = [
        "/map",
        "/kana",
        "/kanji",
        "/vocabulary",
        "/grammar",
        "/listening",
        "/speaking",
        "/stories",
        "/review",
        "/practice",
        "/quests",
        "/leaderboard",
        "/achievements",
        "/profile",
        "/settings",
      ];

      if (knownRoutes.includes(cleanPath)) {
        router.replace(cleanPath);
      }
    }
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-card">
        <div className="w-20 h-20 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto text-4xl shadow-soft animate-bounce">
          🐾
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary font-jp">
            404 • 迷子になりました
          </span>
          <h1 className="text-2xl font-bold text-ink">Page Not Found</h1>
          <p className="text-xs text-subtle leading-relaxed">
            Looks like you wandered into a peaceful, quiet alley in Kyoto. Don't worry, all your learning progress is safe!
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-soft text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Learning</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="py-3.5 px-4 rounded-2xl border border-border bg-subtle hover:bg-border text-subtle hover:text-ink font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
