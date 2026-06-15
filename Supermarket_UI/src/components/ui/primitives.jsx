import { cn } from '../../lib/cn.js'
import { Loader2 } from 'lucide-react'

/* ------------------------------ Button ------------------------------ */
const BTN_VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
}
const BTN_SIZES = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
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
        'inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
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
export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white shadow-card', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, icon: Icon, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4', className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon size={18} />
          </span>
        )}
        <div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

/* ------------------------------ Badge ------------------------------- */
const BADGE_TONES = {
  slate: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-50 text-brand-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-rose-50 text-rose-700',
  blue: 'bg-sky-50 text-sky-700',
  violet: 'bg-violet-50 text-violet-700',
}

export function Badge({ tone = 'slate', children, className, dot }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
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
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn('input-base', className)} {...props} />
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn('input-base resize-y', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn('input-base appearance-none pr-8', className)} {...props}>
      {children}
    </select>
  )
}

/* ----------------------------- Misc --------------------------------- */
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon size={22} />
        </span>
      )}
      <p className="font-medium text-slate-700">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-slate-500">{subtitle}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Spinner({ className }) {
  return <Loader2 className={cn('animate-spin text-brand-600', className)} />
}

export function Divider({ className }) {
  return <div className={cn('my-4 h-px bg-slate-100', className)} />
}
