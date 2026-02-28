'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { SEED_TRANSACTIONS, SEED_BUDGETS } from '@/lib/data'

const Dashboard = dynamic(() => import('@/components/dashboard/Dashboard'), { ssr: false })
const Transactions = dynamic(() => import('@/components/transactions/Transactions'), { ssr: false })
const Charts = dynamic(() => import('@/components/charts/Charts'), { ssr: false })
const Budgets = dynamic(() => import('@/components/budgets/Budgets'), { ssr: false })

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'transactions', label: 'Transactions', icon: '💳' },
  { id: 'charts', label: 'Analytics', icon: '📈' },
  { id: 'budgets', label: 'Budgets', icon: '🎯' },
]

export default function Home() {
  const [transactions, setTransactions, txLoaded] = useLocalStorage('expenseiq-transactions', SEED_TRANSACTIONS)
  const [budgets, setBudgets] = useLocalStorage('expenseiq-budgets', SEED_BUDGETS)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('expenseiq-dark')
    if (saved === 'true') setDark(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('expenseiq-dark', dark)
  }, [dark, mounted])

  const addTransaction = (t) => setTransactions(prev => [t, ...prev])
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id))

  const now = new Date()
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'dark bg-bg-dark text-white' : 'bg-bg text-gray-900'}`}>
      {/* Sidebar + main layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 border-r border-border dark:border-border-dark bg-white dark:bg-surface-dark fixed h-full z-10">
          {/* Logo */}
          <div className="p-6 border-b border-border dark:border-border-dark">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-display font-bold text-sm">E</div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">ExpenseIQ</span>
            </div>
            <p className="text-xs font-body text-muted mt-1">{monthName}</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                  activeTab === tab.id ? 'bg-brand text-white' : 'text-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Dark mode + version */}
          <div className="p-4 border-t border-border dark:border-border-dark">
            <button onClick={() => setDark(d => !d)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <span>{dark ? '☀️' : '🌙'}</span>
              <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-56">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark px-4 md:px-8 py-4 flex items-center justify-between">
            <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">
              {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            {/* Mobile nav */}
            <div className="flex md:hidden gap-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`p-2 rounded-lg text-lg transition-all ${activeTab === tab.id ? 'bg-brand' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  {tab.icon}
                </button>
              ))}
            </div>
            <button onClick={() => setDark(d => !d)} className="hidden md:block text-xl hover:scale-110 transition-transform">
              {dark ? '☀️' : '🌙'}
            </button>
          </header>

          <div className="p-4 md:p-8">
            {!txLoaded ? (
              <div className="text-center py-20 text-muted font-body">Loading...</div>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard transactions={transactions} budgets={budgets} />}
                {activeTab === 'transactions' && <Transactions transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />}
                {activeTab === 'charts' && <Charts transactions={transactions} />}
                {activeTab === 'budgets' && <Budgets budgets={budgets} onUpdate={setBudgets} transactions={transactions} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
