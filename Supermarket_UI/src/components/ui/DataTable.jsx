import { cn } from '../../lib/cn.js'
import { EmptyState } from './primitives.jsx'
import { Inbox } from 'lucide-react'

/**
 * Lightweight declarative table.
 * columns: [{ key, header, render?(row, index), align?, className?, width? }]
 * stt: auto "STT" index column (default true, pass false to hide)
 * actions: (row) => JSX — appends a "Thao tác" column; clicks inside it never trigger onRowClick
 */
export function DataTable({ columns, rows, rowKey = 'id', onRowClick, empty, className, dense, stt = true, actions }) {
  if (!rows || rows.length === 0) {
    return (
      <div className={cn('rounded-xl border border-slate-200 bg-white', className)}>
        <EmptyState icon={Inbox} title={empty?.title || 'Không có dữ liệu'} subtitle={empty?.subtitle} />
      </div>
    )
  }

  const allColumns = [
    ...(stt ? [{
      key: '__stt', header: 'STT', align: 'center', width: 56,
      render: (_row, i) => <span className="text-xs font-medium text-slate-400">{i + 1}</span>,
    }] : []),
    ...columns,
    ...(actions ? [{
      key: '__actions', header: 'Thao tác', align: 'right',
      render: (row) => (
        <div className="flex flex-wrap items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {actions(row)}
        </div>
      ),
    }] : []),
  ]

  const renderCell = (column, row, index) => (column.render ? column.render(row, index) : row[column.key])

  return (
    <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card', className)}>
      <div className="divide-y divide-slate-100 sm:hidden">
        {rows.map((row, i) => (
          <div
            key={row[rowKey] ?? i}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              'space-y-3 px-4 py-4 transition',
              onRowClick && 'cursor-pointer hover:bg-slate-50/80',
            )}
          >
            {allColumns.filter((c) => c.key !== '__stt').map((c, ci) => {
              const content = renderCell(c, row, i)
              if (!c.header) {
                return (
                  <div key={c.key} className="flex justify-end pt-1">
                    {content}
                  </div>
                )
              }
              return (
                <div key={c.key} className={cn('grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 text-sm', ci === 0 && 'items-start')}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{c.header}</span>
                  <div className={cn('min-w-0 text-slate-700', ci === 0 && 'font-medium')}>
                    {content}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              {allColumns.map((c) => (
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
                {allColumns.map((c) => (
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
                    {renderCell(c, row, i)}
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
