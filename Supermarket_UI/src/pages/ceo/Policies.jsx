import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import { policyService, withFallback, toList, mockPolicies } from '../../services/index.js'
import { Plus, Pencil, Trash2 } from 'lucide-react'

function catTone(cat) {
  const map = { 'Bán hàng': 'brand', Kho: 'amber', 'Thành viên': 'violet', 'Mua hàng': 'blue' }
  return map[cat] || 'slate'
}

const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { code: '', name: '', value: '', category: 'Bán hàng' }

export default function Policies() {
  const toast = useToast()
  const [policies, setPolicies] = useState([])
  const [source, setSource] = useState('backend')
  const [category, setCategory] = useState('')
  const [editing, setEditing] = useState(null) // policy object or 'new'
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    const res = await withFallback(() => policyService.list(), mockPolicies)
    setPolicies(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const categories = useMemo(() => [...new Set(policies.map((p) => p.category))], [policies])

  const rows = useMemo(
    () => (category ? policies.filter((p) => p.category === category) : policies),
    [category, policies],
  )

  const openNew = () => {
    setForm(emptyForm)
    setEditing('new')
  }
  const openEdit = (p) => {
    setForm({ code: p.code, name: p.name, value: p.value, category: p.category })
    setEditing(p)
  }
  const submit = async () => {
    const isNew = editing === 'new'
    const body = {
      code: form.code || `BP-${Date.now().toString().slice(-5)}`,
      name: form.name,
      value: form.value,
      category: form.category,
      updatedDate: today(),
    }
    if (source === 'backend') {
      try {
        if (isNew) await policyService.create(body)
        else await policyService.update(editing.id, body)
        toast.success(isNew ? `Đã thêm chính sách "${form.name}".` : `Đã cập nhật chính sách "${form.name}".`)
        setEditing(null)
        await load()
        return
      } catch {
        toast.error('Không thể lưu chính sách. Cập nhật tạm thời.')
      }
    }
    // Offline / demo fallback: mutate local state only.
    setPolicies((ps) =>
      isNew
        ? [{ ...body, updatedDate: body.updatedDate }, ...ps]
        : ps.map((p) => (p.code === editing.code ? { ...p, ...body } : p)),
    )
    toast.success(isNew ? `Đã thêm chính sách "${form.name}".` : `Đã cập nhật chính sách "${form.name}".`)
    setEditing(null)
  }
  const remove = async (p) => {
    if (source === 'backend' && p.id) {
      try {
        await policyService.remove(p.id)
        toast.success(`Đã xóa chính sách "${p.name}".`)
        await load()
        return
      } catch {
        toast.error('Không thể xóa chính sách. Cập nhật tạm thời.')
      }
    }
    setPolicies((ps) => ps.filter((x) => x.code !== p.code))
    toast.success(`Đã xóa chính sách "${p.name}".`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.3"
        title="Chính sách kinh doanh"
        subtitle="Quản lý các quy tắc và ngưỡng vận hành toàn hệ thống."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={openNew}>Thêm chính sách</Button>
          </div>
        }
      />

      <FilterBar>
        <Field label="Nhóm chính sách">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tất cả nhóm</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </FilterBar>

      <DataTable
        rows={rows}
        rowKey="code"
        empty={{ title: 'Không có chính sách', subtitle: 'Thử đổi bộ lọc hoặc thêm chính sách mới.' }}
        columns={[
          { key: 'code', header: 'Mã', render: (p) => <span className="font-mono text-xs">{p.code}</span> },
          { key: 'name', header: 'Tên chính sách', render: (p) => <span className="font-medium text-slate-700">{p.name}</span> },
          { key: 'value', header: 'Giá trị', render: (p) => <span className="font-semibold text-brand-700">{p.value}</span> },
          { key: 'category', header: 'Nhóm', render: (p) => <Badge tone={catTone(p.category)}>{p.category}</Badge> },
          { key: 'updatedDate', header: 'Cập nhật', render: (p) => formatDate(p.updatedDate) },
        ]}
        actions={(p) => (
          <>
            <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEdit(p)}>Sửa</Button>
            <Button size="sm" variant="danger" icon={Trash2} onClick={() => remove(p)}>Xóa</Button>
          </>
        )}
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Thêm chính sách' : 'Sửa chính sách'}
        subtitle={editing && editing !== 'new' ? editing.code : 'Tạo quy tắc vận hành mới'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Hủy</Button>
            <Button onClick={submit}>{editing === 'new' ? 'Thêm' : 'Lưu thay đổi'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Tên chính sách" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Hạn mức giảm giá thu ngân" />
          </Field>
          <Field label="Giá trị" required hint="VD: ≤ 10%, 30 ngày, 1đ / 10.000đ...">
            <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Giá trị áp dụng" />
          </Field>
          <Field label="Nhóm">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Bán hàng', 'Kho', 'Thành viên', 'Mua hàng'].map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
      </Modal>
    </div>
  )
}
