# 💰 ExpenseIQ — Smart Personal Finance Dashboard

A full-featured personal finance tracker built with **Next.js 14** and **Tailwind CSS**. No backend or API keys needed — everything saves locally in your browser.

## Features

- **📊 Dashboard** — Monthly overview with income, expenses, balance, and category breakdown
- **💳 Transactions** — Add, filter, search, and delete transactions. Export to CSV.
- **📈 Analytics** — Custom SVG bar chart (income vs expenses) and pie chart (spending breakdown) built from scratch — no chart library needed
- **🎯 Budget Goals** — Set monthly limits per category with progress bars and overspending alerts
- **💡 Smart Insights** — Automatic tips based on your spending patterns
- **🌙 Dark Mode** — Full dark/light mode toggle
- **📱 Responsive** — Works on mobile, tablet, and desktop

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/expenseiq.git
cd expenseiq
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — loads with sample data so you can explore right away!

## Deploy to Vercel

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Click Deploy — no environment variables needed!

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | React framework |
| Tailwind CSS | Styling + dark mode |
| SVG | Custom charts (no library!) |
| localStorage | Data persistence |
| Vercel | Deployment |

## What Makes This Impressive

- **Custom SVG charts** — pie chart and bar chart written entirely from scratch using SVG math, no Recharts or Chart.js
- **Smart insights engine** — analyzes spending patterns and generates personalized tips
- **CSV export** — real file download functionality
- **Dark mode** — persisted preference across sessions
- **Production architecture** — clean component structure, custom hooks, separated data layer

## License

MIT
