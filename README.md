Just Dog It ($WIN) — Solana memecoin site with wallet connect, arcade mini-game, and leaderboard (demo).

## Getting started

1. Install deps
```bash
npm i
```
2. Dev
```bash
npm run dev
```
3. Env (optional)
Create `.env.local` if you want a custom RPC:
```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

## Deploy (Vercel)
- Push to a Git repo and import the project in Vercel
- Root directory: `win-web`
- Build command: `npm run build`
- Output: `.next`

## Notes
- Assets in `public/assets`
- Replace placeholders (Contract, Pump.Fun, DexScreener) in `src/app/page.tsx`
- Leaderboard API is in-memory: `src/app/api/leaderboard/route.ts`
