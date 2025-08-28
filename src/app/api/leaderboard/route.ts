import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../lib/redis"; // Adjust path as needed

function startOfUTCDay(d = new Date()) {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  return day.toISOString().split("T")[0]; // e.g., "2023-10-01"
}

export async function GET() {
  try {
    const key = `leaderboard:${startOfUTCDay()}`;
    const rawScores = await redis.zrevrange(key, 0, 9, "WITHSCORES");
    const scores = [];
    for (let i = 0; i < rawScores.length; i += 2) {
      const member = rawScores[i];
      const score = Number(rawScores[i + 1]);
      const [address] = member.split(":"); // Extract address from member
      scores.push({ address, score });
    }
    return NextResponse.json({ scores });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ scores: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address: string = (body?.address || "guest").toString();
    const score: number = Number(body?.score || 0);
    if (!Number.isFinite(score) || score < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }
    const key = `leaderboard:${startOfUTCDay()}`;
    const member = `${address}:${Date.now()}`;
    await redis.zadd(key, score, member);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


