"use client";

import React, { useEffect, useRef, useState } from "react";

type PopAShotProps = {
  durationSeconds?: number;
  onScoreChange?: (score: number) => void;
  onEnd?: (finalScore: number) => void;
};

type Vec2 = { x: number; y: number };

export function PopAShot({ durationSeconds = 30, onScoreChange, onEnd }: PopAShotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Physics state
  const ballPos = useRef<Vec2>({ x: 0, y: 0 });
  const ballVel = useRef<Vec2>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef<Vec2 | null>(null);
  const lastBallBelowRim = useRef(false);

  // Assets
  const imgCourt = useRef<HTMLImageElement | null>(null);
  const imgBall = useRef<HTMLImageElement | null>(null);
  const imgRim = useRef<HTMLImageElement | null>(null);
  const imgNet = useRef<HTMLImageElement | null>(null);

  // Layout
  const logical = { width: 640, height: 480 };
  const rim = { x: 320, y: 140, radius: 22 };
  const ballRadius = 14;

  useEffect(() => {
    const court = new Image();
    court.src = "/assets/court-bg.svg";
    const ball = new Image();
    ball.src = "/assets/ball-256.svg";
    const rimImg = new Image();
    rimImg.src = "/assets/rim-front.svg";
    const netImg = new Image();
    netImg.src = "/assets/net-overlay.svg";

    let loaded = 0;
    const check = () => {
      loaded += 1;
      if (loaded >= 4) {
        imgCourt.current = court;
        imgBall.current = ball;
        imgRim.current = rimImg;
        imgNet.current = netImg;
        setReady(true);
      }
    };
    court.onload = check; ball.onload = check; rimImg.onload = check; netImg.onload = check;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current!;
    // HiDPI setup
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = logical.width * dpr;
    canvas.height = logical.height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = `${(logical.height / logical.width) * 100}%`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Reset round
    setScore(0);
    setTimeLeft(durationSeconds);
    setIsRunning(true);
    ballPos.current = { x: logical.width * 0.25, y: logical.height - 40 };
    ballVel.current = { x: 0, y: 0 };
    lastBallBelowRim.current = false;

    const gravity = 0.55;

    const draw = () => {
      // Update
      if (isRunning) {
        ballPos.current = {
          x: ballPos.current.x + ballVel.current.x,
          y: ballPos.current.y + ballVel.current.y,
        };
        ballVel.current = { x: ballVel.current.x * 0.992, y: ballVel.current.y + gravity };

        // Basic collisions with bounds
        if (ballPos.current.x < ballRadius) {
          ballPos.current.x = ballRadius; ballVel.current.x *= -0.6;
        } else if (ballPos.current.x > logical.width - ballRadius) {
          ballPos.current.x = logical.width - ballRadius; ballVel.current.x *= -0.6;
        }
        if (ballPos.current.y > logical.height - ballRadius) {
          ballPos.current.y = logical.height - ballRadius; ballVel.current.y *= -0.45;
          // friction on floor
          ballVel.current.x *= 0.9;
        }

        // Scoring detection: crossing through rim circle from above to below near center
        const dx = ballPos.current.x - rim.x;
        const dy = ballPos.current.y - rim.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const within = dist < rim.radius - 2;
        const currentlyBelow = ballPos.current.y > rim.y;
        if (within && currentlyBelow && !lastBallBelowRim.current && ballVel.current.y > 0) {
          setScore((s) => {
            const next = s + 1;
            onScoreChange?.(next);
            return next;
          });
          // Reset for next shot
          ballPos.current = { x: logical.width * 0.25, y: logical.height - 40 };
          ballVel.current = { x: 0, y: 0 };
        }
        lastBallBelowRim.current = currentlyBelow;
      }

      // Render
      ctx.clearRect(0, 0, logical.width, logical.height);
      if (imgCourt.current) {
        ctx.drawImage(imgCourt.current, 0, 0, logical.width, logical.height);
      } else {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, logical.width, logical.height);
      }

      // Rim and net (back-to-front layering)
      if (imgRim.current) {
        ctx.save();
        ctx.translate(rim.x - 50, rim.y - 50);
        ctx.drawImage(imgRim.current, 0, 0, 100, 100);
        ctx.restore();
      }

      // Ball
      if (imgBall.current) {
        ctx.save();
        ctx.translate(ballPos.current.x - ballRadius, ballPos.current.y - ballRadius);
        ctx.drawImage(imgBall.current, 0, 0, ballRadius * 2, ballRadius * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = "#f4a261";
        ctx.beginPath();
        ctx.arc(ballPos.current.x, ballPos.current.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (imgNet.current) {
        ctx.save();
        ctx.translate(rim.x - 50, rim.y - 10);
        ctx.drawImage(imgNet.current, 0, 0, 100, 120);
        ctx.restore();
      }

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(12, 12, 120, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Time: ${timeLeft}s`, 20, 60);

      animationRef.current = requestAnimationFrame(draw);
    };
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isRunning, timeLeft, score]);

  // Timer
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      onEnd?.(score);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [isRunning, timeLeft, score, onEnd]);

  // Input handlers
  const canvasHandlers = {
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isRunning) return;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      isDragging.current = true;
      dragStart.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isRunning || !isDragging.current || !dragStart.current) return;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const dx = (dragStart.current.x - end.x) * 0.22;
      const dy = (dragStart.current.y - end.y) * 0.22;
      ballVel.current = { x: dx, y: dy };
      isDragging.current = false; dragStart.current = null;
    },
    onMouseLeave: () => { isDragging.current = false; dragStart.current = null; },
    onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isRunning) return;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const t = e.touches[0];
      isDragging.current = true;
      dragStart.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    },
    onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isRunning || !isDragging.current || !dragStart.current) return;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const t = e.changedTouches[0];
      const end = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      const dx = (dragStart.current.x - end.x) * 0.22;
      const dy = (dragStart.current.y - end.y) * 0.22;
      ballVel.current = { x: dx, y: dy };
      isDragging.current = false; dragStart.current = null;
    },
  } as const;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">🏀 Pop‑A‑Shot</div>
        <div className="text-sm opacity-80">Score: {score} · Time: {timeLeft}s</div>
      </div>
      <div className="rounded-xl overflow-hidden border bg-black">
        <div className="relative w-full" style={{ aspectRatio: `${logical.width}/${logical.height}` }}>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" {...canvasHandlers} />
        </div>
      </div>
    </div>
  );
}


