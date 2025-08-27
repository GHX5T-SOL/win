import Link from "next/link";
import React from "react";

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

export function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm opacity-80">Daily prizes: Top 3 on the leaderboard win $WIN.</div>
        <div className="flex items-center gap-4">
          <Link href="https://t.me/dogwincoin" target="_blank" aria-label="Telegram" className="opacity-80 hover:opacity-100">
            <TelegramIcon className="w-5 h-5" />
          </Link>
          <Link href="https://x.com/dogwincoin" target="_blank" aria-label="X" className="opacity-80 hover:opacity-100">
            <XIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}


