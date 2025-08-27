"use client";

import Link from "next/link";
import Image from "next/image";
import { WalletButton } from "@/components/WalletButton";
import React, { useState } from "react";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21l-7.5 8.568L22.5 22h-6.94l-5.01-5.91L4.5 22H2l8.064-9.208L1.5 2h7.03l4.53 5.348L18.244 2Zm-2.442 18h1.83L7.26 4h-1.8l10.342 16Z"/>
    </svg>
  );
}

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.04 15.47l-.36 5.06c.52 0 .74-.22 1-.48l2.4-2.3 4.98 3.65c.91.51 1.56.24 1.81-.84l3.28-15.39h.01c.29-1.36-.49-1.9-1.39-1.57L1.64 9.56C.31 10.08.33 10.86 1.42 11.2l5.46 1.7 12.66-7.98c.59-.36 1.13-.16.69.2L9.04 15.47z"/>
    </svg>
  );
}

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  );
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-black/40 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/assets/nike-logo.svg" alt="WIN" width={28} height={28} />
          <Link href="/" className="font-semibold">Just Dog It ($WIN)</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/play" className="hover:underline">Play</Link>
            <Link href="#leaderboard" className="hover:underline">Leaderboard</Link>
            <Link href="https://t.me/dogwincoin" target="_blank" aria-label="Telegram" className="opacity-80 hover:opacity-100">
              <TelegramIcon className="w-5 h-5" />
            </Link>
            <Link href="https://x.com/dogwincoin" target="_blank" aria-label="X" className="opacity-80 hover:opacity-100">
              <XIcon className="w-5 h-5" />
            </Link>
          </div>
          <WalletButton />
          <button className="md:hidden rounded border px-2 py-2" aria-label="Menu" onClick={() => setOpen(v => !v)}>
            <BurgerIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-3 border-t bg-white/60 dark:bg-black/40">
          <Link href="/play" className="pt-3">Play</Link>
          <Link href="#leaderboard">Leaderboard</Link>
          <div className="flex items-center gap-3">
            <Link href="https://t.me/dogwincoin" target="_blank" aria-label="Telegram" className="opacity-80 hover:opacity-100">
              <TelegramIcon className="w-5 h-5" />
            </Link>
            <Link href="https://x.com/dogwincoin" target="_blank" aria-label="X" className="opacity-80 hover:opacity-100">
              <XIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}


