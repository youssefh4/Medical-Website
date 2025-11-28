import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AIChat from "@/components/AIChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical Profile - Patient Health Records",
  description: "Manage your medical records, scans, and health information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AIChat />
      </body>
    </html>
  );
}

