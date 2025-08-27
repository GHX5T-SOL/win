"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

type Vec2 = { x: number; y: number };

export default function PlayPage() {
  const { publicKey } = useWallet();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vec2 | null>(null);
  const [velocity, setVelocity] = useState<Vec2>({ x: 0, y: 0 });
  const [ballPos, setBallPos] = useState<Vec2>({ x: 160, y: 420 });
  const [hoopPos] = useState<Vec2>({ x: 280, y: 140 });

  // Simple loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const radius = 12;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Court bg
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#222";
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

      // Hoop
      ctx.strokeStyle = "#ff6139";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(hoopPos.x, hoopPos.y, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Rim guide
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(hoopPos.x, hoopPos.y);
      ctx.lineTo(hoopPos.x, canvas.height);
      ctx.stroke();

      // Ball
      ctx.fillStyle = "#f4a261";
      ctx.beginPath();
      ctx.arc(ballPos.x, ballPos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Drag vector
      if (isDragging && dragStart) {
        ctx.strokeStyle = "#fff";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ballPos.x, ballPos.y);
        ctx.lineTo(dragStart.x, dragStart.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, [ballPos, isDragging, dragStart, hoopPos]);

  // Physics update
  useEffect(() => {
    const id = setInterval(() => {
      setBallPos((p) => ({ x: p.x + velocity.x, y: p.y + velocity.y }));
      setVelocity((v) => ({ x: v.x * 0.99, y: v.y + 0.5 }));
    }, 16);
    return () => clearInterval(id);
  }, [velocity.x, velocity.y]);

  // Scoring detection
  useEffect(() => {
    const dx = ballPos.x - hoopPos.x;
    const dy = ballPos.y - hoopPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 16) {
      setScore((s) => s + 1);
      setBallPos({ x: 160, y: 420 });
      setVelocity({ x: 0, y: 0 });
    }
  }, [ballPos, hoopPos]);

  const startDrag = (x: number, y: number) => {
    setIsDragging(true);
    setDragStart({ x, y });
  };
  const endDrag = (x: number, y: number) => {
    if (!dragStart || shots <= 0) return setIsDragging(false);
    const dx = (dragStart.x - x) * 0.2;
    const dy = (dragStart.y - y) * 0.2;
    setVelocity({ x: dx, y: dy });
    setShots((n) => Math.max(0, n - 1));
    setIsDragging(false);
  };

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
      // reset round
      setScore(0);
      setShots(5);
      setBallPos({ x: 160, y: 420 });
      setVelocity({ x: 0, y: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Street Shot</h1>
          <div className="text-sm opacity-80">Score: {score} · Shots: {shots}</div>
        </div>
        <div className="rounded-xl overflow-hidden border bg-black">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-auto touch-none"
            onMouseDown={(e) => startDrag(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
            onMouseUp={(e) => endDrag(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => {
              const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
              const t = e.touches[0];
              startDrag(t.clientX - rect.left, t.clientY - rect.top);
            }}
            onTouchEnd={(e) => {
              const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
              const t = e.changedTouches[0];
              endDrag(t.clientX - rect.left, t.clientY - rect.top);
            }}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            className="rounded-full border px-4 py-2"
            onClick={() => {
              setScore(0);
              setShots(5);
              setBallPos({ x: 160, y: 420 });
              setVelocity({ x: 0, y: 0 });
            }}
          >
            Reset
          </button>
          <a className="rounded-full border px-4 py-2" href="#leaderboard">Leaderboard</a>
          <button
            className="rounded-full border px-4 py-2 disabled:opacity-50"
            onClick={submitScore}
            disabled={shots > 0}
            title={shots > 0 ? "Use all shots before submitting" : "Submit to leaderboard"}
          >
            Submit score
          </button>
        </div>
      </div>
    </div>
  );
}


