"use client";

import React, { useEffect, useState } from "react";

type Entry = { address: string; score: number };

export function Leaderboard() {
  const [scores, setScores] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        const data = await res.json();
        setScores(data.scores || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div id="leaderboard" className="rounded-2xl border p-6 bg-white/40 dark:bg-black/20 backdrop-blur">
      <h3 className="text-xl font-semibold mb-4">Leaderboard (demo)</h3>
      {loading ? (
        <div className="opacity-70">Loading...</div>
      ) : (
        <ul className="space-y-2">
          {scores.map((s, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="font-mono opacity-80">{s.address}</span>
              <span className="font-semibold">{s.score}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


