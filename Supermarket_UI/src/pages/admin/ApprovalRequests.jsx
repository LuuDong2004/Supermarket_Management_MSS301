import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Input, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import { approvalRequestService, withFallback, toList, mockApprovalRequests } from '../../services/index.js'
import { Plus, Check, X, Eye } from 'lucide-react'

const TYPES = ['Tạo tài khoản', 'Thay đổi quyền', 'Điều chỉnh kho', 'Chính sách giá']

function typeTone(type) {
  if (type === 'Tạo tài khoản') return 'blue'
  if (type === 'Thay đổi quyền') return 'violet'
  if (type === 'Điều chỉnh kho') return 'amber'
  return 'brand'
}

const todayIso = () => new Date().toISOString().slice(0, 10)

export default function ApprovalRequests() {
  const toast = useToast()
  const navigate = useNavigate()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [tab, setTab] = useState('all')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ type: 'Tạo tài khoản', target: '', note: '' })

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => approvalRequestService.list(), mockApprovalRequests)
    setAll(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const pending = all.filter((r) => r.status === 'Chờ duyệt')
  const approved = all.filter((r) => r.status === 'Đã duyệt')

  const counts = { all: all.length, pending: pending.length, approved: approved.length }
  const rows = useMemo(() => {
    if (tab === 'pending') return pending
    if (tab === 'approved') return approved
    return all
  }, [tab, all, pending, approved])

  const submit = async () => {
    const payload = {
      code: `AR-${Date.now()}`,
      type: form.type,
      requester: 'Admin',
      target: form.target,
      reqDate: todayIso(),
      status: 'Chờ duyệt',
      note: form.note,
    }
    try {
      await approvalRequestService.create(payload)
      toast.success('Đã gửi yêu cầu phê duyệt mới.')
      setCreating(false)
      setForm({ type: 'Tạo tài khoản', target: '', note: '' })
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const decide = async (row, status) => {
    const payload = {
      code: row.code || row.id,
      type: row.type,
      requester: row.requester,
      target: row.target,
      reqDate: row.reqDate || row.date || todayIso(),
      status,
      note: row.note || '',
    }
    try {
      await approvalRequestService.update(row.id, payload)
      toast.success(status === 'Đã duyệt' ? 'Đã duyệt yêu cầu.' : 'Đã từ chối yêu cầu.')
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.2"
        title="Yêu cầu phê duyệt"
        subtitle="Theo dõi các yêu cầu cần CEO phê duyệt."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={() => setCreating(true)}>Gửi yêu cầu mới</Button>
          </div>
        }
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

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <DataTable
          rows={rows}
          onRowClick={(r) => navigate(`/app/admin/approval-requests/${r.id}`)}
          empty={{ title: 'Không có yêu cầu', subtitle: 'Chưa có yêu cầu nào ở trạng thái này.' }}
          columns={[
            { key: 'code', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.code || r.id}</span> },
            { key: 'type', header: 'Loại', render: (r) => <Badge tone={typeTone(r.type)}>{r.type}</Badge> },
            { key: 'requester', header: 'Người yêu cầu' },
            { key: 'target', header: 'Đối tượng', render: (r) => <span className="text-slate-600">{r.target}</span> },
            { key: 'reqDate', header: 'Ngày', render: (r) => formatDate(r.reqDate || r.date) },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            { key: 'note', header: 'Ghi chú', render: (r) => <span className="text-xs text-slate-500">{r.note || '—'}</span> },
          ]}
          actions={(r) => (
            <>
              <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/app/admin/approval-requests/${r.id}`)}>Xem</Button>
              {r.status === 'Chờ duyệt' && (
                <>
                  <Button size="sm" variant="success" icon={Check} onClick={() => decide(r, 'Đã duyệt')}>Duyệt</Button>
                  <Button size="sm" variant="danger" icon={X} onClick={() => decide(r, 'Từ chối')}>Từ chối</Button>
                </>
              )}
            </>
          )}
        />
      )}

      {/* New request modal (small form — stays a modal) */}
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
    </div>
  )
}
