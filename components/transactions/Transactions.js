'use client'
import { useState, useMemo } from 'react'
import { parseAmount, toCSV } from '@/lib/transactions'
import { CATEGORIES, getCat, formatCurrency, formatDate, getCurrentMonth } from '@/lib/data'

function TransactionForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'food', description: '', date: new Date().toISOString().slice(0, 10) })
  const [error, setError] = useState('')
  const expenseCategories = CATEGORIES.filter(c => c.id !== 'income')

  const submit = () => {
    const amount = parseAmount(form.amount)
    if (amount === null || !form.description.trim() || !form.date) {
      setError('Enter a positive amount, description and date.')
      return
    }
    onAdd({ ...form, description: form.description.trim(), amount, id: crypto.randomUUID() })
    onClose()
  }

  return (
    <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5 mb-5 animate-scaleIn">
      <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-4">New Transaction</h3>
      <div className="space-y-3">
        {/* Type toggle */}
        <div className="flex gap-2">
          {['expense', 'income'].map(t => (
            <button key={t} onClick={() => setForm(p => ({ ...p, type: t, category: t === 'income' ? 'income' : 'food' }))}
              className={`flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all capitalize ${form.type === t ? (t === 'expense' ? 'bg-danger text-white' : 'bg-success text-white') : 'bg-gray-100 dark:bg-gray-800 text-muted'}`}>
              {t === 'expense' ? '💸 Expense' : '💰 Income'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-body font-semibold text-muted uppercase tracking-wide block mb-1">Amount</label>
            <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              className="w-full border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="text-xs font-body font-semibold text-muted uppercase tracking-wide block mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        </div>

        <div>
          <label className="text-xs font-body font-semibold text-muted uppercase tracking-wide block mb-1">Category</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="w-full border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
            {(form.type === 'income' ? CATEGORIES.filter(c => c.id === 'income') : expenseCategories).map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-body font-semibold text-muted uppercase tracking-wide block mb-1">Description</label>
          <input type="text" placeholder="What was this for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-full border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex gap-2 justify-end pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-body text-muted border border-border dark:border-border-dark">Cancel</button>
          <button onClick={submit} className="px-6 py-2 rounded-xl text-sm font-body font-semibold bg-brand text-white hover:bg-brand-light transition-colors">Add</button>
        </div>
      </div>
    </div>
  )
}

export default function Transactions({ transactions, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterCat, setFilterCat] = useState('all')
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth())
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType
      const matchCat = filterCat === 'all' || t.category === filterCat
      const matchMonth = !filterMonth || t.date?.startsWith(filterMonth)
      const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase())
      return matchType && matchCat && matchMonth && matchSearch
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, filterType, filterCat, filterMonth, search])

  const exportCSV = () => {
    const rows = [['Date', 'Type', 'Category', 'Description', 'Amount']]
    filtered.forEach(t => rows.push([t.date, t.type, getCat(t.category).label, t.description, t.amount]))
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'expenseiq-export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-sm font-body text-muted">{filtered.length} records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-3 py-2 rounded-xl text-sm font-body border border-border dark:border-border-dark text-muted hover:text-brand hover:border-brand transition-colors">📥 Export</button>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-sm font-body font-semibold bg-brand text-white hover:bg-brand-light transition-colors">+ Add</button>
        </div>
      </div>

      {showForm && <TransactionForm onAdd={onAdd} onClose={() => setShowForm(false)} />}

      {/* Filters */}
      <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="col-span-2 md:col-span-1 border border-border dark:border-border-dark rounded-xl px-3 py-2 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">All months</option>
            {Array.from({ length: 6 }, (_, i) => {
              const d = new Date(); d.setMonth(d.getMonth() - i)
              const key = d.toISOString().slice(0, 7)
              return <option key={key} value={key}>{d.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</option>
            })}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="border border-border dark:border-border-dark rounded-xl px-3 py-2 text-sm font-body bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted font-body">
            <div className="text-5xl mb-4">💳</div>
            <p className="font-semibold">No transactions found</p>
            <p className="text-sm mt-1">Add your first transaction above!</p>
          </div>
        )}
        {filtered.map((t, i) => {
          const cat = getCat(t.category)
          return (
            <div key={t.id} className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-4 flex items-center gap-4 animate-fadeUp hover:border-brand/30 transition-all group"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'both', opacity: 0 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: cat.pale }}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-gray-900 dark:text-white truncate">{t.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-body text-muted">{formatDate(t.date)}</span>
                  <span className="text-xs font-body px-1.5 py-0.5 rounded-full" style={{ backgroundColor: cat.pale, color: cat.color }}>{cat.label}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-display font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
              <button onClick={() => onDelete(t.id)} className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all text-sm ml-1">✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
