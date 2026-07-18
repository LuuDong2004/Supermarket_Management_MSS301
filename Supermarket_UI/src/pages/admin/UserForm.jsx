import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Spinner, Divider } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { roleLabel } from '../../lib/format.js'
import { userService, withFallback, toList, mockUsers } from '../../services/index.js'
import { ArrowLeft, Save, Lock, Unlock, Ban, Trash2 } from 'lucide-react'

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_STAFF_MANAGER', 'ROLE_ADMIN', 'ROLE_CEO']

// Backend Role enum is the bare name (CASHIER, ADMIN...) - strip the ROLE_ prefix on write.
const toBackendRole = (r) => (r || '').replace(/^ROLE_/, '')

const emptyForm = {
  username: '', email: '', password: '', fullName: '', phone: '',
  role: 'ROLE_CASHIER', status: 'ACTIVE', approval: 'PENDING',
}

// Full-page create / edit user account (replaces the old modal).
export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { setForm(emptyForm); setLoading(false); return }
    const load = async () => {
      const r = await withFallback(() => userService.list({ page: 0, size: 50 }), mockUsers)
      const u = toList(r.data).find((x) => String(x.id) === String(id))
      if (!u) {
        toast.error('Không tìm thấy tài khoản.')
        navigate('/app/admin/users')
        return
      }
      setForm({
        username: u.username || '', email: u.email || '', password: '',
        fullName: u.fullName || '', phone: u.phone || '',
        role: u.role || 'ROLE_CASHIER', status: u.status || 'ACTIVE', approval: u.approval || 'APPROVED',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.username.trim()) next.username = 'Nhập username.'
    if (!form.fullName.trim()) next.fullName = 'Nhập họ và tên.'
    if (!form.email.trim()) next.email = 'Nhập email.'
    if (!id && form.password.length < 8) next.password = 'Mật khẩu tối thiểu 8 ký tự.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const save = async () => {
    if (!validate()) return
    if (!(await confirm({
      title: id ? 'Lưu thay đổi tài khoản?' : 'Tạo tài khoản mới?',
      message: id ? `Cập nhật thông tin tài khoản ${form.username}.` : `Tạo tài khoản ${form.username} cho ${form.fullName}.`,
      confirmLabel: id ? 'Lưu' : 'Tạo',
    }))) return
    setSaving(true)
    try {
      if (id) {
        await userService.update(id, {
          username: form.username, email: form.email, fullName: form.fullName,
          phone: form.phone, role: toBackendRole(form.role), status: form.status,
        })
        toast.success(`Đã cập nhật tài khoản ${form.fullName}.`)
      } else {
        await userService.create({
          username: form.username, email: form.email, password: form.password,
          fullName: form.fullName, phone: form.phone, role: toBackendRole(form.role),
        })
        toast.success(`Đã tạo tài khoản ${form.fullName}.`)
      }
      navigate('/app/admin/users')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!(await confirm({ title: 'Xóa tài khoản?', message: `Tài khoản ${form.fullName || form.username} sẽ bị xóa vĩnh viễn.`, confirmLabel: 'Xóa', danger: true }))) return
    try {
      await userService.remove(id)
      toast.success(`Đã xóa tài khoản ${form.fullName}.`)
      navigate('/app/admin/users')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const changeStatus = async (action) => {
    const verb = { lock: 'khóa', unlock: 'mở khóa', deactivate: 'vô hiệu hóa' }[action]
    const nextStatus = { lock: 'LOCKED', unlock: 'ACTIVE', deactivate: 'INACTIVE' }[action]
    const title = { lock: 'Khóa tài khoản?', unlock: 'Mở khóa tài khoản?', deactivate: 'Vô hiệu hóa tài khoản?' }[action]
    if (!(await confirm({
      title,
      message: `Tài khoản ${form.fullName || form.username} sẽ được ${verb}.`,
      confirmLabel: { lock: 'Khóa', unlock: 'Mở khóa', deactivate: 'Vô hiệu hóa' }[action],
      danger: action !== 'unlock',
    }))) return
    try {
      await userService[action](id)
      toast.success(`Đã ${verb} tài khoản ${form.fullName}.`)
      setForm((prev) => ({ ...prev, status: nextStatus }))
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.1"
        title={id ? 'Sửa tài khoản' : 'Tạo tài khoản'}
        subtitle={id ? `Đang sửa: ${form.username}` : 'Nhập thông tin tài khoản mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/admin/users')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Username" required error={errors.username}>
                <Input value={form.username} onChange={(e) => setField('username', e.target.value)} placeholder="cashier_le" disabled={!!id} />
              </Field>
              <Field label="Họ và tên" required error={errors.fullName}>
                <Input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Nguyễn Văn..." />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="user@mss301.vn" />
              </Field>
              {!id && (
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

            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {id && (
                  form.status === 'LOCKED' ? (
                    <Button variant="success" icon={Unlock} onClick={() => changeStatus('unlock')}>Mở khóa</Button>
                  ) : (
                    <Button variant="danger" icon={Lock} onClick={() => changeStatus('lock')}>Khóa</Button>
                  )
                )}
                {id && form.status !== 'INACTIVE' && (
                  <Button variant="secondary" icon={Ban} onClick={() => changeStatus('deactivate')}>Vô hiệu hóa</Button>
                )}
                {id && <Button variant="danger" icon={Trash2} onClick={remove}>Xóa</Button>}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate('/app/admin/users')}>Hủy</Button>
                <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : id ? 'Lưu thay đổi' : 'Tạo tài khoản'}</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
