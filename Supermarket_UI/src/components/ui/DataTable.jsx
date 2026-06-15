import { cn } from '../../lib/cn.js'
import { EmptyState } from './primitives.jsx'
import { Inbox } from 'lucide-react'

/**
 * Lightweight declarative table.
 * columns: [{ key, header, render?(row), align?, className?, width? }]
 */
export function DataTable({ columns, rows, rowKey = 'id', onRowClick, empty, className, dense }) {
  if (!rows || rows.length === 0) {
    return (
      <div className={cn('rounded-xl border border-slate-200 bg-white', className)}>
        <EmptyState icon={Inbox} title={empty?.title || 'Không có dữ liệu'} subtitle={empty?.subtitle} />
      </div>
    )
  }
  return (
    <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  className={cn('px-4 py-3', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr
                key={row[rowKey] ?? i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'transition hover:bg-slate-50/80',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      'px-4 text-slate-700',
                      dense ? 'py-2' : 'py-3',
                      c.align === 'right' && 'text-right',
                      c.align === 'center' && 'text-center',
                      c.className,
                    )}
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
