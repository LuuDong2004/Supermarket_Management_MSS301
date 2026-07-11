import { Children, isValidElement, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn.js'
import { Calendar, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

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
  if (/(up|active|đang làm|đang mở|approved|đã duyệt|đúng giờ|received|hoàn thành|hoàn tất|đang chạy|completed|delivered|đã hoàn|đã giao|đã xác nhận|đang bán|đã đóng)/.test(s)) tone = 'green'
  else if (/(pending|chờ|đi muộn|lên lịch|warn|on hold|partial|đang giao|shipping|tạm nghỉ)/.test(s)) tone = 'amber'
  else if (/(down|rejected|từ chối|vắng|error|locked|khóa|hết hàng|expired|cancelled|đã hủy|ngừng|nghỉ việc)/.test(s)) tone = 'red'
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
  // All date fields get the custom rounded calendar picker automatically.
  if (props.type === 'date') return <DateInput className={className} {...props} />
  return <input className={cn('input-base', className)} {...props} />
}

/* --------------------------- Date picker ---------------------------- */
const pad2 = (n) => String(n).padStart(2, '0')
const toIso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

/**
 * Custom calendar replacing native <input type="date">. Same contract:
 * ISO yyyy-mm-dd value, onChange(e.target.value), optional min/max.
 */
function DateInput({ value, onChange, disabled, min, max, className, placeholder = 'Chọn ngày...' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = value ? new Date(`${value}T00:00:00`) : null
  const [view, setView] = useState(() => selected || new Date())

  useEffect(() => {
    if (!open) return
    if (selected) setView(selected)
    const onDocClick = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const inRange = (iso) => (!min || iso >= min) && (!max || iso <= max)
  const pick = (iso) => { setOpen(false); onChange?.({ target: { value: iso } }) }

  // Monday-first 6-week grid around the viewed month.
  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7))
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
  const todayIso = toIso(new Date())

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn('input-base flex items-center justify-between gap-2 pr-3 text-left', className)}
      >
        <span className={cn('truncate', !selected && 'text-slate-400')}>
          {selected ? `${pad2(selected.getDate())}/${pad2(selected.getMonth() + 1)}/${selected.getFullYear()}` : placeholder}
        </span>
        <Calendar size={15} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
              <ChevronLeft size={16} />
            </button>
            <p className="text-sm font-semibold text-slate-800">Tháng {view.getMonth() + 1}, {view.getFullYear()}</p>
            <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-[11px] font-semibold uppercase text-slate-400">{w}</span>
            ))}
            {days.map((d) => {
              const iso = toIso(d)
              const isSelected = value === iso
              const isToday = iso === todayIso
              const inMonth = d.getMonth() === view.getMonth()
              const enabled = inRange(iso)
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={!enabled}
                  onClick={() => pick(iso)}
                  className={cn(
                    'flex h-8 items-center justify-center rounded-lg text-sm transition',
                    isSelected ? 'bg-brand-600 font-semibold text-white shadow-sm'
                      : isToday ? 'font-semibold text-brand-600 ring-1 ring-inset ring-brand-200 hover:bg-brand-50'
                      : inMonth ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-50',
                    !enabled && 'cursor-not-allowed text-slate-200 hover:bg-transparent',
                  )}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-2">
            <button type="button" onClick={() => pick(todayIso)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50">
              Hôm nay
            </button>
            <button type="button" onClick={() => pick('')}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600">
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn('input-base resize-y min-h-[100px]', className)} {...props} />
}

// Flatten <option> children (including arrays/fragments from .map) into plain items.
function collectOptions(children, out = []) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    if (child.type === 'option') {
      out.push({
        value: child.props.value ?? child.props.children,
        label: child.props.children,
        disabled: !!child.props.disabled,
      })
    } else if (child.props?.children) {
      collectOptions(child.props.children, out)
    }
  })
  return out
}

/**
 * Custom dropdown that keeps the native-select API (value, onChange(e.target.value),
 * <option> children) but renders a rounded popup list instead of the browser's
 * square native one.
 */
export function Select({ className, children, value, onChange, disabled, ...props }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const options = collectOptions(children)
  const selected = options.find((o) => String(o.value) === String(value)) || options[0]

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (o) => {
    setOpen(false)
    // Native selects always report string values — keep that contract.
    onChange?.({ target: { value: String(o.value ?? '') } })
  }

  return (
    <div ref={rootRef} className="relative w-full" {...props}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn('input-base flex items-center justify-between gap-2 pr-3 text-left', className)}
      >
        <span className={cn('truncate', selected == null && 'text-slate-400')}>{selected?.label ?? '—'}</span>
        <svg className={cn('h-4 w-4 shrink-0 fill-current text-slate-400 transition-transform', open && 'rotate-180')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </button>

      {open && (
        <ul className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60">
          {options.map((o, i) => {
            const isSelected = String(o.value) === String(value)
            return (
              <li key={`${o.value}-${i}`}>
                <button
                  type="button"
                  disabled={o.disabled}
                  onClick={() => pick(o)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition',
                    isSelected ? 'bg-brand-50 font-medium text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                    o.disabled && 'cursor-not-allowed text-slate-300 hover:bg-transparent',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {isSelected && <Check size={14} className="shrink-0 text-brand-600" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
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
