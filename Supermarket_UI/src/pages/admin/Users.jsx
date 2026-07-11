import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Spinner, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { roleLabel } from '../../lib/format.js'
import { userService, withFallback, toList, mockUsers } from '../../services/index.js'
import { Search, UserPlus, Lock, Unlock, Save, Info, RotateCcw, Trash2, Ban } from 'lucide-react'

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_ADMIN', 'ROLE_CEO', 'ROLE_SUPPLIER']

// Backend Role enum is the bare name (CASHIER, ADMIN...) - strip the ROLE_ prefix on write.
const toBackendRole = (r) => (r || '').replace(/^ROLE_/, '')

const emptyForm = {
  id: null,
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  role: 'ROLE_CASHIER',
  status: 'ACTIVE',
  approval: 'PENDING',
}

export default function Users() {
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [approval, setApproval] = useState('')
  const [applied, setApplied] = useState({ search: '', role: '', status: '', approval: '' })

  const [form, setForm] = useState(emptyForm)
  const [formOpen, setFormOpen] = useState(false)
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => userService.list({ page: 0, size: 50 }), mockUsers)
    setUsers(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

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

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.username.trim()) next.username = 'Nhập username.'
    if (!form.fullName.trim()) next.fullName = 'Nhập họ và tên.'
    if (!form.email.trim()) next.email = 'Nhập email.'
    if (!form.id && form.password.length < 8) next.password = 'Mật khẩu tối thiểu 8 ký tự.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const apply = () => setApplied({ search, role, status, approval })
  const reset = () => {
    setSearch('')
    setRole('')
    setStatus('')
    setApproval('')
    setApplied({ search: '', role: '', status: '', approval: '' })
  }

  const openEditUser = (u) => {
    setForm({
      id: u.id,
      username: u.username || '',
      email: u.email || '',
      password: '',
      fullName: u.fullName || '',
      phone: u.phone || '',
      role: u.role || 'ROLE_CASHIER',
      status: u.status || 'ACTIVE',
      approval: u.approval || 'APPROVED',
    })
    setErrors({})
    setFormOpen(true)
  }

  const openNewUser = () => {
    setForm(emptyForm)
    setErrors({})
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setErrors({})
  }

  const save = async () => {
    if (!validate()) return
    try {
      if (form.id) {
        await userService.update(form.id, {
          username: form.username,
          email: form.email,
          fullName: form.fullName,
          phone: form.phone,
          role: toBackendRole(form.role),
          status: form.status,
        })
        toast.success(`Đã cập nhật tài khoản ${form.fullName}.`)
      } else {
        await userService.create({
          username: form.username,
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          phone: form.phone,
          role: toBackendRole(form.role),
        })
        toast.success(`Đã tạo tài khoản ${form.fullName}.`)
      }
      setForm(emptyForm)
      setFormOpen(false)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const remove = async () => {
    if (!form.id) return
    try {
      await userService.remove(form.id)
      toast.success(`Đã xóa tài khoản ${form.fullName}.`)
      setForm(emptyForm)
      setFormOpen(false)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const changeStatus = async (action) => {
    if (!form.id) return
    const verb = { lock: 'khóa', unlock: 'mở khóa', deactivate: 'vô hiệu hóa' }[action]
    const nextStatus = { lock: 'LOCKED', unlock: 'ACTIVE', deactivate: 'INACTIVE' }[action]
    try {
      await userService[action](form.id)
      toast.success(`Đã ${verb} tài khoản ${form.fullName}.`)
      setForm({ ...form, status: nextStatus })
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.1"
        title="Tài khoản người dùng"
        subtitle="Quản lý tài khoản, vai trò và trạng thái phê duyệt."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={UserPlus} onClick={openNewUser}>Tạo tài khoản</Button>
          </div>
        }
      />

      <div className="space-y-6">
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
            onRowClick={openEditUser}
            empty={{ title: 'Không có tài khoản', subtitle: 'Thử đổi bộ lọc.' }}
            columns={[
              { key: 'username', header: 'Username', render: (u) => (
                <div>
                  <p className="font-medium text-slate-700">{u.username}</p>
                  <p className="break-all font-mono text-xs text-slate-400">{u.id}</p>
                </div>
              ) },
              { key: 'fullName', header: 'Họ tên' },
              { key: 'role', header: 'Vai trò', render: (u) => <Badge tone="brand">{roleLabel(u.role)}</Badge> },
              { key: 'status', header: 'Trạng thái', render: (u) => <StatusBadge status={u.status} /> },
              { key: 'approval', header: 'Phê duyệt', render: (u) => <Badge tone={u.approval === 'APPROVED' ? 'green' : 'amber'}>{u.approval || '—'}</Badge> },
            ]}
          />
        )}

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

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={form.id ? 'Sửa tài khoản' : 'Tạo tài khoản'}
        subtitle={form.id ? `Đang sửa: ${form.username}` : 'Nhập thông tin tài khoản mới'}
        size="lg"
        footer={
          <div className="flex w-full flex-wrap justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {form.id && (
                form.status === 'LOCKED' ? (
                  <Button variant="success" icon={Unlock} onClick={() => changeStatus('unlock')}>Mở khóa</Button>
                ) : (
                  <Button variant="danger" icon={Lock} onClick={() => changeStatus('lock')}>Khóa</Button>
                )
              )}
              {form.id && form.status !== 'INACTIVE' && (
                <Button variant="secondary" icon={Ban} onClick={() => changeStatus('deactivate')}>Vô hiệu hóa</Button>
              )}
              {form.id && <Button variant="danger" icon={Trash2} onClick={remove}>Xóa</Button>}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={closeForm}>Hủy</Button>
              <Button icon={Save} onClick={save}>{form.id ? 'Lưu thay đổi' : 'Tạo tài khoản'}</Button>
            </div>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Username" required error={errors.username}>
            <Input value={form.username} onChange={(e) => setField('username', e.target.value)} placeholder="cashier_le" disabled={!!form.id} />
          </Field>
          <Field label="Họ và tên" required error={errors.fullName}>
            <Input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Nguyễn Văn..." />
          </Field>
          <Field label="Email" required error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="user@mss301.vn" />
          </Field>
          {!form.id && (
            <Field label="Mật khẩu" required error={errors.password}>
              <Input type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="Tối thiểu 8 ký tự" />
            </Field>
          )}
          <Field label="Điện thoại">
            <Input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="09..." />
          </Field>
          <Field label="Vai trò">
            <Select value={form.role} onChange={(e) => setField('role', e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </Select>
          </Field>
          <Field label="Trạng thái tài khoản">
            <Select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="LOCKED">LOCKED</option>
              <option value="INACTIVE">INACTIVE</option>
            </Select>
          </Field>
          <Field label="Trạng thái phê duyệt">
            <Select value={form.approval} onChange={(e) => setField('approval', e.target.value)}>
              <option value="APPROVED">APPROVED</option>
              <option value="PENDING">PENDING</option>
            </Select>
          </Field>
        </div>
        <Divider />
        <p className="text-xs text-slate-400">Chọn một dòng trong bảng để sửa tài khoản hiện có.</p>
      </Modal>
    </div>
  )
}
