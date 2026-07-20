import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { navForRole } from '../../routes/nav.js'
import { cn } from '../../lib/cn.js'
import { X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth()
  const groups = navForRole(user?.role)

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'sms-sidebar fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-none transition-all duration-300 lg:static lg:translate-x-0',
          collapsed ? 'lg:w-[76px]' : 'lg:w-64',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex shrink-0 justify-end lg:hidden">
          <button onClick={onClose} className="mr-3 mt-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
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
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
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
                        'sms-nav-item group flex items-center gap-3 rounded-none px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                        collapsed && 'lg:justify-center lg:px-0 lg:rounded-none',
                        isActive
                          ? 'bg-brand-50 text-brand-700 shadow-none font-semibold border-l-4 border-brand-600 rounded-l-none'
                          : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:translate-x-0.5',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <it.icon
                          size={18}
                          className={cn('shrink-0 transition-transform duration-200 group-hover:scale-105', isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600')}
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
              'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800',
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
