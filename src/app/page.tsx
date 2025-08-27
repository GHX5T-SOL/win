"use client";
import Image from "next/image";
import Link from "next/link";
import { Leaderboard } from "@/components/Leaderboard";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[url('/assets/just-dog-it-slogan-with-nike-logo.svg')] bg-no-repeat bg-[length:600px_auto] bg-right-top court-bg">

      <main className="px-6 py-10 grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold max-w-xl">
            <span className="inline-flex items-center gap-3">
              <span>Just Dog It.</span>
              <Image src="/assets/nike-logo.svg" alt="Nike" width={44} height={44} className="h-8 w-8 md:h-11 md:w-11" />
            </span>
          </h1>
          <p className="text-base md:text-lg max-w-xl opacity-80">
            $WIN — the memecoin that goes hard in the paint. Join the pack and Just Dog It.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <button
              className="rounded-full border px-5 py-3 text-center hover:bg-black hover:text-white transition"
              onClick={() => navigator.clipboard.writeText("TBD-CONTRACT-ADDRESS").catch(() => {})}
              title="Copy contract address"
            >
              Contract: Copy
            </button>
            <Link className="rounded-full border px-5 py-3 text-center hover:bg-black hover:text-white transition" href="#" target="_blank">
              Pump.Fun: TBD
            </Link>
            <Link className="rounded-full border px-5 py-3 text-center hover:bg-black hover:text-white transition" href="#" target="_blank">
              DexScreener: TBD
            </Link>
            <Link className="rounded-full border px-5 py-3 text-center hover:bg-black hover:text-white transition" href="https://t.me/dogwincoin" target="_blank">
              Telegram
            </Link>
            <Link className="rounded-full border px-5 py-3 text-center hover:bg-black hover:text-white transition" href="https://x.com/dogwincoin" target="_blank">
              X (Twitter)
            </Link>
          </div>
          <div className="mt-3 text-sm opacity-80">Daily prizes: Top 3 on the leaderboard win $WIN.</div>
        </div>
        <div className="flex justify-center lg:justify-end -ml-8 md:-ml-16 lg:-ml-24 xl:-ml-28">
          <Image src="/assets/dog-picture.svg" alt="$WIN Dog" width={500} height={500} className="drop-shadow-xl" />
        </div>
      </main>

      <section className="px-6 pb-16">
        <div className="rounded-2xl border p-6 md:p-8 bg-white/40 dark:bg-black/20 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-2">🏀 Arcade: Street Shot</h2>
          <p className="mb-4 opacity-80">Simple basketball toss mini-game (mobile + desktop). Play for fun, wallet optional.</p>
          <div className="flex gap-3">
            <Link className="rounded-full border px-5 py-3 hover:bg-black hover:text-white transition" href="/play">Play now</Link>
            <Link className="rounded-full border px-5 py-3 hover:bg-black hover:text-white transition" href="#leaderboard">Leaderboard</Link>
          </div>
        </div>
      </section>
      <section className="px-6 pb-24">
        <Leaderboard />
      </section>
    </div>
  );
}
