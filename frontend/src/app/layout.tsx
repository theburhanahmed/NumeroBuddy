import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/contexts/theme-context";
import { AIChatProvider } from "@/contexts/ai-chat-context";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { FloatingChatWidget } from "@/components/ai-chat/floating-chat-widget";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NumerAI - Your Personal Numerology Guide",
  description: "Discover your life path through the ancient wisdom of numerology",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <OnboardingProvider>
              <SubscriptionProvider>
                <AIChatProvider>
                  <ErrorBoundary>
                    <Navigation />
                    <main className="pt-16">{children}</main>
                    <FloatingChatWidget />
                    <Toaster />
                    <SonnerToaster position="top-right" richColors />
                  </ErrorBoundary>
                </AIChatProvider>
              </SubscriptionProvider>
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}