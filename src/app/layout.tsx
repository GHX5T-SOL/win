import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProviders } from "@/components/solana/WalletProviders";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Just Dog It ($WIN)",
  description: "Gritty Solana memecoin. Shoot your shot. Just Dog It.",
  metadataBase: new URL("https://win.vercel.app"),
  openGraph: {
    title: "Just Dog It ($WIN)",
    description: "Gritty Solana memecoin. Shoot your shot.",
    images: [
      {
        url: "/assets/just-dog-it-slogan-with-nike-logo.svg",
        width: 1200,
        height: 630,
        alt: "Just Dog It $WIN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Just Dog It ($WIN)",
    description: "Gritty Solana memecoin. Shoot your shot.",
    images: ["/assets/just-dog-it-slogan-with-nike-logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="fixed inset-0 pointer-events-none grit-anim" />
        <WalletProviders>
          <NavBar />
          {children}
          <Footer />
        </WalletProviders>
      </body>
    </html>
  );
}
