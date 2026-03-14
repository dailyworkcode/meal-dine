// This is the root layout, which is required by Next.js.
// All UI is handled in the `[locale]` layout.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
