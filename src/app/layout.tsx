import type { Metadata } from "next";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navFont = Plus_Jakarta_Sans({
  variable: "--font-nav",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nesh Tech Inc. — Build. Sell. Automate. Grow.",
  description:
    "Bangalore-built, AI-powered web, e-commerce, WhatsApp, and performance marketing for Indian SMBs. Launch fast, sell more, and automate growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${navFont.variable} antialiased`}>
        <CartProvider>
          <Navbar />
          {children}
          <ChatWidget />
          <WhatsAppButton />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
