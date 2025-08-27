<div align="center">

  <a href="https://dogwincoin.vercel.app"><img src="https://i.ibb.co/YBKYJ9BT/dogwincoin.png" alt="Just Dog It ($WIN)" width="640"/></a>

  <br/>
  <br/>

  <a href="https://dogwincoin.vercel.app">
    <img alt="Site" src="https://img.shields.io/badge/site-dogwincoin.vercel.app-34D399?logo=vercel&logoColor=white"/>
  </a>
  <a href="https://vercel.com">
    <img alt="Deploy" src="https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white"/>
  </a>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white"/>
  <img alt="Solana" src="https://img.shields.io/badge/Solana-mainnet-9945FF?logo=solana&logoColor=white"/>
  <img alt="License" src="https://img.shields.io/badge/License-MIT-16a34a"/>

  <br/>
  <br/>

  <a href="https://t.me/dogwincoin">
    <img alt="Telegram" src="https://img.shields.io/badge/Telegram-@dogwincoin-2CA5E0?logo=telegram&logoColor=white"/>
  </a>
  <a href="https://x.com/dogwincoin">
    <img alt="X (Twitter)" src="https://img.shields.io/badge/X-@dogwincoin-000000?logo=x&logoColor=white"/>
  </a>

</div>

---

# 🐶 Just Dog It ($WIN)

Gritty Solana memecoin with a fast, mobile‑friendly arcade mini‑game and a daily leaderboard. Just Dog It.

## ✨ Features
- 🔐 Wallet connect (Phantom, Solflare)
- 🏀 Pop‑A‑Shot canvas mini‑game (mobile + desktop)
- 👑 Daily leaderboard (top 10), with in‑memory fallback
- 🎁 Daily prizes: Top 3 on the leaderboard win $WIN
- 📱 Fully responsive, gritty street‑court theme

## 🔗 Links
- 🌐 Website: https://dogwincoin.vercel.app
- 💬 Telegram: https://t.me/dogwincoin
- 🐦 X (Twitter): https://x.com/dogwincoin

## 🧱 Tech Stack
- Next.js 15, TypeScript, Tailwind CSS
- Solana Wallet Adapter (React UI)
- API routes for leaderboard: `@vercel/postgres` with memory fallback

## 🚀 Getting Started
1) Install
```bash
npm i
```
2) Dev
```bash
npm run dev
```
3) Environment (optional)
Create `.env.local` for custom RPC:
```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

## 📦 Deploy (Vercel)
- Import repo in Vercel
- Root: `win-web`
- Build: `npm run build`
- Output: `.next`

## 🕹️ Game & Leaderboard
- Game entry: `/play`
- Leaderboard API: `src/app/api/leaderboard/route.ts`
- Client leaderboard: `src/components/Leaderboard.tsx`

On‑chain leaderboard is planned; current version stores daily scores in Postgres (if configured) with memory fallback.

## 🖼️ Assets
- App images in `public/assets`
- Logo: managed externally and referenced by URL

## 🤝 Contributing
PRs welcome! Open an issue for ideas, bugs, or asset contributions.

## ⚖️ License
MIT
