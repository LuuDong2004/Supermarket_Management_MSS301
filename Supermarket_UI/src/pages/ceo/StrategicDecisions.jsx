import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Textarea, EmptyState } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import { strategicDecisionService, withFallback, toList } from '../../services/index.js'
import { Plus, Pencil, Trash2, Lightbulb, Flag, Rocket, CheckCircle2 } from 'lucide-react'

const CATEGORIES = ['Kinh doanh', 'Nhân sự', 'Khuyến mãi', 'Tài chính', 'Vận hành']
const PRIORITIES = ['Cao', 'Trung bình', 'Thấp']
const STATUSES = ['Nháp', 'Đã ban hành', 'Đang thực thi', 'Hoàn thành']

const catTone = (c) => ({ 'Kinh doanh': 'brand', 'Nhân sự': 'violet', 'Khuyến mãi': 'amber', 'Tài chính': 'green', 'Vận hành': 'blue' }[c] || 'slate')
const prioTone = (p) => ({ Cao: 'red', 'Trung bình': 'amber', Thấp: 'slate' }[p] || 'slate')

const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { title: '', category: 'Kinh doanh', priority: 'Trung bình', status: 'Nháp', decisionDate: today(), owner: 'CEO', description: '' }

export default function StrategicDecisions() {
  const toast = useToast()
  const [decisions, setDecisions] = useState([])
  const [source, setSource] = useState('backend')
  const [category, setCategory] = useState('')
  const [editing, setEditing] = useState(null) // decision object or 'new'
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    const res = await withFallback(() => strategicDecisionService.list())
    setDecisions(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(
    () => (category ? decisions.filter((d) => d.category === category) : decisions),
    [category, decisions],
  )

  const counts = useMemo(() => ({
    total: decisions.length,
    active: decisions.filter((d) => d.status === 'Đang thực thi').length,
    issued: decisions.filter((d) => d.status === 'Đã ban hành').length,
    done: decisions.filter((d) => d.status === 'Hoàn thành').length,
  }), [decisions])

  const openNew = () => { setForm(emptyForm); setEditing('new') }
  const openEdit = (d) => {
    setForm({
      title: d.title, category: d.category, priority: d.priority, status: d.status,
      decisionDate: (d.decisionDate || today()).slice(0, 10), owner: d.owner, description: d.description || '',
    })
    setEditing(d)
  }

  const submit = async () => {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề quyết định.'); return }
    const isNew = editing === 'new'
    const body = {
      code: isNew ? `SD-${Date.now().toString().slice(-5)}` : editing.code,
      title: form.title,
      category: form.category,
      priority: form.priority,
      status: form.status,
      decisionDate: form.decisionDate || today(),
      owner: form.owner || 'CEO',
      description: form.description,
    }
    if (source !== 'backend') { toast.error('Không có kết nối backend để lưu quyết định.'); return }
    try {
      if (isNew) await strategicDecisionService.create(body)
      else await strategicDecisionService.update(editing.id, body)
      toast.success(isNew ? `Đã ban hành quyết định "${form.title}".` : `Đã cập nhật quyết định "${form.title}".`)
      setEditing(null)
      await load()
    } catch {
      toast.error('Không thể lưu quyết định chiến lược.')
    }
  }

  const remove = async (d) => {
    if (source !== 'backend' || !d.id) { toast.error('Không có kết nối backend để xóa.'); return }
    try {
      await strategicDecisionService.remove(d.id)
      toast.success(`Đã xóa quyết định "${d.title}".`)
      await load()
    } catch {
      toast.error('Không thể xóa quyết định.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.7"
        title="Quyết định chiến lược"
        subtitle="Ban hành và theo dõi các chỉ đạo chiến lược của ban điều hành."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={openNew}>Ban hành quyết định</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng quyết định" value={counts.total} icon={Lightbulb} tone="brand" />
        <StatCard label="Đã ban hành" value={counts.issued} icon={Flag} tone="blue" />
        <StatCard label="Đang thực thi" value={counts.active} icon={Rocket} tone="amber" />
        <StatCard label="Hoàn thành" value={counts.done} icon={CheckCircle2} tone="green" />
      </div>

      <FilterBar>
        <Field label="Lĩnh vực">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tất cả lĩnh vực</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </FilterBar>

      {rows.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState icon={Lightbulb} title="Chưa có quyết định chiến lược" subtitle="Nhấn “Ban hành quyết định” để tạo mới." />
          </CardBody>
        </Card>
      ) : (
        <DataTable
          rows={rows}
          rowKey="code"
          columns={[
            { key: 'code', header: 'Mã', render: (d) => <span className="font-mono text-xs">{d.code}</span> },
            { key: 'title', header: 'Tiêu đề', render: (d) => <span className="font-medium text-slate-700">{d.title}</span> },
            { key: 'category', header: 'Lĩnh vực', render: (d) => <Badge tone={catTone(d.category)}>{d.category}</Badge> },
            { key: 'priority', header: 'Ưu tiên', render: (d) => <Badge tone={prioTone(d.priority)}>{d.priority}</Badge> },
            { key: 'status', header: 'Trạng thái', render: (d) => <StatusBadge status={d.status} /> },
            { key: 'decisionDate', header: 'Ngày', render: (d) => formatDate(d.decisionDate) },
            { key: 'owner', header: 'Phụ trách' },
            { key: 'actions', header: '', align: 'right', render: (d) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" icon={Pencil} onClick={(e) => { e.stopPropagation(); openEdit(d) }}>Sửa</Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={(e) => { e.stopPropagation(); remove(d) }}>Xóa</Button>
              </div>
            ) },
          ]}
        />
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Ban hành quyết định chiến lược' : 'Sửa quyết định'}
        subtitle={editing && editing !== 'new' ? editing.code : 'Tạo chỉ đạo chiến lược mới'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Hủy</Button>
            <Button onClick={submit}>{editing === 'new' ? 'Ban hành' : 'Lưu thay đổi'}</Button>
          </>
        }
      >
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
      </Modal>
    </div>
  )
}
