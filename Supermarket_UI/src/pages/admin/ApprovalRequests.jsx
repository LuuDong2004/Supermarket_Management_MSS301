import { useState, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Input, Select, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Plus } from 'lucide-react'

const TYPES = ['Tạo tài khoản', 'Thay đổi quyền', 'Điều chỉnh kho', 'Chính sách giá']

function typeTone(type) {
  if (type === 'Tạo tài khoản') return 'blue'
  if (type === 'Thay đổi quyền') return 'violet'
  if (type === 'Điều chỉnh kho') return 'amber'
  return 'brand'
}

export default function ApprovalRequests() {
  const toast = useToast()
  const [tab, setTab] = useState('all')
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ type: 'Tạo tài khoản', target: '', note: '' })

  const all = db.approvalRequests
  const pending = all.filter((r) => r.status === 'Chờ duyệt')
  const approved = all.filter((r) => r.status === 'Đã duyệt')

  const counts = { all: all.length, pending: pending.length, approved: approved.length }
  const rows = useMemo(() => {
    if (tab === 'pending') return pending
    if (tab === 'approved') return approved
    return all
  }, [tab, all, pending, approved])

  const submit = () => {
    setCreating(false)
    setForm({ type: 'Tạo tài khoản', target: '', note: '' })
    toast.success('Đã gửi yêu cầu phê duyệt mới.')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.2"
        title="Yêu cầu phê duyệt"
        subtitle="Theo dõi các yêu cầu cần CEO phê duyệt."
        actions={<Button icon={Plus} onClick={() => setCreating(true)}>Gửi yêu cầu mới</Button>}
      />

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'all', label: 'Tất cả', count: counts.all },
          { value: 'pending', label: 'Chờ duyệt', count: counts.pending },
          { value: 'approved', label: 'Đã duyệt', count: counts.approved },
        ]}
      />

      <DataTable
        rows={rows}
        onRowClick={(r) => setSelected(r)}
        empty={{ title: 'Không có yêu cầu', subtitle: 'Chưa có yêu cầu nào ở trạng thái này.' }}
        columns={[
          { key: 'id', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
          { key: 'type', header: 'Loại', render: (r) => <Badge tone={typeTone(r.type)}>{r.type}</Badge> },
          { key: 'requester', header: 'Người yêu cầu' },
          { key: 'target', header: 'Đối tượng', render: (r) => <span className="text-slate-600">{r.target}</span> },
          { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
          { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'note', header: 'Ghi chú', render: (r) => <span className="text-xs text-slate-500">{r.note || '—'}</span> },
        ]}
      />

      {/* New request modal */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Gửi yêu cầu phê duyệt"
        subtitle="Yêu cầu sẽ được gửi tới CEO"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreating(false)}>Hủy</Button>
            <Button onClick={submit}>Gửi yêu cầu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Loại yêu cầu">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Đối tượng" required hint="VD: User: cashier_le, ADJ-221...">
            <Input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="Đối tượng áp dụng" />
          </Field>
          <Field label="Ghi chú">
            <Textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Lý do / mô tả yêu cầu..." />
          </Field>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Yêu cầu ${selected.id}` : ''}
        subtitle={selected?.type}
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Đóng</Button>}
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <DetailRow label="Loại" value={<Badge tone={typeTone(selected.type)}>{selected.type}</Badge>} />
            <DetailRow label="Người yêu cầu" value={selected.requester} />
            <DetailRow label="Đối tượng" value={selected.target} />
            <DetailRow label="Ngày tạo" value={formatDate(selected.date)} />
            <DetailRow label="Trạng thái" value={<StatusBadge status={selected.status} />} />
            <div>
              <p className="text-slate-500">Ghi chú</p>
              <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-slate-700">{selected.note || 'Không có ghi chú.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
