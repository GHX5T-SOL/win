import { NextRequest, NextResponse } from "next/server";
import { createRedis } from "../../../../lib/redis";

function startOfUTCDay(d = new Date()) {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  return day.toISOString().split("T")[0];
}

export async function GET() {
  const redis = createRedis();
  if (!redis) return NextResponse.json({ scores: [] });
  try {
    await redis.connect();
    const key = `leaderboard:${startOfUTCDay()}`;
    const rawScores = await redis.zrevrange(key, 0, 9, "WITHSCORES");
    const scores = [] as { address: string; score: number }[];
    for (let i = 0; i < rawScores.length; i += 2) {
      const member = rawScores[i] as string;
      const score = Number(rawScores[i + 1]);
      const [address] = member.split(":");
      scores.push({ address, score });
    }
    return NextResponse.json({ scores });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ scores: [] });
  } finally {
    try { await redis.quit(); } catch {}
  }
}

export async function POST(req: NextRequest) {
  const redis = createRedis();
  if (!redis) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  try {
    const body = await req.json();
    const address: string = (body?.address || "guest").toString();
    const score: number = Number(body?.score || 0);
    if (!Number.isFinite(score) || score < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }
    await redis.connect();
    const key = `leaderboard:${startOfUTCDay()}`;
    const member = `${address}:${Date.now()}`;
    await redis.zadd(key, score, member);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  } finally {
    try { await redis.quit(); } catch {}
  }
}


