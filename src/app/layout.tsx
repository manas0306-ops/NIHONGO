import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/providers/state-context";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/navigation/topbar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { OnboardingWizard } from "@/components/onboarding/wizard";

export const metadata: Metadata = {
  title: "NekoNihongo (猫日本語) — Japanese Language Learning",
  description: "Small lessons. Real Japanese. Every day. Production Japanese learning platform from zero to JLPT N1.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="sakura" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="washi-pattern min-h-screen flex text-ink antialiased">
        <AppProvider>
          <OnboardingWizard />
          <div className="flex w-full min-h-screen">
            {/* Desktop Left Sidebar */}
            <Sidebar />

            {/* Main Center Content Column */}
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <main className="flex-1 pb-20 lg:pb-8">{children}</main>
            </div>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
