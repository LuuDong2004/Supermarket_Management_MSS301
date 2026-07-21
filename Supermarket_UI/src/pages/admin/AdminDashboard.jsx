import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardBody, CardHeader, Button, Badge, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { roleLabel } from '../../lib/format.js'
import {
  approvalRequestService, monitoringService, securityAlertService, userService, withFallback, toList } from '../../services/index.js'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileClock,
  FileText,
  LockKeyhole,
  Plus,
  Server,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'

const isActive = (status) => ['ACTIVE', 'ĐANG HOẠT ĐỘNG'].includes(String(status || '').toUpperCase())
const isLocked = (status) => ['LOCKED', 'KHÓA', 'BỊ KHÓA'].includes(String(status || '').toUpperCase())
const isPending = (status) => ['PENDING', 'CHỜ DUYỆT'].includes(String(status || '').toUpperCase())
const isOpenAlert = (status) => !['RESOLVED', 'CLOSED', 'ĐÃ XỬ LÝ'].includes(String(status || '').toUpperCase())

function approvalTone(status) {
  const normalized = String(status || '').toUpperCase()
  if (normalized.includes('APPROVED') || normalized.includes('ĐÃ DUYỆT')) return 'green'
  if (normalized.includes('PENDING') || normalized.includes('CHỜ')) return 'amber'
  if (normalized.includes('REJECTED') || normalized.includes('TỪ CHỐI')) return 'red'
  return 'slate'
}

function userAction(user) {
  if (isLocked(user.status)) return 'Lock account'
  if (isPending(user.approval)) return 'Create'
  return user.updatedAt ? 'Update' : 'Create account'
}

function requestDescription(request) {
  return request.target ? `${request.target} · Awaiting CEO approval` : 'Awaiting CEO review.'
}

function requestTypeLabel(type) {
  return {
    'Tạo tài khoản': 'Account creation',
    'Thay đổi quyền': 'Permission update',
    'Điều chỉnh kho': 'Inventory adjustment',
    'Chính sách giá': 'Pricing policy',
  }[type] || type || 'Approval request'
}

