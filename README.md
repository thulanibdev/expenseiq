# ExpenseIQ

A personal finance dashboard for recording income, expenses and category budgets.

[Live demo](https://expenseiq-five.vercel.app/) · [Source](https://github.com/thulanibdev/expenseiq)

## Features

Transaction filtering, dashboard charts, budgets and CSV export.

Amounts must be positive. CSV exports preserve commas, quotes and newlines, and neutralise formula-like text.

## Stack and data

Next.js 14, React, Tailwind CSS and browser localStorage.

Browser-stored data belongs to the current browser profile. It does not sync to a user account, and clearing site data removes it. This is a portfolio project in ongoing development.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No API credentials are needed.

## Verification

```bash
npm test
npm run build
```

The tests cover the project's persistence or business logic and error cases. They do not validate third-party services or prove that every live-demo feature works.

## Development priorities

Improve accessibility, document design decisions and add integration coverage as the project develops. Keep secret keys in local environment configuration and out of Git.
