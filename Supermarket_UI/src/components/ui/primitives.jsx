import { cn } from '../../lib/cn.js'
import { Loader2 } from 'lucide-react'

/* ------------------------------ Button ------------------------------ */
const BTN_VARIANTS = {
  primary: 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 shadow-premium focus:ring-brand-500/20',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500/10',
  ghost: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-500/5',
  danger: 'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-700 hover:to-rose-600 shadow-premium focus:ring-rose-500/20',
  success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-premium focus:ring-emerald-500/20',
}

const BTN_SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3.5 text-sm font-semibold gap-2.5 rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus:outline-none focus:ring-4',
        BTN_VARIANTS[variant],
        BTN_SIZES[size],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

/* ------------------------------ Card -------------------------------- */
export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white/90 shadow-premium backdrop-blur-sm transition-all duration-300',
        hoverEffect && 'hover:shadow-premium-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, icon: Icon, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 border-b border-slate-100/80 px-6 py-4.5', className)}>
      <div className="flex items-start gap-3.5">
        {Icon && (
          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-sm border border-brand-100/50">
            <Icon size={20} />
          </span>
        )}
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight font-display">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

/* ------------------------------ Badge ------------------------------- */
const BADGE_TONES = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200/50',
  brand: 'bg-brand-50 text-brand-700 border-brand-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-rose-50 text-rose-700 border-rose-100',
  blue: 'bg-sky-50 text-sky-700 border-sky-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
}

export function Badge({ tone = 'slate', children, className, dot }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm/5',
        BADGE_TONES[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  )
}

// Maps a free-text status to a badge tone for consistency across screens.
export function StatusBadge({ status }) {
  const s = (status || '').toLowerCase()
  let tone = 'slate'
  if (/(up|active|đang làm|đang mở|approved|đã duyệt|đúng giờ|received|hoàn thành|đang chạy)/.test(s)) tone = 'green'
  else if (/(pending|chờ|đi muộn|lên lịch|warn|on hold|partial)/.test(s)) tone = 'amber'
  else if (/(down|rejected|từ chối|vắng|error|locked|khóa|hết hàng|expired)/.test(s)) tone = 'red'
  else if (/(info|new|mới|draft)/.test(s)) tone = 'blue'
  return <Badge tone={tone} dot>{status}</Badge>
}

/* ----------------------------- Form fields -------------------------- */
export function Field({ label, hint, required, error, children, className }) {
  return (
    <div className={cn('block w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-slate-700 tracking-tight">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn('input-base', className)} {...props} />
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn('input-base resize-y min-h-[100px]', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative w-full">
      <select className={cn('input-base appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  )
}

/* ----------------------------- Misc --------------------------------- */
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
      {Icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-400">
          <Icon size={24} className="text-slate-500" />
        </span>
      )}
      <p className="font-bold text-slate-700 font-display text-base mt-2">{title}</p>
      {subtitle && <p className="max-w-xs text-xs text-slate-400 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Spinner({ className }) {
  return <Loader2 className={cn('animate-spin text-brand-600', className)} />
}

export function Divider({ className }) {
  return <div className={cn('my-5 h-px bg-slate-100', className)} />
}
