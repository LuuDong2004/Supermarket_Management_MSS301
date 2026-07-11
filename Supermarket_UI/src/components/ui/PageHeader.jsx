import { cn } from '../../lib/cn.js'

export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumb && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-600">{breadcrumb}</p>}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

// Horizontal filter bar wrapper used on list screens.
// Children (Field, button groups...) share one row: flex-basis is forced so the
// w-full on Field does not push each control onto its own line; they wrap only
// when the screen is too narrow.
export function FilterBar({ children, className }) {
  return (
    <div
      className={cn(
        'mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card',
        '[&>*]:grow [&>*]:shrink [&>*]:basis-52 [&>*]:min-w-[160px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
