import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn.js'
import { EmptyState } from './primitives.jsx'
import { Inbox, MoreVertical } from 'lucide-react'

// Collapses a row's action buttons behind a single ⋮ icon. The panel is
// position:fixed so the table's overflow containers can't clip it.
function RowActionsMenu({ children }) {
  const [pos, setPos] = useState(null) // {top, right} when open
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!pos) return
    const close = (e) => {
      if (btnRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return
      setPos(null)
    }
    const onKey = (e) => { if (e.key === 'Escape') setPos(null) }
    const onScroll = () => setPos(null)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [pos])

  const toggle = () => {
    if (pos) { setPos(null); return }
    const r = btnRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Thao tác"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition',
          pos ? 'bg-slate-100 text-slate-700' : 'hover:bg-slate-100 hover:text-slate-600',
        )}
      >
        <MoreVertical size={16} />
      </button>
      {pos && createPortal(
        // Portal to <body>: transformed/overflow ancestors can neither clip
        // nor offset the fixed-position panel.
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 40 }}
          className="flex min-w-[9rem] flex-col items-stretch gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60 [&>*]:justify-start"
          onClick={() => setPos(null)}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  )
}

/**
 * Lightweight declarative table.
 * columns: [{ key, header, render?(row, index), align?, className?, width? }]
 * stt: auto "STT" index column (default true, pass false to hide)
 * actions: (row) => JSX — appends a "Thao tác" column shown behind a single ⋮
 * menu; clicks inside it never trigger onRowClick
 */
export function DataTable({ columns, rows, rowKey = 'id', onRowClick, empty, className, dense, stt = true, actions }) {
  if (!rows || rows.length === 0) {
    return (
      <div className={cn('sms-table rounded-none border border-slate-900 bg-white', className)}>
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
      key: '__actions', header: 'Thao tác', align: 'right', width: 72,
      render: (row) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <RowActionsMenu>{actions(row)}</RowActionsMenu>
        </div>
      ),
    }] : []),
  ]

  const renderCell = (column, row, index) => (column.render ? column.render(row, index) : row[column.key])

  return (
    <div className={cn('sms-table overflow-hidden rounded-none border border-slate-900 bg-white shadow-none', className)}>
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

      {/* Columns never squish: the table keeps its natural width and the
          wrapper scrolls horizontally (scrollbar at the bottom). */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-max text-sm">
          <thead>
              <tr className="border-b border-slate-900 bg-white text-left text-xs font-bold uppercase tracking-wider text-slate-900">
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
          <tbody className="divide-y divide-slate-900">
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
