export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍔', color: '#f97316', pale: '#fff7ed' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#3b82f6', pale: '#eff6ff' },
  { id: 'housing', label: 'Housing', icon: '🏠', color: '#8b5cf6', pale: '#f5f3ff' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ec4899', pale: '#fdf2f8' },
  { id: 'health', label: 'Health', icon: '💊', color: '#10b981', pale: '#ecfdf5' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#f59e0b', pale: '#fffbeb' },
  { id: 'education', label: 'Education', icon: '📚', color: '#06b6d4', pale: '#ecfeff' },
  { id: 'utilities', label: 'Utilities', icon: '💡', color: '#64748b', pale: '#f8fafc' },
  { id: 'income', label: 'Income', icon: '💰', color: '#10b981', pale: '#ecfdf5' },
  { id: 'other', label: 'Other', icon: '📦', color: '#6366f1', pale: '#eef2ff' },
]

export const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount)

export const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const getMonthKey = (dateStr) => dateStr?.slice(0, 7)
export const getCurrentMonth = () => new Date().toISOString().slice(0, 7)

export const SEED_TRANSACTIONS = [
  { id: 1, type: 'income', amount: 3200, category: 'income', description: 'Monthly Salary', date: new Date().toISOString().slice(0, 10) },
  { id: 2, type: 'expense', amount: 850, category: 'housing', description: 'Rent', date: new Date().toISOString().slice(0, 10) },
  { id: 3, type: 'expense', amount: 120, category: 'food', description: 'Groceries', date: new Date().toISOString().slice(0, 10) },
  { id: 4, type: 'expense', amount: 45, category: 'transport', description: 'Uber rides', date: new Date().toISOString().slice(0, 10) },
  { id: 5, type: 'expense', amount: 29.99, category: 'entertainment', description: 'Netflix & Spotify', date: new Date().toISOString().slice(0, 10) },
  { id: 6, type: 'expense', amount: 67, category: 'food', description: 'Restaurant dinner', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
  { id: 7, type: 'expense', amount: 200, category: 'shopping', description: 'Clothing', date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10) },
  { id: 8, type: 'income', amount: 500, category: 'income', description: 'Freelance project', date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10) },
]

export const SEED_BUDGETS = [
  { category: 'food', limit: 400 },
  { category: 'transport', limit: 150 },
  { category: 'entertainment', limit: 100 },
  { category: 'shopping', limit: 300 },
]

export function generateInsights(transactions, budgets) {
  const insights = []
  const expenses = transactions.filter(t => t.type === 'expense')
  const currentMonth = getCurrentMonth()
  const monthExpenses = expenses.filter(t => t.date?.startsWith(currentMonth))

  // Category spending
  const byCat = {}
  monthExpenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount })

  // Budget alerts
  budgets.forEach(b => {
    const spent = byCat[b.category] || 0
    const pct = (spent / b.limit) * 100
    const cat = getCat(b.category)
    if (pct >= 100) insights.push({ type: 'danger', icon: '🚨', text: `You've exceeded your ${cat.label} budget by ${formatCurrency(spent - b.limit)}!` })
    else if (pct >= 80) insights.push({ type: 'warning', icon: '⚠️', text: `You've used ${Math.round(pct)}% of your ${cat.label} budget.` })
  })

  // Top spending category
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
  if (topCat) {
    const cat = getCat(topCat[0])
    insights.push({ type: 'info', icon: '📊', text: `Your biggest expense this month is ${cat.label} at ${formatCurrency(topCat[1])}.` })
  }

  // Savings rate
  const income = transactions.filter(t => t.type === 'income' && t.date?.startsWith(currentMonth)).reduce((a, t) => a + t.amount, 0)
  const totalExpenses = monthExpenses.reduce((a, t) => a + t.amount, 0)
  if (income > 0) {
    const savingsRate = ((income - totalExpenses) / income) * 100
    if (savingsRate > 20) insights.push({ type: 'success', icon: '🎉', text: `Great job! You're saving ${Math.round(savingsRate)}% of your income this month.` })
    else if (savingsRate < 0) insights.push({ type: 'danger', icon: '📉', text: `You're spending more than you earn this month. Review your expenses!` })
  }

  return insights.slice(0, 4)
}
