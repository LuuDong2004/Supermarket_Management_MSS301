import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import {
  attendanceService, employeeService, reportService, toList, withFallback } from '../../services/index.js'
import {
  AlarmClock,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Clock3,
  FileClock,
  FilePenLine,
  History,
  UserCheck,
  Users,
} from 'lucide-react'

const PERFORMANCE_TASKS = [
  {
    title: 'Monthly evaluation batch',
    detail: '8 employees waiting for score review',
    action: 'Open',
    icon: ClipboardList,
  },
  {
    title: 'Reward recommendations',
    detail: '3 high-performance candidates',
    action: 'Review',
    icon: UserCheck,
  },
  {
    title: 'Salary adjustment note',
    detail: 'Draft recommendation for CEO review',
    action: 'Edit',
    icon: FilePenLine,
  },
]

function attendanceKind(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('ABSENT') || value.includes('VẮNG')) return 'absent'
  if (value.includes('LATE') || value.includes('MUỘN')) return 'late'
  return 'present'
}

function attendanceLabel(status) {
  const kind = attendanceKind(status)
  if (kind === 'absent') return 'Absent'
  if (kind === 'late') return 'Late'
  return 'Present'
}

function employeeIsActive(status) {
  const value = String(status || '').toUpperCase()
  return value.includes('ACTIVE') || value.includes('ĐANG LÀM')
}

function roleFromAttendance(row, employees) {
  if (row.role) return row.role
  const employee = employees.find((item) => item.id === row.employeeId || item.name === row.employee)
  if (!employee) return 'Staff'
  if (employee.dept) return employee.dept
  if (String(employee.role).includes('CASHIER')) return 'Cashier'
  if (String(employee.role).includes('WAREHOUSE')) return 'Warehouse'
  return 'Staff'
}

function employeeCode(row, employees, index) {
  if (/^ST-/i.test(String(row.employee || ''))) return row.employee
  const employee = employees.find((item) => item.id === row.employeeId || item.name === row.employee)
  return employee?.code || employee?.id || row.code || `ST-${String(index + 1).padStart(3, '0')}`
}

