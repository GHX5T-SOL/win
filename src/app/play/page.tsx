"use client";

import React, { useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { BasketballGame } from "@/components/BasketballGame";

export default function PlayPage() {
  const { publicKey } = useWallet();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<HTMLSpanElement | null>(null);
  const finalScoreRef = useRef<HTMLSpanElement | null>(null);
  const gameOverRef = useRef<HTMLDivElement | null>(null);
  const restartBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (
      containerRef.current &&
      scoreRef.current &&
      timerRef.current &&
      finalScoreRef.current &&
      gameOverRef.current &&
      restartBtnRef.current
    ) {
      // Initialize the game here if needed, but since component handles it, remove old init
    }
    return () => {
      // Destroy handled by component
    };
  }, []);

  const submitScore = async () => {
    const scoreText = scoreRef.current?.textContent || "0";
    const score = Number(scoreText) || 0;
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: publicKey ? publicKey.toBase58() : "guest",
          score,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit score");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Street Shot</h1>
          <div className="text-sm opacity-80">Score: <span ref={scoreRef}>0</span></div>
        </div>
        <div className="mb-3 text-xs md:text-sm opacity-80">Game is still under development, watch this page for live updates.</div>
        <div className="relative w-full rounded-xl overflow-hidden border bg-black h-[600px]">
          <BasketballGame
            uiRefs={{
              scoreEl: scoreRef.current!,
              timerEl: timerRef.current!,
              finalScoreEl: finalScoreRef.current!,
              gameOverEl: gameOverRef.current!,
              restartBtn: restartBtnRef.current!,
            }}
          />
          {/* Remove trajectory canvas */}
          <div className="absolute top-3 left-3 text-sm bg-black/50 px-2 py-1 rounded">
            Time: <span ref={timerRef}>2:00</span>
          </div>
          <div ref={gameOverRef} className="hidden absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-xl font-semibold mb-2">Game Over!</h2>
            <div className="mb-3">Final Score: <span ref={finalScoreRef}>0</span></div>
            <button ref={restartBtnRef} className="rounded-full border px-4 py-2">Restart</button>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <a className="rounded-full border px-4 py-2" href="#leaderboard">Leaderboard</a>
          <button
            className="rounded-full border px-4 py-2 disabled:opacity-50"
            onClick={submitScore}
            title="Submit to leaderboard"
          >
            Submit score
          </button>
        </div>
      </div>
    </div>
  );
}


