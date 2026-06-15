import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, EmptyState } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { CheckCircle2, XCircle, Clock, Inbox, FileCheck2 } from 'lucide-react'

function typeTone(type) {
  if (type === 'Tạo tài khoản') return 'blue'
  if (type === 'Thay đổi quyền') return 'violet'
  if (type === 'Điều chỉnh kho') return 'amber'
  return 'brand'
}

export default function Approvals() {
  const toast = useToast()
  const [tab, setTab] = useState('pending')
  const [pending, setPending] = useState(db.approvalRequests.filter((r) => r.status === 'Chờ duyệt'))
  const [processed, setProcessed] = useState(db.approvalRequests.filter((r) => r.status !== 'Chờ duyệt'))
  const [selected, setSelected] = useState(null)

  const decide = (req, approve) => {
    setPending((p) => p.filter((r) => r.id !== req.id))
    setProcessed((p) => [{ ...req, status: approve ? 'Đã duyệt' : 'Từ chối' }, ...p])
    setSelected(null)
    toast.success(approve ? `Đã phê duyệt ${req.id}.` : `Đã từ chối ${req.id}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.2"
        title="Phê duyệt"
        subtitle="Hàng đợi phê duyệt của CEO — duyệt hoặc từ chối các yêu cầu."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Chờ duyệt" value={pending.length} icon={Clock} tone="amber" hint="cần xử lý" />
        <StatCard label="Đã xử lý" value={processed.length} icon={FileCheck2} tone="green" hint="lịch sử" />
        <StatCard label="Đã duyệt" value={processed.filter((r) => r.status === 'Đã duyệt').length} icon={CheckCircle2} tone="brand" hint="tổng" />
        <StatCard label="Từ chối" value={processed.filter((r) => r.status === 'Từ chối').length} icon={XCircle} tone="red" hint="tổng" />
      </div>

      <Tabs
        className="my-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'pending', label: 'Chờ duyệt', count: pending.length },
          { value: 'processed', label: 'Đã xử lý', count: processed.length },
        ]}
      />

      {tab === 'pending' ? (
        pending.length === 0 ? (
          <Card>
            <CardBody>
              <EmptyState icon={Inbox} title="Không còn yêu cầu chờ duyệt" subtitle="Tất cả yêu cầu đã được xử lý." />
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pending.map((req) => (
              <Card key={req.id}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone={typeTone(req.type)}>{req.type}</Badge>
                        <span className="font-mono text-xs text-slate-400">{req.id}</span>
                      </div>
                      <p className="mt-2 font-semibold text-slate-800">{req.target}</p>
                      <p className="text-sm text-slate-500">{req.requester} · {formatDate(req.date)}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  {req.note && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{req.note}</p>}
                  <div className="flex gap-2 pt-1">
                    <Button variant="success" icon={CheckCircle2} onClick={() => decide(req, true)}>Phê duyệt</Button>
                    <Button variant="danger" icon={XCircle} onClick={() => decide(req, false)}>Từ chối</Button>
                    <Button variant="ghost" onClick={() => setSelected(req)}>Chi tiết</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )
      ) : (
        <DataTable
          rows={processed}
          onRowClick={(r) => setSelected(r)}
          empty={{ title: 'Chưa có yêu cầu nào được xử lý' }}
          columns={[
            { key: 'id', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: 'type', header: 'Loại', render: (r) => <Badge tone={typeTone(r.type)}>{r.type}</Badge> },
            { key: 'requester', header: 'Người yêu cầu' },
            { key: 'target', header: 'Đối tượng' },
            { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
            { key: 'status', header: 'Kết quả', render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Yêu cầu ${selected.id}` : ''}
        subtitle={selected?.type}
        footer={
          selected?.status === 'Chờ duyệt' ? (
            <>
              <Button variant="danger" icon={XCircle} onClick={() => decide(selected, false)}>Từ chối</Button>
              <Button variant="success" icon={CheckCircle2} onClick={() => decide(selected, true)}>Phê duyệt</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setSelected(null)}>Đóng</Button>
          )
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <Row label="Người yêu cầu" value={selected.requester} />
            <Row label="Đối tượng" value={selected.target} />
            <Row label="Ngày tạo" value={formatDate(selected.date)} />
            <Row label="Trạng thái" value={<StatusBadge status={selected.status} />} />
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

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
