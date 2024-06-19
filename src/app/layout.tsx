import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "~@/components/providers/convexProvider";
import { ThemeProvider } from "~@/components/providers/themeProvider";
import "./globals.css";
import { ModalProvider } from "~@/components/providers/modalProvider";
import { EdgeStoreProvider } from "~@/lib/edgestore";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tizZote",
  description: "Workspace free for everyone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider
                attribute="class"
                defaultTheme="slate"
                enableSystem
                disableTransitionOnChange
                storageKey="tizZote-theme"
              >
                <Toaster position="bottom-center" />
                <ModalProvider />
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
