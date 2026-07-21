import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { roleLabel } from '../../lib/format.js'
import { employeeService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const ROLES = ['ROLE_CASHIER', 'ROLE_WAREHOUSE_MANAGER', 'ROLE_WAREHOUSE_STAFF', 'ROLE_STAFF_MANAGER', 'ROLE_ADMIN', 'ROLE_CEO']

const emptyForm = { code: '', name: '', role: 'ROLE_CASHIER', dept: 'Thu ngân', joined: '', phone: '', status: 'Đang làm', salary: '' }

// Full-page create / edit employee (replaces the old modal).
export default function EmployeeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { setForm(emptyForm); setLoading(false); return }
    const load = async () => {
      const r = await withFallback(() => employeeService.list({ size: 200 }))
      const e = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!e) {
        toast.error('Không tìm thấy nhân viên.')
        navigate('/app/hr/employees')
        return
      }
      setForm({
        code: e.code || e.id || '', name: e.name || '', role: e.role || 'ROLE_CASHIER',
        dept: e.dept || '', joined: e.joined || '', phone: e.phone || '',
        status: e.status || 'Đang làm', salary: e.salary ?? '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    if (!(await confirm({
      title: id ? 'Lưu thay đổi?' : 'Thêm nhân viên?',
      message: id ? `Cập nhật hồ sơ nhân viên ${form.name}.` : `Tạo hồ sơ nhân viên mới${form.name ? ` cho ${form.name}` : ''}.`,
      confirmLabel: id ? 'Lưu' : 'Thêm',
    }))) return
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
    setSaving(true)
    try {
      if (id) await employeeService.update(id, payload)
      else await employeeService.create(payload)
      toast.success(id ? `Đã cập nhật nhân viên ${form.name}.` : `Đã thêm nhân viên ${form.name || 'mới'}.`)
      navigate('/app/hr/employees')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.1"
        title={id ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        subtitle={id ? `Cập nhật hồ sơ ${form.code || id}` : 'Tạo hồ sơ nhân viên mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/hr/employees')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Mã nhân viên" hint={id ? undefined : 'Để trống để hệ thống tự sinh (EMP-####)'}>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Tự sinh" disabled={!!id} />
              </Field>
              <Field label="Họ và tên" required>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn..." />
              </Field>
              <Field label="Vai trò">
                <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
                </Select>
              </Field>
              <Field label="Phòng ban">
                <Input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
              </Field>
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
              <Field label="Điện thoại">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09..." />
              </Field>
              <Field label="Lương (đ)">
                <Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="8500000" />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/hr/employees')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
