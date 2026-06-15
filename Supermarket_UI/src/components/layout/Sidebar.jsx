import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { navForRole } from '../../routes/nav.js'
import { cn } from '../../lib/cn.js'
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

function Brand({ collapsed }) {
  return (
    <div className={cn('flex flex-1 items-center gap-3 px-6 py-5', collapsed && 'lg:justify-center lg:px-0')}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-base font-extrabold text-white">
        S
      </div>
      <div className={cn('leading-tight', collapsed && 'lg:hidden')}>
        <p className="text-sm font-bold text-slate-900">SMS</p>
        <p className="text-[11px] text-slate-400">Supermarket Mgmt</p>
      </div>
    </div>
  )
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth()
  const groups = navForRole(user?.role)

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-all duration-200 lg:static lg:translate-x-0',
          collapsed ? 'lg:w-[76px]' : 'lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between">
          <Brand collapsed={collapsed} />
          <button onClick={onClose} className="mr-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-3 pb-6">
          {groups.map((group, gi) => (
            <div key={gi}>
              {group.section &&
                (collapsed ? (
                  <div className="mx-3 mb-1.5 hidden h-px bg-slate-100 lg:block" />
                ) : (
                  <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {group.section}
                  </p>
                ))}
              <div className="space-y-0.5">
                {group.items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={onClose}
                    title={collapsed ? it.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                        collapsed && 'lg:justify-center lg:px-0',
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <it.icon
                          size={18}
                          className={cn('shrink-0', isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600')}
                        />
                        <span className={cn('flex-1 truncate', collapsed && 'lg:hidden')}>{it.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden shrink-0 border-t border-slate-100 p-3 lg:block">
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Mở rộng' : 'Thu gọn'}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800',
              collapsed && 'justify-center px-0',
            )}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
