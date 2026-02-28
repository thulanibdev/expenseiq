'use client'
import { useMemo } from 'react'
import { formatCurrency, getCat, getCurrentMonth, generateInsights } from '@/lib/data'

function StatCard({ label, value, sub, color, icon, delay = 0 }) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark animate-fadeUp" style={{ animationDelay: `${delay}ms`, animationFillMode: 'both', opacity: 0 }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-body font-semibold px-2 py-1 rounded-full ${color}`}>{sub}</span>
      </div>
      <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm font-body text-muted mt-1">{label}</div>
    </div>
  )
}

function InsightCard({ insight, delay }) {
  const colors = {
    danger: 'bg-danger-pale border-danger/20 text-danger',
    warning: 'bg-warning-pale border-warning/20 text-warning',
    success: 'bg-success-pale border-success/20 text-success',
    info: 'bg-brand-pale border-brand/20 text-brand',
  }
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border animate-slideIn ${colors[insight.type]}`} style={{ animationDelay: `${delay}ms`, animationFillMode: 'both', opacity: 0 }}>
      <span className="text-lg flex-shrink-0">{insight.icon}</span>
      <p className="text-sm font-body">{insight.text}</p>
    </div>
  )
}

export default function Dashboard({ transactions, budgets }) {
  const currentMonth = getCurrentMonth()

  const stats = useMemo(() => {
    const monthTx = transactions.filter(t => t.date?.startsWith(currentMonth))
    const income = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expenses = monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const balance = income - expenses
    const allExpenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return { income, expenses, balance, allExpenses, count: monthTx.length }
  }, [transactions, currentMonth])

  const insights = useMemo(() => generateInsights(transactions, budgets), [transactions, budgets])

  // Category breakdown for this month
  const breakdown = useMemo(() => {
    const monthExpenses = transactions.filter(t => t.type === 'expense' && t.date?.startsWith(currentMonth))
    const byCat = {}
    monthExpenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount })
    return Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [transactions, currentMonth])

  const totalBreakdown = breakdown.reduce((a, [, v]) => a + v, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💰" label="Income this month" value={formatCurrency(stats.income)} sub="Earned" color="bg-success-pale text-success" delay={0} />
        <StatCard icon="💸" label="Spent this month" value={formatCurrency(stats.expenses)} sub="Spent" color="bg-danger-pale text-danger" delay={80} />
        <StatCard icon="🏦" label="Net balance" value={formatCurrency(stats.balance)} sub={stats.balance >= 0 ? 'Saved' : 'Deficit'} color={stats.balance >= 0 ? 'bg-success-pale text-success' : 'bg-danger-pale text-danger'} delay={160} />
        <StatCard icon="📝" label="Transactions" value={stats.count} sub="This month" color="bg-brand-pale text-brand" delay={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
          {breakdown.length === 0 ? (
            <p className="text-muted text-sm font-body text-center py-8">No expenses this month yet.</p>
          ) : (
            <div className="space-y-3">
              {breakdown.map(([catId, amount]) => {
                const cat = getCat(catId)
                const pct = totalBreakdown > 0 ? (amount / totalBreakdown) * 100 : 0
                return (
                  <div key={catId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="text-sm font-body text-gray-700 dark:text-gray-300">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-body font-semibold text-gray-900 dark:text-white">{formatCurrency(amount)}</span>
                        <span className="text-xs font-body text-muted">{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-border dark:border-border-dark">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">💡 Smart Insights</h3>
          {insights.length === 0 ? (
            <p className="text-muted text-sm font-body text-center py-8">Add more transactions to get personalized insights!</p>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, i) => <InsightCard key={i} insight={insight} delay={i * 80} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
