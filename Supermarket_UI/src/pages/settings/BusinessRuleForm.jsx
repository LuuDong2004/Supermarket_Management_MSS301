import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { policyService, approvalRequestService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const emptyForm = { code: '', name: '', value: '', category: 'Bán hàng', updatedDate: '' }

// Full-page create / edit business rule (replaces the old modal).
export default function BusinessRuleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const { user } = useAuth()
  const canEdit = user?.role === 'ROLE_CEO'

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { setForm(emptyForm); setLoading(false); return }
    const load = async () => {
      const r = await withFallback(() => policyService.list())
      const rule = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!rule) {
        toast.error('Không tìm thấy quy tắc.')
        navigate('/app/settings/rules')
        return
      }
      setForm({
        code: rule.code || '',
        name: rule.name || '',
        value: rule.value || '',
        category: rule.category || 'Bán hàng',
        updatedDate: rule.updatedDate ? String(rule.updatedDate).slice(0, 10) : '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    if (!(await confirm({
      title: id ? 'Lưu thay đổi quy tắc?' : 'Thêm quy tắc mới?',
      message: id ? `Cập nhật quy tắc "${form.name || form.code}".` : `Tạo quy tắc "${form.name || form.code}".`,
      confirmLabel: id ? 'Lưu' : 'Thêm',
    }))) return
    const payload = {
      code: form.code,
      name: form.name,
      value: form.value,
      category: form.category,
      updatedDate: form.updatedDate || new Date().toISOString().slice(0, 10),
    }
    setSaving(true)
    try {
      if (canEdit) {
        if (id) await policyService.update(id, payload)
        else await policyService.create(payload)
        toast.success(`Đã lưu quy tắc "${form.name}".`)
      } else {
        await approvalRequestService.create({
          code: `CFG-${Date.now()}`,
          type: 'CONFIGURATION',
          requester: user?.fullName || user?.username || 'Administrator',
          target: form.code || form.name,
          reqDate: new Date().toISOString().slice(0, 10),
          status: 'Pending',
          note: `${id ? 'Update' : 'Create'} business rule: ${form.name} = ${form.value}`,
        })
        toast.success('Đã gửi yêu cầu thay đổi để CEO phê duyệt.')
      }
      navigate('/app/settings/rules')
    } catch (e) {
      toast.error(e.message || 'Lưu quy tắc thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Hệ thống · 3.11.2"
        title={id ? 'Sửa quy tắc nghiệp vụ' : 'Thêm quy tắc nghiệp vụ'}
        subtitle={id ? `Cập nhật quy tắc ${form.code || id}` : 'Tạo quy tắc nghiệp vụ mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/settings/rules')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mã quy tắc" hint="Định danh duy nhất, ví dụ: BP01">
                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="BP01" />
              </Field>
              <Field label="Tên quy tắc">
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Hạn mức giảm giá thu ngân" />
              </Field>
              <Field label="Nhóm">
                <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  <option value="Bán hàng">Bán hàng</option>
                  <option value="Kho">Kho</option>
                  <option value="Thành viên">Thành viên</option>
                  <option value="Mua hàng">Mua hàng</option>
                </Select>
              </Field>
              <Field label="Giá trị" hint="Cập nhật hạn mức hoặc ngưỡng áp dụng">
                <Input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="≤ 10%" />
              </Field>
              <Field label="Ngày áp dụng">
                <Input type="date" value={form.updatedDate} onChange={(e) => setForm((f) => ({ ...f, updatedDate: e.target.value }))} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/settings/rules')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
