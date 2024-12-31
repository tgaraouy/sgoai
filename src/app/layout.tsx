import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { playfair, poppins } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGoAI - Smart Guide of AI",
  description:
    "Your AI-powered companion for exploring and understanding Morocco",
  keywords: [
    "Morocco",
    "Travel",
    "AI Assistant",
    "Language Learning",
    "Cultural Guide",
    "Local Expert",
    "Darija",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${playfair.variable}`}
    >
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen bg-background">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
