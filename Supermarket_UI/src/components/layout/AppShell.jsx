import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'

const COLLAPSE_KEY = 'sms.sidebarCollapsed'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile drawer
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1') // desktop collapse

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  return (
    <div className="sms-app-shell flex h-screen flex-col overflow-hidden">
      <Topbar onMenu={() => setSidebarOpen(true)} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <main className="sms-main min-w-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
