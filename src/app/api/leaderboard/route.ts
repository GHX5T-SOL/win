import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Placeholder in-memory scores (replace with on-chain or DB later)
const demoScores = [
  { address: "5K3...dog", score: 9 },
  { address: "9sP...win", score: 7 },
  { address: "C2a...it!", score: 4 },
];

async function ensureTable() {
  try {
    await sql`
      create table if not exists leaderboard_scores (
        id bigserial primary key,
        address text not null,
        score integer not null,
        created_at timestamptz not null default now()
      );
    `;
  } catch {
    // ignore
  }
}

function startOfUTCDay(d = new Date()) {
  const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  return day.toISOString();
}

export async function GET() {
  // Try DB first
  try {
    await ensureTable();
    const start = startOfUTCDay();
    const { rows } = await sql<{ address: string; score: number }>`
      select address, score
      from leaderboard_scores
      where created_at >= ${start}
      order by score desc, created_at asc
      limit 10
    `;
    return NextResponse.json({ scores: rows, source: "db" });
  } catch {
    // Fallback to memory
    const fallback = [...demoScores].sort((a, b) => b.score - a.score).slice(0, 10);
    return NextResponse.json({ scores: fallback, source: "memory" });
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
    // Try DB first
    try {
      await ensureTable();
      await sql`insert into leaderboard_scores (address, score) values (${address}, ${score});`;
      return NextResponse.json({ ok: true });
    } catch {
      // Fallback to memory
      demoScores.push({ address, score });
      demoScores.sort((a, b) => b.score - a.score);
      demoScores.splice(10);
      return NextResponse.json({ ok: true, scores: demoScores });
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


