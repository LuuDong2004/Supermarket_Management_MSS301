import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate, roleLabel, initials, isoDate } from '../../lib/format.js'
import { employeeService, staffShiftService, withFallback, toList, mockEmployees } from '../../services/index.js'
import { Users, UserCheck, Building2, Plus, Search, Trash2, Pencil, Eye } from 'lucide-react'

const todayIso = () => isoDate()

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN', 'ROLE_CEO', 'ROLE_SUPPLIER']

export default function Employees() {
  const toast = useToast()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')

  const [todayShifts, setTodayShifts] = useState([])

  const load = async () => {
    setLoading(true)
    const [r, rs] = await Promise.all([
      withFallback(() => employeeService.list({ size: 200 }), mockEmployees),
      withFallback(() => staffShiftService.list({ from: todayIso(), to: todayIso() })),
    ])
    setRows(toList(r.data))
    setTodayShifts(toList(rs.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  // Today's shift per employee name, for the "Ca hôm nay" column.
  const shiftByName = useMemo(() => {
    const m = {}
    todayShifts.forEach((s) => { if (s.employeeName) m[s.employeeName] = s.shiftType })
    return m
  }, [todayShifts])

  const depts = useMemo(() => [...new Set(rows.map((e) => e.dept).filter(Boolean))], [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((e) => {
      if (q && !(e.name || '').toLowerCase().includes(q) && !((e.code || e.id) || '').toLowerCase().includes(q)) return false
      if (dept && e.dept !== dept) return false
      if (role && e.role !== role) return false
      return true
    })
  }, [rows, search, dept, role])

  const active = rows.filter((e) => e.status === 'Đang làm').length

  const remove = async (row) => {
    try {
      await employeeService.remove(row.id)
      toast.success('Đã xóa nhân viên.')
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.1"
        title="Hồ sơ nhân viên"
        subtitle="Quản lý thông tin, phòng ban và lương của nhân viên."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={() => navigate('/app/hr/employees/new')}>Thêm nhân viên</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Tổng nhân viên" value={formatNumber(rows.length)} icon={Users} tone="brand" hint="toàn hệ thống" />
        <StatCard label="Đang làm việc" value={formatNumber(active)} icon={UserCheck} tone="green" hint="trạng thái hoạt động" />
        <StatCard label="Số phòng ban" value={formatNumber(depts.length)} icon={Building2} tone="blue" hint="đơn vị tổ chức" />
      </div>

      <FilterBar className="mt-6">
        <Field label="Tìm kiếm" className="grow">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Tên hoặc mã nhân viên..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </Field>
        <Field label="Phòng ban">
          <Select value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">Tất cả</option>
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </Field>
        <Field label="Vai trò">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Tất cả</option>
            {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
          </Select>
        </Field>
      </FilterBar>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <DataTable
          rows={filtered}
          onRowClick={(r) => navigate(`/app/hr/employees/${r.id}`)}
          empty={{ title: 'Không có nhân viên', subtitle: 'Thử đổi bộ lọc hoặc thêm nhân viên mới.' }}
          columns={[
            { key: 'code', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.code || r.id}</span> },
            {
              key: 'name', header: 'Nhân viên', render: (r) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{initials(r.name)}</span>
                  <span className="font-medium text-slate-700">{r.name}</span>
                </div>
              ),
            },
            { key: 'role', header: 'Vai trò', render: (r) => <Badge tone="brand">{roleLabel(r.role)}</Badge> },
            { key: 'dept', header: 'Phòng ban' },
            { key: 'shift', header: 'Ca hôm nay', render: (r) => (
              shiftByName[r.name] ? <Badge tone="violet">{shiftByName[r.name]}</Badge> : <span className="text-xs text-slate-300">—</span>
            ) },
            { key: 'joined', header: 'Ngày vào', render: (r) => formatDate(r.joined) },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            { key: 'salary', header: 'Lương', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.salary)}</span> },
          ]}
          actions={(r) => (
            <>
              <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/app/hr/employees/${r.id}`)}>Xem</Button>
              <Button size="sm" variant="secondary" icon={Pencil} onClick={() => navigate(`/app/hr/employees/${r.id}/edit`)}>Sửa</Button>
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => remove(r)}>Xóa</Button>
            </>
          )}
        />
      )}
    </div>
  )
}
