import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { roleLabel } from '../../lib/format.js'
import { userService, withFallback, toList, mockUsers } from '../../services/index.js'
import { Search, UserPlus, Info, RotateCcw, Trash2, Pencil } from 'lucide-react'

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_STAFF_MANAGER', 'ROLE_ADMIN', 'ROLE_CEO']

export default function Users() {
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [approval, setApproval] = useState('')
  const [applied, setApplied] = useState({ search: '', role: '', status: '', approval: '' })

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

  const apply = () => setApplied({ search, role, status, approval })
  const reset = () => {
    setSearch('')
    setRole('')
    setStatus('')
    setApproval('')
    setApplied({ search: '', role: '', status: '', approval: '' })
  }

  // Create/edit live on their own page: /app/admin/users/new, /:id/edit.
  const openEditUser = (u) => navigate(`/app/admin/users/${u.id}/edit`)
  const openNewUser = () => navigate('/app/admin/users/new')

  const remove = async (u) => {
    if (!(await confirm({ title: 'Xóa tài khoản?', message: `Tài khoản ${u.fullName || u.username} sẽ bị xóa vĩnh viễn.`, confirmLabel: 'Xóa', danger: true }))) return
    try {
      await userService.remove(u.id)
      toast.success(`Đã xóa tài khoản ${u.fullName || u.username}.`)
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
          <div className="flex gap-2 !grow-0 !basis-auto">
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
              { key: 'username', header: 'Username', render: (u) => <span className="font-medium text-slate-700">{u.username}</span> },
              { key: 'fullName', header: 'Họ tên' },
              { key: 'role', header: 'Vai trò', render: (u) => <Badge tone="brand">{roleLabel(u.role)}</Badge> },
              { key: 'status', header: 'Trạng thái', render: (u) => <StatusBadge status={u.status} /> },
              { key: 'approval', header: 'Phê duyệt', render: (u) => <Badge tone={u.approval === 'APPROVED' ? 'green' : 'amber'}>{u.approval || '—'}</Badge> },
            ]}
            actions={(u) => (
              <>
                <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEditUser(u)}>Sửa</Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => remove(u)}>Xóa</Button>
              </>
            )}
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

    </div>
  )
}
