import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { stockCountService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const STATUSES = ['Đang kiểm', 'Hoàn tất']
const emptyForm = { code: '', location: 'Kho A', status: 'Đang kiểm', countDate: '2026-06-15', note: '' }

// Full-page create / edit stock count sheet (replaces the old inline side form).
export default function StockCountForm() {
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
      const r = await withFallback(() => stockCountService.list())
      const c = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!c) {
        toast.error('Không tìm thấy phiếu kiểm kê.')
        navigate('/app/warehouse/stock-count')
        return
      }
      setForm({
        code: c.code || '', location: c.location || 'Kho A', status: c.status || 'Đang kiểm',
        countDate: c.countDate || '2026-06-15', note: c.note || '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    if (!(await confirm({
      title: id ? 'Lưu thay đổi?' : 'Tạo phiếu kiểm kê?',
      message: id ? `Cập nhật phiếu kiểm kê ${form.code || id}.` : `Tạo phiếu kiểm kê ${form.code || 'mới'} tại ${form.location}.`,
      confirmLabel: id ? 'Lưu' : 'Tạo',
    }))) return
    const payload = {
      code: form.code,
      location: form.location,
      status: form.status,
      countDate: form.countDate,
      note: form.note,
    }
    setSaving(true)
    try {
      if (id) await stockCountService.update(id, payload)
      else await stockCountService.create(payload)
      toast.success('Đã lưu phiếu kiểm kê.')
      navigate('/app/warehouse/stock-count')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.3"
        title={id ? 'Sửa phiếu kiểm kê' : 'Tạo phiếu kiểm kê'}
        subtitle={id ? `Cập nhật phiếu ${form.code || id}` : 'Tạo phiếu kiểm kê tồn kho mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/stock-count')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-3xl">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mã phiếu" required>
                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="SC-03" />
              </Field>
              <Field label="Khu vực" required>
                <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Kho A" />
              </Field>
              <Field label="Trạng thái">
                <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Ngày kiểm" required>
                <Input type="date" value={form.countDate} onChange={(e) => setForm((f) => ({ ...f, countDate: e.target.value }))} />
              </Field>
              <Field label="Ghi chú" className="sm:col-span-2">
                <Textarea rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Nhập ghi chú..." />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/warehouse/stock-count')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : (id ? 'Lưu thay đổi' : 'Tạo phiếu')}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
