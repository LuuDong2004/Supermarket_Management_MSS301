import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Input, Select, Textarea, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Plus } from 'lucide-react'

const REASON_TONE = { 'Hư hỏng': 'amber', 'Vỡ': 'red', 'Thất thoát': 'violet', 'Hết hạn': 'slate' }

export default function Adjustments() {
  const toast = useToast()
  const [list, setList] = useState(db.stockAdjustments)
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    product: db.products[0].name,
    system: db.products[0].stock,
    counted: db.products[0].stock,
    reason: 'Hư hỏng',
    note: '',
  })

  const counts = useMemo(() => ({
    pending: list.filter((a) => a.status === 'Chờ duyệt').length,
    approved: list.filter((a) => a.status === 'Đã duyệt').length,
    rejected: list.filter((a) => a.status === 'Từ chối').length,
    all: list.length,
  }), [list])

  const rows = useMemo(() => (tab === 'all' ? list : list.filter((a) => a.status === tab)), [list, tab])

  const submit = () => {
    const diff = Number(form.counted) - Number(form.system)
    const id = `ADJ-${222 + list.length}`
    setList((l) => [
      { id, product: form.product, system: Number(form.system), counted: Number(form.counted), diff, reason: form.reason, date: '2026-06-15', status: 'Chờ duyệt' },
      ...l,
    ])
    setOpen(false)
    toast.success(`Đã tạo yêu cầu điều chỉnh ${id}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.4"
        title="Điều chỉnh tồn kho"
        subtitle="Tạo và theo dõi các yêu cầu điều chỉnh số lượng tồn kho."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Tạo yêu cầu điều chỉnh</Button>}
      />

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'all', label: 'Tất cả', count: counts.all },
          { value: 'Chờ duyệt', label: 'Chờ duyệt', count: counts.pending },
          { value: 'Đã duyệt', label: 'Đã duyệt', count: counts.approved },
          { value: 'Từ chối', label: 'Từ chối', count: counts.rejected },
        ]}
      />

      <DataTable
        rows={rows}
        empty={{ title: 'Không có yêu cầu', subtitle: 'Chưa có yêu cầu điều chỉnh nào ở trạng thái này.' }}
        columns={[
          { key: 'id', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: 'product', header: 'Sản phẩm' },
          { key: 'system', header: 'Hệ thống', align: 'center' },
          { key: 'counted', header: 'Thực đếm', align: 'center' },
          { key: 'diff', header: 'Chênh lệch', align: 'center', render: (r) => (
            <Badge tone={r.diff > 0 ? 'green' : r.diff < 0 ? 'red' : 'slate'}>{r.diff > 0 ? `+${r.diff}` : r.diff}</Badge>
          ) },
          { key: 'reason', header: 'Lý do', render: (r) => <Badge tone={REASON_TONE[r.reason] || 'slate'}>{r.reason}</Badge> },
          { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
          { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tạo yêu cầu điều chỉnh"
        subtitle="Ghi nhận chênh lệch tồn kho cần điều chỉnh."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={submit}>Gửi yêu cầu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Sản phẩm" required>
            <Select value={form.product} onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}>
              {db.products.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tồn hệ thống" required>
              <Input type="number" value={form.system} onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))} />
            </Field>
            <Field label="Thực đếm" required>
              <Input type="number" value={form.counted} onChange={(e) => setForm((f) => ({ ...f, counted: e.target.value }))} />
            </Field>
          </div>
          <Field label="Lý do" required>
            <Select value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}>
              <option value="Hư hỏng">Hư hỏng</option>
              <option value="Vỡ">Vỡ</option>
              <option value="Thất thoát">Thất thoát</option>
              <option value="Hết hạn">Hết hạn</option>
            </Select>
          </Field>
          <Field label="Ghi chú" hint="Mô tả thêm về nguyên nhân điều chỉnh.">
            <Textarea rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Nhập ghi chú..." />
          </Field>
          <Divider />
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Chênh lệch dự kiến</span>
            <Badge tone={Number(form.counted) - Number(form.system) >= 0 ? 'green' : 'red'}>
              {Number(form.counted) - Number(form.system) > 0 ? '+' : ''}{Number(form.counted) - Number(form.system)}
            </Badge>
          </div>
        </div>
      </Modal>
    </div>
  )
}
