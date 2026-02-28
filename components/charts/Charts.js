'use client'
import { useMemo } from 'react'
import { getCat, formatCurrency, CATEGORIES } from '@/lib/data'

// SVG Pie Chart built from scratch
function PieChart({ data, total }) {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 75
  const innerR = 45

  let cumulative = 0
  const slices = data.map(({ cat, amount }) => {
    const pct = amount / total
    const start = cumulative
    cumulative += pct
    return { cat, amount, pct, start }
  })

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const slicePath = (start, pct, r) => {
    if (pct >= 1) pct = 0.9999
    const startAngle = start * 360
    const endAngle = (start + pct) * 360
    const s = polarToCartesian(cx, cy, r, startAngle)
    const e = polarToCartesian(cx, cy, r, endAngle)
    const largeArc = pct > 0.5 ? 1 : 0
    const si = polarToCartesian(cx, cy, innerR, startAngle)
    const ei = polarToCartesian(cx, cy, innerR, endAngle)
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${si.x} ${si.y} Z`
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map(({ cat, pct, start }) => (
        <path key={cat.id} d={slicePath(start, pct, r)} fill={cat.color} opacity="0.9" className="transition-all hover:opacity-100 cursor-pointer" />
      ))}
      <circle cx={cx} cy={cy} r={innerR} fill="white" className="dark:fill-surface-dark" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#8b8aa0" fontFamily="Outfit">Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1a1a2e" fontFamily="Outfit">${Math.round(total)}</text>
    </svg>
  )
}

// SVG Bar Chart built from scratch
function BarChart({ monthlyData }) {
  const maxVal = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)), 1)
  const chartH = 140
  const barW = 20
  const gap = 8
  const groupW = barW * 2 + gap + 16
  const totalW = monthlyData.length * groupW
  const colors = { income: '#10b981', expenses: '#ef4444' }

  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(totalW, 300)} height={chartH + 40} style={{ minWidth: '100%' }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <line key={pct} x1={0} x2={totalW} y1={chartH * (1 - pct)} y2={chartH * (1 - pct)} stroke="#e8e6f0" strokeWidth="1" strokeDasharray="4" />
        ))}
        {monthlyData.map((m, i) => {
          const x = i * groupW + 8
          const incH = (m.income / maxVal) * chartH
          const expH = (m.expenses / maxVal) * chartH
          return (
            <g key={m.month}>
              <rect x={x} y={chartH - incH} width={barW} height={incH} fill={colors.income} rx={4} opacity={0.85} className="hover:opacity-100 transition-opacity" />
              <rect x={x + barW + gap} y={chartH - expH} width={barW} height={expH} fill={colors.expenses} rx={4} opacity={0.85} className="hover:opacity-100 transition-opacity" />
              <text x={x + barW} y={chartH + 18} textAnchor="middle" fontSize="10" fill="#8b8aa0" fontFamily="Outfit">{m.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Charts({ transactions }) {
  // Category breakdown (all time)
  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const byCat = {}
    expenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount })
    const total = Object.values(byCat).reduce((a, v) => a + v, 0)
    const data = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, amount]) => ({ cat: getCat(id), amount }))
    return { data, total }
  }, [transactions])

  // Monthly income vs expenses (last 6 months)
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      const key = d.toISOString().slice(0, 7)
      const label = d.toLocaleString('en-US', { month: 'short' })
      const monthTx = transactions.filter(t => t.date?.startsWith(key))
      const income = monthTx.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
      const expenses = monthTx.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
      return { month: key, label, income, expenses }
    })
  }, [transactions])

  return (
    <div className="space-y-6">
      {/* Income vs Expenses bar chart */}
      <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-gray-900 dark:text-white">Income vs Expenses</h3>
          <div className="flex gap-4 text-xs font-body">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success inline-block" />Income</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-danger inline-block" />Expenses</span>
          </div>
        </div>
        <BarChart monthlyData={monthlyData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Spending Breakdown</h3>
          {pieData.total === 0 ? (
            <p className="text-muted text-sm font-body text-center py-8">No expense data yet.</p>
          ) : (
            <div className="flex items-center gap-6 flex-wrap">
              <PieChart data={pieData.data} total={pieData.total} />
              <div className="flex-1 space-y-2 min-w-0">
                {pieData.data.map(({ cat, amount }) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-body text-gray-700 dark:text-gray-300 truncate flex-1">{cat.label}</span>
                    <span className="text-sm font-body font-semibold text-gray-900 dark:text-white flex-shrink-0">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly summary table */}
        <div className="bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-5">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Monthly Summary</h3>
          <div className="space-y-2">
            {monthlyData.reverse().map(m => {
              const net = m.income - m.expenses
              return (
                <div key={m.month} className="flex items-center justify-between py-2 border-b border-border dark:border-border-dark last:border-0">
                  <span className="font-body text-sm text-gray-700 dark:text-gray-300">{m.month}</span>
                  <div className="flex gap-4 text-sm font-body">
                    <span className="text-success">+{formatCurrency(m.income)}</span>
                    <span className="text-danger">-{formatCurrency(m.expenses)}</span>
                    <span className={`font-semibold ${net >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(net)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
