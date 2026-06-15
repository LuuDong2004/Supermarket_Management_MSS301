import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Clock, CheckCircle2, XCircle, Check } from 'lucide-react'

const STEPS = ['Đã gửi', 'Đang duyệt', 'Hoàn tất']

function stepIndex(status) {
  if (status === 'Đã duyệt' || status === 'Từ chối') return 2
  if (status === 'Chờ duyệt') return 1
  return 0
}

const TYPE_TONE = { 'Điều chỉnh': 'amber', 'Nhập kho': 'green', 'Xuất kho': 'blue' }

export default function ApprovalStatus() {
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState(null)

  const requests = useMemo(() => {
    const adjustments = db.stockAdjustments.map((a) => ({
      key: a.id,
      type: 'Điều chỉnh',
      code: a.id,
      desc: `${a.product} (${a.diff > 0 ? '+' : ''}${a.diff}) · ${a.reason}`,
      date: a.date,
      status: a.status,
    }))
    const txns = db.warehouseTxns.map((t) => ({
      key: t.id,
      type: t.type,
      code: t.ref,
      desc: `${t.product} · ${t.qty > 0 ? '+' : ''}${t.qty}`,
      date: t.date,
      status: t.status,
    }))
    return [...adjustments, ...txns].sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [])

  const counts = useMemo(() => ({
    pending: requests.filter((r) => r.status === 'Chờ duyệt').length,
    approved: requests.filter((r) => r.status === 'Đã duyệt').length,
    rejected: requests.filter((r) => r.status === 'Từ chối').length,
    all: requests.length,
  }), [requests])

  const rows = useMemo(() => (tab === 'all' ? requests : requests.filter((r) => r.status === tab)), [requests, tab])

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.5"
        title="Trạng thái duyệt"
        subtitle="Theo dõi tiến trình phê duyệt các yêu cầu do nhân viên kho gửi lên."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Chờ duyệt" value={counts.pending} icon={Clock} tone="amber" hint="đang chờ xử lý" />
        <StatCard label="Đã duyệt" value={counts.approved} icon={CheckCircle2} tone="green" hint="đã thông qua" />
        <StatCard label="Từ chối" value={counts.rejected} icon={XCircle} tone="red" hint="bị từ chối" />
      </div>

      <div className="mt-6">
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
          rowKey="key"
          onRowClick={(r) => setSelected(r)}
          empty={{ title: 'Không có yêu cầu', subtitle: 'Chưa có yêu cầu nào ở trạng thái này.' }}
          columns={[
            { key: 'type', header: 'Loại', render: (r) => <Badge tone={TYPE_TONE[r.type] || 'slate'}>{r.type}</Badge> },
            { key: 'code', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
            { key: 'desc', header: 'Mô tả' },
            { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Tiến trình ${selected.code}` : ''}
        subtitle={selected?.desc}
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Đóng</Button>}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
              <span className="text-slate-500">Trạng thái hiện tại</span>
              <StatusBadge status={selected.status} />
            </div>

            <Progress current={stepIndex(selected.status)} rejected={selected.status === 'Từ chối'} />

            <Divider />
            <p className="text-xs text-slate-400">
              Tiến trình duyệt sẽ cập nhật theo thời gian thực khi tích hợp inventory-service và quy trình phê duyệt.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Progress({ current, rejected }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < current || (i === current && current === STEPS.length - 1)
        const active = i === current
        const isRejectedFinal = rejected && i === STEPS.length - 1
        const tone = isRejectedFinal
          ? 'bg-rose-100 text-rose-600 border-rose-300'
          : done
          ? 'bg-emerald-100 text-emerald-600 border-emerald-300'
          : active
          ? 'bg-brand-100 text-brand-600 border-brand-300'
          : 'bg-slate-100 text-slate-400 border-slate-200'
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${tone}`}>
                {done && !isRejectedFinal ? <Check size={16} /> : i + 1}
              </span>
              <span className="text-xs font-medium text-slate-600">{isRejectedFinal ? 'Từ chối' : label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 ${i < current ? 'bg-emerald-300' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
