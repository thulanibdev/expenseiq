'use client'
import { useState, useMemo } from 'react'
import { CATEGORIES, getCat, formatCurrency, getCurrentMonth } from '@/lib/data'

const EXPENSE_CATEGORIES = CATEGORIES.filter(c => c.id !== 'income')

export default function Budgets({ budgets, onUpdate, transactions }) {
  const [editing, setEditing] = useState(null)
  const [tempLimit, setTempLimit] = useState('')
  const currentMonth = getCurrentMonth()

  const spending = useMemo(() => {
    const monthExpenses = transactions.filter(t => t.type === 'expense' && t.date?.startsWith(currentMonth))
    const byCat = {}
    monthExpenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount })
    return byCat
  }, [transactions, currentMonth])

  const startEdit = (cat) => {
    const existing = budgets.find(b => b.category === cat.id)
    setTempLimit(existing?.limit?.toString() || '')
    setEditing(cat.id)
  }

  const saveEdit = (catId) => {
    const limit = parseFloat(tempLimit)
    if (!limit || limit <= 0) { setEditing(null); return }
    const newBudgets = budgets.filter(b => b.category !== catId)
    onUpdate([...newBudgets, { category: catId, limit }])
    setEditing(null)
  }

  const removeBudget = (catId) => {
    onUpdate(budgets.filter(b => b.category !== catId))
  }

  const totalBudget = budgets.reduce((a, b) => a + b.limit, 0)
  const totalSpent = budgets.reduce((a, b) => a + (spending[b.category] || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Budget Goals</h2>
          <p className="text-sm font-body text-muted">Set monthly spending limits per category</p>
        </div>
        {budgets.length > 0 && (
          <div className="text-right">
            <p className="text-sm font-body text-muted">Total budget</p>
            <p className="font-display font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
          </div>
        )}
      </div>

      {/* Overall progress */}
      {budgets.length > 0 && (
        <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-body font-semibold text-gray-900 dark:text-white">Overall Spending</span>
            <span className="font-body text-sm text-muted">{formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${totalSpent / totalBudget > 1 ? 'bg-danger' : totalSpent / totalBudget > 0.8 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }} />
          </div>
          <p className="text-xs font-body text-muted mt-1">{Math.round((totalSpent / totalBudget) * 100)}% of total budget used</p>
        </div>
      )}

      {/* Category budgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPENSE_CATEGORIES.map((cat, i) => {
          const budget = budgets.find(b => b.category === cat.id)
          const spent = spending[cat.id] || 0
          const pct = budget ? Math.min((spent / budget.limit) * 100, 100) : 0
          const over = budget && spent > budget.limit

          return (
            <div key={cat.id} className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 animate-fadeUp"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both', opacity: 0 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: cat.pale }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-gray-900 dark:text-white">{cat.label}</p>
                    {budget && <p className="text-xs font-body text-muted">Limit: {formatCurrency(budget.limit)}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(cat)} className="text-xs font-body px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-muted hover:text-brand transition-colors">
                    {budget ? 'Edit' : '+ Set'}
                  </button>
                  {budget && <button onClick={() => removeBudget(cat.id)} className="text-xs font-body px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-muted hover:text-danger transition-colors">✕</button>}
                </div>
              </div>

              {editing === cat.id ? (
                <div className="flex gap-2 mt-2">
                  <input type="number" value={tempLimit} onChange={e => setTempLimit(e.target.value)} placeholder="Monthly limit..." autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditing(null) }}
                    className="flex-1 border border-border dark:border-border-dark rounded-lg px-3 py-1.5 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <button onClick={() => saveEdit(cat.id)} className="px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-body font-semibold">Save</button>
                </div>
              ) : budget ? (
                <div className="mt-2">
                  <div className="flex justify-between text-xs font-body mb-1">
                    <span className={over ? 'text-danger font-semibold' : 'text-muted'}>{formatCurrency(spent)} spent</span>
                    <span className={over ? 'text-danger' : 'text-muted'}>{over ? `${formatCurrency(spent - budget.limit)} over!` : `${formatCurrency(budget.limit - spent)} left`}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : pct > 80 ? '#f59e0b' : cat.color }} />
                  </div>
                </div>
              ) : (
                <p className="text-xs font-body text-muted mt-1">No budget set — click "+ Set" to add one</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
