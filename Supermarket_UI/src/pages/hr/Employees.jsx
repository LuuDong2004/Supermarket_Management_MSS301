import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate, roleLabel, initials, isoDate } from '../../lib/format.js'
import { employeeService, staffShiftService, withFallback, toList, mockEmployees } from '../../services/index.js'
import { Users, UserCheck, UserX, Building2, Plus, Phone, Calendar, BadgeDollarSign, Search, Trash2, Pencil } from 'lucide-react'

const todayIso = () => isoDate()
const isInactive = (status) => (status || '').toLowerCase().includes('nghỉ')

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE', 'ROLE_ADMIN', 'ROLE_CEO', 'ROLE_SUPPLIER']

const emptyForm = { id: null, code: '', name: '', role: 'ROLE_CASHIER', dept: 'Thu ngân', joined: '', phone: '', status: 'Đang làm', salary: '' }

export default function Employees() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)

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

  const openCreate = () => { setForm(emptyForm); setCreating(true) }
  const openEdit = (e) => {
    setForm({
      id: e.id, code: e.code || e.id || '', name: e.name || '', role: e.role || 'ROLE_CASHIER',
      dept: e.dept || '', joined: e.joined || '', phone: e.phone || '', status: e.status || 'Đang làm',
      salary: e.salary ?? '',
    })
    setSelected(null)
    setCreating(true)
  }

  const save = async () => {
    const payload = {
      // Blank on create → backend auto-generates EMP-####.
      code: (form.code || '').trim() || null,
      name: form.name,
      role: form.role,
      dept: form.dept,
      joined: form.joined || null,
      phone: form.phone,
      status: form.status,
      salary: form.salary === '' ? null : Number(form.salary),
    }
    try {
      if (form.id) await employeeService.update(form.id, payload)
      else await employeeService.create(payload)
      toast.success(form.id ? `Đã cập nhật nhân viên ${form.name}.` : `Đã thêm nhân viên ${form.name || 'mới'}.`)
      setCreating(false)
      setForm(emptyForm)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const remove = async (row) => {
    try {
      await employeeService.remove(row.id)
      toast.success('Đã xóa nhân viên.')
      setSelected(null)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const toggleActive = async (row) => {
    try {
      if (isInactive(row.status)) await employeeService.activate(row.id)
      else await employeeService.deactivate(row.id)
      toast.success(isInactive(row.status) ? `Đã kích hoạt lại ${row.name}.` : `Đã cho ${row.name} nghỉ việc.`)
      setSelected(null)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const history = [
    { date: '2024-05-01', text: 'Gia nhập công ty — Thu ngân' },
    { date: '2024-11-20', text: 'Hoàn thành đào tạo POS nâng cao' },
    { date: '2025-06-01', text: 'Đánh giá hiệu suất loại A — tăng lương 6%' },
    { date: '2026-01-15', text: 'Phụ trách ca tối' },
  ]

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.1"
        title="Hồ sơ nhân viên"
        subtitle="Quản lý thông tin, phòng ban và lương của nhân viên."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={openCreate}>Thêm nhân viên</Button>
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
          onRowClick={(r) => setSelected(r)}
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
            { key: 'phone', header: 'Điện thoại', render: (r) => <span className="font-mono text-xs">{r.phone}</span> },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            { key: 'salary', header: 'Lương', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.salary)}</span> },
          ]}
        />
      )}

      {/* Create / edit employee modal */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title={form.id ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        subtitle={form.id ? `Cập nhật hồ sơ ${form.code || form.id}` : 'Tạo hồ sơ nhân viên mới'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreating(false)}>Hủy</Button>
            <Button onClick={save}>Lưu hồ sơ</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mã nhân viên" hint={form.id ? undefined : 'Để trống để hệ thống tự sinh (EMP-####)'}>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Tự sinh" disabled={!!form.id} />
            </Field>
            <Field label="Họ và tên" required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn..." />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vai trò">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
              </Select>
            </Field>
            <Field label="Phòng ban">
              <Input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ngày vào làm">
              <Input type="date" value={form.joined} onChange={(e) => setForm({ ...form, joined: e.target.value })} />
            </Field>
            <Field label="Trạng thái">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Đang làm">Đang làm</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Điện thoại">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09..." />
            </Field>
            <Field label="Lương (đ)">
              <Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="8500000" />
            </Field>
          </div>
        </div>
      </Modal>

      {/* Profile detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        size="lg"
        title={selected?.name}
        subtitle={selected ? `${selected.code || selected.id} · ${roleLabel(selected.role)}` : ''}
        footer={
          selected && (
            <>
              <Button variant="danger" icon={Trash2} onClick={() => remove(selected)}>Xóa</Button>
              <Button
                variant={isInactive(selected.status) ? 'success' : 'secondary'}
                icon={isInactive(selected.status) ? UserCheck : UserX}
                onClick={() => toggleActive(selected)}
              >
                {isInactive(selected.status) ? 'Kích hoạt' : 'Vô hiệu hóa'}
              </Button>
              <Button variant="secondary" icon={Pencil} onClick={() => openEdit(selected)}>Sửa</Button>
              <Button variant="secondary" onClick={() => setSelected(null)}>Đóng</Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={Building2} label="Phòng ban" value={selected.dept} />
              <InfoRow icon={Calendar} label="Ngày vào làm" value={formatDate(selected.joined)} />
              <InfoRow icon={Phone} label="Điện thoại" value={selected.phone} />
              <InfoRow icon={BadgeDollarSign} label="Lương" value={formatCurrency(selected.salary)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Trạng thái:</span>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Lịch sử công tác</p>
              <ol className="relative ml-2 space-y-4 border-l border-slate-200 pl-5">
                {history.map((h, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
                    <p className="text-xs font-medium text-brand-600">{formatDate(h.date)}</p>
                    <p className="text-sm text-slate-700">{h.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}
