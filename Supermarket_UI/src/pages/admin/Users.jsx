import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Spinner, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { roleLabel } from '../../lib/format.js'
import { api } from '../../lib/api.js'
import * as db from '../../mock/db.js'
import { Search, UserPlus, Lock, Unlock, Save, Info, RotateCcw } from 'lucide-react'

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE', 'ROLE_ADMIN', 'ROLE_CEO', 'ROLE_SUPPLIER']

// Build fallback user rows from mock employees when backend is unreachable.
function mockUsers() {
  return db.employees.map((e, i) => ({
    id: e.id,
    username: e.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || `user${i}`,
    fullName: e.name,
    role: e.role,
    status: 'ACTIVE',
    approval: 'APPROVED',
  }))
}

const emptyForm = { id: null, fullName: '', role: 'ROLE_CASHIER', status: 'ACTIVE', approval: 'PENDING' }

export default function Users() {
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('mock')

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [approval, setApproval] = useState('')
  const [applied, setApplied] = useState({ search: '', role: '', status: '', approval: '' })

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await api.get('/users?page=0&size=50')
        if (!alive) return
        setUsers(res.content || res)
        setSource('backend')
      } catch {
        if (!alive) return
        setUsers(mockUsers())
        setSource('mock')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const rows = useMemo(() => {
    const q = applied.search.trim().toLowerCase()
    return users.filter((u) => {
      if (q && !(u.username || '').toLowerCase().includes(q) && !(u.fullName || '').toLowerCase().includes(q)) return false
      if (applied.role && u.role !== applied.role) return false
      if (applied.status && u.status !== applied.status) return false
      if (applied.approval && u.approval !== applied.approval) return false
      return true
    })
  }, [users, applied])

  const apply = () => setApplied({ search, role, status, approval })
  const reset = () => {
    setSearch(''); setRole(''); setStatus(''); setApproval('')
    setApplied({ search: '', role: '', status: '', approval: '' })
  }

  const editUser = (u) => setForm({ id: u.id, fullName: u.fullName || '', role: u.role, status: u.status || 'ACTIVE', approval: u.approval || 'APPROVED' })
  const newUser = () => setForm(emptyForm)

  const save = () => {
    toast.success(form.id ? `Đã cập nhật tài khoản ${form.fullName}.` : `Đã tạo tài khoản ${form.fullName}.`)
    setForm(emptyForm)
  }
  const toggleLock = () => {
    const locked = form.status === 'LOCKED'
    toast.success(locked ? `Đã mở khóa ${form.fullName}.` : `Đã khóa ${form.fullName}.`)
    setForm({ ...form, status: locked ? 'ACTIVE' : 'LOCKED' })
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.1"
        title="Tài khoản người dùng"
        subtitle="Quản lý tài khoản, vai trò và trạng thái phê duyệt."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2">
          <FilterBar>
            <Field label="Tìm kiếm" className="grow">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Username / họ tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </Field>
            <Field label="Vai trò">
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Tất cả</option>
                {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
              </Select>
            </Field>
            <Field label="Trạng thái">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="LOCKED">LOCKED</option>
              </Select>
            </Field>
            <Field label="Phê duyệt">
              <Select value={approval} onChange={(e) => setApproval(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PENDING">PENDING</option>
              </Select>
            </Field>
            <div className="flex gap-2">
              <Button onClick={apply}>Áp dụng</Button>
              <Button variant="secondary" icon={RotateCcw} onClick={reset}>Đặt lại</Button>
            </div>
          </FilterBar>

          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner className="h-7 w-7" />
            </div>
          ) : (
            <DataTable
              rows={rows}
              onRowClick={editUser}
              empty={{ title: 'Không có tài khoản', subtitle: 'Thử đổi bộ lọc.' }}
              columns={[
                { key: 'username', header: 'Username', render: (u) => (
                  <div>
                    <p className="font-medium text-slate-700">{u.username}</p>
                    <p className="font-mono text-xs text-slate-400">{u.id}</p>
                  </div>
                ) },
                { key: 'fullName', header: 'Họ tên' },
                { key: 'role', header: 'Vai trò', render: (u) => <Badge tone="brand">{roleLabel(u.role)}</Badge> },
                { key: 'status', header: 'Trạng thái', render: (u) => <StatusBadge status={u.status} /> },
                { key: 'approval', header: 'Phê duyệt', render: (u) => <Badge tone={u.approval === 'APPROVED' ? 'green' : 'amber'}>{u.approval}</Badge> },
              ]}
            />
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Biểu mẫu tài khoản" subtitle={form.id ? `Đang sửa: ${form.id}` : 'Tạo tài khoản mới'} icon={UserPlus} />
            <CardBody className="space-y-4">
              <Field label="Họ và tên" required>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Văn..." />
              </Field>
              <Field label="Vai trò">
                <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
                </Select>
              </Field>
              <Field label="Trạng thái tài khoản">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="LOCKED">LOCKED</option>
                </Select>
              </Field>
              <Field label="Trạng thái phê duyệt">
                <Select value={form.approval} onChange={(e) => setForm({ ...form, approval: e.target.value })}>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                </Select>
              </Field>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Button icon={Save} onClick={save}>{form.id ? 'Lưu thay đổi' : 'Tạo tài khoản'}</Button>
                {form.id && (
                  <Button
                    variant={form.status === 'LOCKED' ? 'success' : 'danger'}
                    icon={form.status === 'LOCKED' ? Unlock : Lock}
                    onClick={toggleLock}
                  >
                    {form.status === 'LOCKED' ? 'Mở khóa' : 'Khóa'}
                  </Button>
                )}
                {form.id && <Button variant="ghost" onClick={newUser}>Mới</Button>}
              </div>
            </CardBody>
          </Card>

          <Card className="border-amber-200 bg-amber-50/60">
            <CardBody className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Info size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Lưu ý</p>
                <p className="mt-0.5 text-sm text-amber-700">Thay đổi vai trò/quyền cần CEO phê duyệt.</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
