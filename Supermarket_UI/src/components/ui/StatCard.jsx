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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        {Icon && (
          <span className={cn('flex h-11 w-11 items-center justify-center rounded-lg', TONES[tone])}>
            <Icon size={20} />
          </span>
        )}
      </div>
      {(delta != null || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta != null && (
            <span className={cn('inline-flex items-center gap-1 font-medium', positive ? 'text-emerald-600' : 'text-rose-600')}>
              {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-slate-400">{hint}</span>}
        </div>
      )}
    </div>
  )
}
