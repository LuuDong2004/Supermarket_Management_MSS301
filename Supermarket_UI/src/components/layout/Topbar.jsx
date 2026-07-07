import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, LogOut, ChevronDown, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { roleLabel, initials } from '../../lib/format.js'
import { Badge } from '../ui/primitives.jsx'

export function Topbar({ onMenu }) {
  const { user, logout, mockMode } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setMenuOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md lg:px-6 shadow-sm">
      <button onClick={onMenu} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Tìm module, sản phẩm, khách hàng..."
          className="w-full rounded-xl border border-slate-100 bg-slate-50/80 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200"
        />
      </div>

      <div className="ml-auto flex items-center justify-end gap-2">
        {mockMode && (
          <Badge tone="amber" className="hidden sm:inline-flex">Chế độ demo (mock)</Badge>
        )}
        <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 hover:bg-slate-100 transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-xs font-bold text-white shadow-premium border border-brand-400/20">
              {initials(user?.fullName || user?.username || 'U')}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-slate-800">{user?.fullName || user?.username}</span>
              <span className="block text-[11px] text-slate-400">{roleLabel(user?.role)}</span>
            </span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-card-hover animate-fade-in">
              <div className="border-b border-slate-100 px-4 py-2.5">
                <p className="text-sm font-semibold text-slate-800">{user?.fullName || user?.username}</p>
                <p className="text-xs text-slate-400">{user?.email || '—'}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate('/app/profile') }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <User size={15} /> Hồ sơ của tôi
              </button>
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={15} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