function approvalLabel(status) {
  return {
    'Chờ duyệt': 'Pending',
    'Đã duyệt': 'Approved',
    'Từ chối': 'Rejected',
  }[status] || status || 'Not required'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [services, setServices] = useState([])
  const [logs, setLogs] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    ;(async () => {
      const [userResult, requestResult, serviceResult, logResult, alertResult] = await Promise.all([
        withFallback(() => userService.list({ page: 0, size: 50 })),
        withFallback(() => approvalRequestService.list()),
        withFallback(() => monitoringService.services()),
        withFallback(() => monitoringService.logs()),
        withFallback(() => securityAlertService.list()),
      ])

      if (!alive) return
      setUsers(toList(userResult.data))
      setRequests(toList(requestResult.data))
      setServices(toList(serviceResult.data))
      setLogs(toList(logResult.data))
      setAlerts(toList(alertResult.data))
      setLoading(false)
    })()

    return () => { alive = false }
  }, [])

  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => isActive(user.status)).length
    const lockedUsers = users.filter((user) => isLocked(user.status)).length
    const pendingRequests = requests.filter((request) => isPending(request.status)).length
    const serviceWarnings = services.filter((service) => String(service.status).toUpperCase() !== 'UP').length
    const logWarnings = logs.filter((log) => ['WARN', 'ERROR'].includes(String(log.level).toUpperCase())).length
    const openAlerts = alerts.filter((alert) => isOpenAlert(alert.status)).length

    return {
      activeUsers,
      lockedUsers,
      pendingRequests,
      systemWarnings: openAlerts || (serviceWarnings + logWarnings),
      roleCount: new Set(users.map((user) => user.role).filter(Boolean)).size,
    }
  }, [alerts, logs, requests, services, users])

  const recentUsers = useMemo(() => users.slice(0, 5), [users])
  const pendingWorkbench = useMemo(
    () => requests.filter((request) => isPending(request.status)).slice(0, 3),
    [requests],
  )

  return (
    <div>
      <PageHeader
        breadcrumb="Administration · 3.2.2"
        title="Administrator Dashboard"
        subtitle="Account management, approval requests, and system health at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Accounts"
          value={stats.activeUsers}
          icon={Users}
          tone="green"
          hint={`${stats.roleCount} roles in operation`}
        />
        <StatCard
          label="Locked Accounts"
          value={stats.lockedUsers}
          icon={LockKeyhole}
          tone="red"
          hint={stats.lockedUsers ? 'need review' : 'no locked accounts'}
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingRequests}
          icon={FileClock}
          tone="amber"
          hint="awaiting CEO decision"
        />
        <StatCard
          label="System Alerts"
          value={stats.systemWarnings}
          icon={AlertTriangle}
          tone={stats.systemWarnings ? 'amber' : 'green'}
          hint={stats.systemWarnings ? 'need attention' : 'all systems normal'}
        />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-3">
              <CardHeader
                title="Recent User Account Activity"
                subtitle="Latest account changes and status updates"
                icon={UserCog}
                action={
                  <Link to="/app/admin/users">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={recentUsers}
                  onRowClick={(user) => navigate(`/app/admin/users/${user.id}/edit`)}
                  empty={{ title: 'No accounts found', subtitle: 'The user account list is empty.' }}
                  columns={[
                    {
                      key: 'username',
                      header: 'User',
                      render: (user) => <span className="font-mono text-xs font-semibold text-slate-700">{user.username || user.id}</span>,
                    },
                    {
                      key: 'role',
                      header: 'Role',
                      render: (user) => <Badge tone="brand">{roleLabel(user.role)}</Badge>,
                    },
                    { key: 'action', header: 'Action', render: (user) => userAction(user) },
                    {
                      key: 'approval',
                      header: 'Approval',
                      render: (user) => <Badge tone={approvalTone(user.approval)}>{approvalLabel(user.approval)}</Badge>,
                    },
                    { key: 'status', header: 'Status', render: (user) => <StatusBadge status={user.status || 'ACTIVE'} /> },
                  ]}
                />
              </CardBody>
            </Card>

            <Card className="min-w-0 xl:col-span-2">
              <CardHeader
                title="Approval Request Workbench"
                subtitle="Requests that require follow-up"
                icon={ClipboardCheck}
                action={
                  <Link to="/app/admin/approval-requests">
                    <Button variant="ghost" size="sm">View all</Button>
                  </Link>
                }
              />
              <CardBody className="space-y-3">
                {pendingWorkbench.map((request) => (
                  <button
                    key={request.id || request.code}
                    type="button"
                    onClick={() => navigate(`/app/admin/approval-requests/${request.id || request.code}`)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-left transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-600">
                      <FileText size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800">{requestTypeLabel(request.type)}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{requestDescription(request)}</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </button>
                ))}
                {pendingWorkbench.length === 0 && (
                  <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-5 text-center">
                    <ShieldCheck size={24} className="text-emerald-500" />
                    <p className="mt-2 text-sm font-semibold text-slate-700">No pending requests</p>
                    <p className="mt-1 text-xs text-slate-400">All requests have been processed.</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-3">
              <CardHeader
                title="System Monitoring Snapshot"
                subtitle="Latest service health information"
                icon={Server}
                action={
                  <Link to="/app/admin/monitoring">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>Details</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={services.slice(0, 5)}
                  rowKey="name"
                  empty={{ title: 'No monitoring data', subtitle: 'Service health information is unavailable.' }}
                  columns={[
                    { key: 'name', header: 'Service', render: (service) => <span className="font-semibold text-slate-700">{service.name}</span> },
                    { key: 'status', header: 'Status', render: (service) => <StatusBadge status={service.status} /> },
                    { key: 'uptime', header: 'Uptime', render: (service) => service.uptime || '—' },
                    {
                      key: 'resources',
                      header: 'Resources',
                      render: (service) => (
                        <span className="text-xs text-slate-500">CPU {service.cpu ?? '—'}% · RAM {service.mem ?? '—'}%</span>
                      ),
                    },
                  ]}
                />
              </CardBody>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader title="Quick Actions" subtitle="Frequently used administration tasks" icon={Activity} />
              <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                <QuickAction to="/app/admin/users/new" icon={Plus} label="Create Account" />
                <QuickAction to="/app/admin/approval-requests" icon={ClipboardCheck} label="Submit Request" />
                <QuickAction to="/app/settings/rules" icon={FileText} label="View Audit Logs" />
                <QuickAction to="/app/admin/monitoring" icon={Server} label="System Status" />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-brand-200 hover:bg-brand-50/50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={17} />
      </span>
      <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-700">{label}</span>
    </Link>
  )
}