export default function StaffManagerDashboard() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [performance, setPerformance] = useState([])
  const [sources, setSources] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    ;(async () => {
      const [employeeResult, attendanceResult, performanceResult] = await Promise.all([
        withFallback(() => employeeService.list({ size: 200 })),
        withFallback(() => attendanceService.list()),
        withFallback(() => reportService.employeePerformance()),
      ])

      if (!alive) return
      setEmployees(toList(employeeResult.data))
      setAttendance(toList(attendanceResult.data))
      setPerformance(toList(performanceResult.data))
      setSources({
        employees: employeeResult.source,
        attendance: attendanceResult.source,
        performance: performanceResult.source,
      })
      setLoading(false)
    })()

    return () => { alive = false }
  }, [])

  const attendanceRows = useMemo(() => {
    return attendance.slice(0, 5).map((row, index) => ({
      ...row,
      id: row.id || employeeCode(row, employees, index),
      employee: employeeCode(row, employees, index),
      role: roleFromAttendance(row, employees),
      checkIn: row.checkIn || row.in || '—',
      checkOut: row.checkOut || row.out || '—',
      status: attendanceLabel(row.status),
    }))
  }, [attendance, employees, sources.attendance])

  const activeEmployees = sources.employees === 'backend'
    ? employees.filter((employee) => employeeIsActive(employee.status)).length
    : 54
  const presentToday = sources.attendance === 'backend'
    ? attendance.filter((row) => attendanceKind(row.status) === 'present').length
    : 49
  const lateToday = sources.attendance === 'backend'
    ? attendance.filter((row) => attendanceKind(row.status) === 'late').length
    : 4
  const absentToday = sources.attendance === 'backend'
    ? attendance.filter((row) => attendanceKind(row.status) === 'absent').length
    : 1
  const pendingEvaluations = sources.performance === 'backend'
    ? performance.filter((row) => !row.score || String(row.status || '').toUpperCase().includes('PENDING')).length
    : 8

  const workforceAlerts = sources.attendance === 'backend'
    ? [
        { id: 'missed', alert: 'Missed check-ins', count: absentToday || 0, priority: 'Normal' },
        { id: 'late', alert: 'Repeated late arrivals', count: lateToday > 0 ? Math.max(1, Math.floor(lateToday / 4)) : 0, priority: 'High' },
      ]
    : [
        { id: 'missed', alert: 'Missed check-ins', count: 4, priority: 'Normal' },
        { id: 'late', alert: 'Repeated late arrivals', count: 1, priority: 'High' },
      ]

  return (
    <div>
      <PageHeader
        breadcrumb="Human Resources · 3.2.7"
        title="Staff Manager Dashboard"
        subtitle="Role-based interface after successful login."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Employees" value={`${activeEmployees} staff`} icon={Users} tone="green" hint="across supermarket teams" />
        <StatCard label="Attendance Today" value={`${presentToday} present`} icon={CalendarCheck} tone="brand" hint={`${lateToday + absentToday} absent or late`} />
        <StatCard label="Late Check-ins" value={`${lateToday} records`} icon={AlarmClock} tone="amber" hint="need manager review" />
        <StatCard label="Pending Evaluations" value={`${pendingEvaluations} forms`} icon={FileClock} tone="violet" hint="this month" />
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
                title="Attendance Overview"
                subtitle="Latest staff check-ins for today"
                icon={Clock3}
                action={
                  <Link to="/app/hr/attendance">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={attendanceRows}
                  rowKey="id"
                  onRowClick={() => navigate('/app/hr/attendance')}
                  empty={{ title: 'No attendance records', subtitle: 'No staff check-ins are available for today.' }}
                  columns={[
                    { key: 'employee', header: 'Employee', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.employee}</span> },
                    { key: 'role', header: 'Role' },
                    { key: 'checkIn', header: 'Check-in', render: (row) => <span className="font-mono text-xs">{row.checkIn}</span> },
                    { key: 'checkOut', header: 'Check-out', render: (row) => <span className="font-mono text-xs">{row.checkOut}</span> },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => (
                        <Badge tone={row.status === 'Present' ? 'green' : row.status === 'Late' ? 'amber' : 'red'} dot>
                          {row.status}
                        </Badge>
                      ),
                    },
                  ]}
                />
              </CardBody>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader title="Performance Tasks" subtitle="Items requiring manager action" icon={ClipboardList} />
              <CardBody className="space-y-3">
                {PERFORMANCE_TASKS.map(({ title, detail, action, icon: Icon }) => (
                  <div key={title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-100 bg-violet-50 text-violet-600">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
                    </div>
                    <Link to="/app/hr/performance">
                      <Button variant="secondary" size="sm">{action}</Button>
                    </Link>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader title="Staff Management Shortcuts" subtitle="Frequently used HR actions" icon={Users} />
              <CardBody className="grid gap-3 sm:grid-cols-2">
                <StaffShortcut to="/app/hr/employees" icon={Users} label="Employee Profiles" />
                <StaffShortcut to="/app/hr/employees" icon={History} label="Work History" />
                <StaffShortcut to="/app/hr/timesheet" icon={CalendarCheck} label="Attendance Reports" />
                <StaffShortcut to="/app/hr/performance" icon={FilePenLine} label="Performance Forms" />
              </CardBody>
            </Card>

            <Card className="min-w-0 xl:col-span-2">
              <CardHeader title="Workforce Alerts" subtitle="Attendance issues requiring attention" icon={AlertTriangle} />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={workforceAlerts}
                  rowKey="id"
                  onRowClick={() => navigate('/app/hr/attendance')}
                  columns={[
                    { key: 'alert', header: 'Alert', render: (row) => <span className="font-semibold text-slate-700">{row.alert}</span> },
                    { key: 'count', header: 'Count', align: 'center' },
                    {
                      key: 'priority',
                      header: 'Priority',
                      render: (row) => <Badge tone={row.priority === 'High' ? 'red' : 'slate'}>{row.priority}</Badge>,
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function StaffShortcut({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="group flex min-h-16 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-center transition hover:border-brand-200 hover:bg-brand-50/50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={17} />
      </span>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">{label}</span>
    </Link>
  )
}
