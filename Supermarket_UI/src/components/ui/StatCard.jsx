import { cn } from '../../lib/cn.js'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-rose-50 text-rose-600',
  blue: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
}

export function StatCard({ label, value, icon: Icon, tone = 'brand', delta, hint }) {
  const positive = delta != null && delta >= 0
  return (
    <div className="sms-stat-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:border-brand-200 hover:shadow-premium-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-xl font-bold tracking-tight text-slate-800 font-display">{value}</p>
        </div>
        {Icon && (
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100/50', TONES[tone])}>
            <Icon size={16} />
          </span>
        )}
      </div>
      {(delta != null || hint) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {delta != null && (
            <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold', positive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100')}>
              {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {positive ? '+' : '-'}{Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="font-medium text-slate-400">{hint}</span>}
        </div>
      )}
    </div>
  )
}
