"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PopAShot } from "@/components/game/PopAShot";

export default function PlayPage() {
  const { publicKey } = useWallet();
  const [score, setScore] = useState(0);

  const submitScore = async () => {
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
          <div className="text-sm opacity-80">Score: {score}</div>
        </div>
        <PopAShot durationSeconds={30} onScoreChange={setScore} />
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


