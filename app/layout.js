import './globals.css'

export const metadata = {
  title: 'ExpenseIQ — Smart Personal Finance',
  description: 'Track expenses, set budgets, and get smart insights into your spending.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
