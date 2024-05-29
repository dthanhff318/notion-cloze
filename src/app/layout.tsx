import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "~@/components/providers/convexProvider";
import { ThemeProvider } from "~@/components/providers/themeProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { ConvexReactClient } from "convex/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Cloze",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="slate"
            enableSystem
            disableTransitionOnChange
            storageKey="notioz"
          >
            <Toaster position="bottom-center" />
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
