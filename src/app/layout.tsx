import ErrorBoundary from "./error";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
