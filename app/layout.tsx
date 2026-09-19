import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoWatch AI",
  description: "See environmental problems. Understand them. Act.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-eco-200 selection:text-eco-900 dark:selection:bg-eco-900/50 dark:selection:text-eco-100">
        {children}
      </body>
    </html>
  );
}
