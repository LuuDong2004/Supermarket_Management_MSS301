import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, LogOut, ChevronDown, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { roleLabel, initials } from '../../lib/format.js'
import { Badge } from '../ui/primitives.jsx'
import { notificationService } from '../../services/index.js'

export function Topbar({ onMenu }) {
  const { user, logout, mockMode } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const ref = useRef(null)
  const canViewNotifications = user?.role === 'ROLE_ADMIN'

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setMenuOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (!canViewNotifications) {
      setUnread(0)
      return
    }
    let active = true
    notificationService.unreadCount()
      .then((n) => { if (active) setUnread(Number(n) || 0) })
      .catch(() => {})
    return () => { active = false }
  }, [canViewNotifications])

  return (
    <header className="sms-topbar sticky top-0 z-50 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-none lg:px-7">
      <button onClick={onMenu} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Mở menu">
        <Menu size={20} />
      </button>

      <div className="sms-topbar-brand hidden shrink-0 items-center gap-3 lg:flex">
        <div className="sms-topbar-mark">S</div>
        <div className="leading-tight">
          <p className="text-xl font-black tracking-tight text-slate-900">SMS</p>
          <p className="text-[11px] font-semibold text-slate-900">Supermarket Management System</p>
        </div>
      </div>

      <div className="relative hidden w-full max-w-[302px] flex-none sm:block lg:ml-[84px]">
        <label className="mb-1 block text-xs text-slate-900">Search</label>
        <input
          placeholder="Tìm module, sản phẩm, khách hàng..."
          className="w-full rounded-none border border-slate-200 bg-white px-3 py-2 text-xs placeholder:text-slate-400 transition-all duration-200 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        />
      </div>

      <div className="ml-auto flex items-center justify-end gap-2">
        {mockMode && (
          <Badge tone="amber" className="hidden sm:inline-flex">Chế độ demo (mock)</Badge>
        )}
        {canViewNotifications && (
          <button
            onClick={() => navigate('/app/admin/notifications')}
            title="Thông báo hệ thống"
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <Bell size={19} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        )}

        <div className="relative flex items-center gap-5" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-none py-1.5 pl-1.5 pr-2 transition-colors hover:bg-slate-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-700 bg-brand-600 text-xs font-bold text-white shadow-sm">
              {initials(user?.fullName || user?.username || 'U')}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-slate-900">Role: {roleLabel(user?.role)}</span>
              <span className="block text-[11px] text-slate-700">{user?.fullName || user?.username}</span>
            </span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          <button type="button" onClick={() => { logout(); navigate('/login') }} className="sms-logout-button hidden sm:inline-flex">Logout</button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 animate-fade-in rounded-xl border border-slate-200 bg-white py-1.5 shadow-card-hover">
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
