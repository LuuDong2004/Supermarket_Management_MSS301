import { cn } from '../../lib/cn.js'

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn('flex gap-1 border-b border-slate-200', className)}>
      {tabs.map((t) => {
        const key = t.value ?? t
        const label = t.label ?? t
        const active = key === value
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition',
              active
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            {label}
            {t.count != null && (
              <span className={cn('ml-2 rounded-full px-1.5 py-0.5 text-xs', active ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500')}>
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
