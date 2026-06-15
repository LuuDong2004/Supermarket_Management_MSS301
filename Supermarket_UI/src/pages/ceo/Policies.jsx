import { useState, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Plus, Pencil } from 'lucide-react'

function catTone(cat) {
  const map = { 'Bán hàng': 'brand', Kho: 'amber', 'Thành viên': 'violet', 'Mua hàng': 'blue' }
  return map[cat] || 'slate'
}

export default function Policies() {
  const toast = useToast()
  const [category, setCategory] = useState('')
  const [editing, setEditing] = useState(null) // policy object or 'new'
  const [form, setForm] = useState({ name: '', value: '', category: 'Bán hàng' })

  const categories = useMemo(() => [...new Set(db.businessPolicies.map((p) => p.category))], [])

  const rows = useMemo(
    () => (category ? db.businessPolicies.filter((p) => p.category === category) : db.businessPolicies),
    [category],
  )

  const openNew = () => {
    setForm({ name: '', value: '', category: 'Bán hàng' })
    setEditing('new')
  }
  const openEdit = (p) => {
    setForm({ name: p.name, value: p.value, category: p.category })
    setEditing(p)
  }
  const submit = () => {
    const isNew = editing === 'new'
    setEditing(null)
    toast.success(isNew ? `Đã thêm chính sách "${form.name}".` : `Đã cập nhật chính sách "${form.name}".`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.3"
        title="Chính sách kinh doanh"
        subtitle="Quản lý các quy tắc và ngưỡng vận hành toàn hệ thống."
        actions={<Button icon={Plus} onClick={openNew}>Thêm chính sách</Button>}
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
        empty={{ title: 'Không có chính sách', subtitle: 'Thử đổi bộ lọc hoặc thêm chính sách mới.' }}
        columns={[
          { key: 'id', header: 'Mã', render: (p) => <span className="font-mono text-xs">{p.id}</span> },
          { key: 'name', header: 'Tên chính sách', render: (p) => <span className="font-medium text-slate-700">{p.name}</span> },
          { key: 'value', header: 'Giá trị', render: (p) => <span className="font-semibold text-brand-700">{p.value}</span> },
          { key: 'category', header: 'Nhóm', render: (p) => <Badge tone={catTone(p.category)}>{p.category}</Badge> },
          { key: 'updated', header: 'Cập nhật', render: (p) => formatDate(p.updated) },
          { key: 'actions', header: '', align: 'right', render: (p) => (
            <Button size="sm" variant="secondary" icon={Pencil} onClick={(e) => { e.stopPropagation(); openEdit(p) }}>Sửa</Button>
          ) },
        ]}
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Thêm chính sách' : 'Sửa chính sách'}
        subtitle={editing && editing !== 'new' ? editing.id : 'Tạo quy tắc vận hành mới'}
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
