import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { strategicDecisionService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const CATEGORIES = ['Kinh doanh', 'Nhân sự', 'Khuyến mãi', 'Tài chính', 'Vận hành']
const PRIORITIES = ['Cao', 'Trung bình', 'Thấp']
const STATUSES = ['Nháp', 'Đã ban hành', 'Đang thực thi', 'Hoàn thành']

const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { code: '', title: '', category: 'Kinh doanh', priority: 'Trung bình', status: 'Nháp', decisionDate: today(), owner: 'CEO', description: '' }

// Full-page create / edit strategic decision (replaces the old modal).
export default function StrategicDecisionForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  useEffect(() => {
    if (!id) { setForm(emptyForm); setLoading(false); return }
    const load = async () => {
      const r = await withFallback(() => strategicDecisionService.list())
      setSource(r.source)
      const d = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!d) {
        toast.error('Không tìm thấy quyết định.')
        navigate('/app/ceo/decisions')
        return
      }
      setForm({
        code: d.code || '', title: d.title || '', category: d.category || 'Kinh doanh',
        priority: d.priority || 'Trung bình', status: d.status || 'Nháp',
        decisionDate: (d.decisionDate || today()).slice(0, 10), owner: d.owner || 'CEO', description: d.description || '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề quyết định.'); return }
    const ok = await confirm({
      title: id ? 'Cập nhật quyết định?' : 'Ban hành quyết định?',
      message: id ? `Lưu thay đổi cho quyết định "${form.title}"?` : `Ban hành quyết định chiến lược "${form.title}"?`,
      confirmLabel: id ? 'Lưu' : 'Ban hành',
    })
    if (!ok) return
    const body = {
      code: id ? form.code : `SD-${Date.now().toString().slice(-5)}`,
      title: form.title,
      category: form.category,
      priority: form.priority,
      status: form.status,
      decisionDate: form.decisionDate || today(),
      owner: form.owner || 'CEO',
      description: form.description,
    }
    if (source !== 'backend') { toast.error('Không có kết nối backend để lưu quyết định.'); return }
    setSaving(true)
    try {
      if (id) await strategicDecisionService.update(id, body)
      else await strategicDecisionService.create(body)
      toast.success(id ? `Đã cập nhật quyết định "${form.title}".` : `Đã ban hành quyết định "${form.title}".`)
      navigate('/app/ceo/decisions')
    } catch {
      toast.error('Không thể lưu quyết định chiến lược.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.7"
        title={id ? 'Sửa quyết định' : 'Ban hành quyết định chiến lược'}
        subtitle={id ? `Cập nhật ${form.code || id}` : 'Tạo chỉ đạo chiến lược mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/ceo/decisions')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="space-y-4">
              <Field label="Tiêu đề quyết định" required>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Mở rộng ngành hàng đồ uống nhập khẩu" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Lĩnh vực">
                  <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Mức ưu tiên">
                  <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </Field>
                <Field label="Trạng thái">
                  <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field label="Ngày ban hành">
                  <Input type="date" value={form.decisionDate} onChange={(e) => setForm({ ...form, decisionDate: e.target.value })} />
                </Field>
              </div>
              <Field label="Người phụ trách">
                <Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="VD: CEO, Ban điều hành" />
              </Field>
              <Field label="Nội dung chỉ đạo">
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả mục tiêu và phạm vi của quyết định..." />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/ceo/decisions')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : (id ? 'Lưu thay đổi' : 'Ban hành')}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
