import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, EmptyState } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate, formatCurrency } from '../../lib/format.js'
import { promotionService, withFallback, toList } from '../../services/index.js'
import { CheckCircle2, XCircle, Clock, Inbox, BadgePercent, Tag, Eye } from 'lucide-react'

const PENDING = 'Chờ duyệt'

function discountLabel(p) {
  return p.type === 'percent' ? `${p.discount}%` : formatCurrency(p.discount)
}

export default function PromotionApprovals() {
  const toast = useToast()
  const [tab, setTab] = useState('pending')
  const [promotions, setPromotions] = useState([])
  const [source, setSource] = useState('backend')
  const [selected, setSelected] = useState(null)

  const load = async () => {
    const res = await withFallback(() => promotionService.list())
    setPromotions(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const pending = useMemo(() => promotions.filter((p) => p.status === PENDING), [promotions])
  const processed = useMemo(() => promotions.filter((p) => p.status !== PENDING), [promotions])

  const decide = async (promo, approve) => {
    setSelected(null)
    if (source !== 'backend' || !promo.id) {
      toast.error('Không có kết nối backend để cập nhật chiến dịch.')
      return
    }
    try {
      if (approve) await promotionService.approve(promo.id)
      else await promotionService.reject(promo.id)
      toast.success(approve ? `Đã duyệt chiến dịch ${promo.code}.` : `Đã từ chối chiến dịch ${promo.code}.`)
      await load()
    } catch {
      toast.error('Không thể cập nhật chiến dịch khuyến mãi.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.4"
        title="Duyệt khuyến mãi"
        subtitle="Phê duyệt hoặc từ chối các chiến dịch khuyến mãi trước khi áp dụng vào bán hàng."
        actions={
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Chờ duyệt" value={pending.length} icon={Clock} tone="amber" hint="cần xử lý" />
        <StatCard label="Đã duyệt" value={processed.filter((p) => p.status === 'Đã duyệt').length} icon={CheckCircle2} tone="green" hint="tổng" />
        <StatCard label="Từ chối" value={processed.filter((p) => p.status === 'Từ chối').length} icon={XCircle} tone="red" hint="tổng" />
        <StatCard label="Tổng chiến dịch" value={promotions.length} icon={BadgePercent} tone="brand" hint="toàn hệ thống" />
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
              <EmptyState icon={Inbox} title="Không có chiến dịch chờ duyệt" subtitle="Tất cả chiến dịch đã được xử lý." />
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pending.map((promo) => (
              <Card key={promo.code}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone="brand">{promo.scope}</Badge>
                        <span className="font-mono text-xs text-slate-400">{promo.code}</span>
                      </div>
                      <p className="mt-2 font-semibold text-slate-800">{promo.name}</p>
                      <p className="text-sm text-slate-500">{formatDate(promo.fromDate)} → {formatDate(promo.toDate)}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
                      <Tag size={14} /> {discountLabel(promo)}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button variant="success" icon={CheckCircle2} onClick={() => decide(promo, true)}>Phê duyệt</Button>
                    <Button variant="danger" icon={XCircle} onClick={() => decide(promo, false)}>Từ chối</Button>
                    <Button variant="ghost" onClick={() => setSelected(promo)}>Chi tiết</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )
      ) : (
        <DataTable
          rows={processed}
          rowKey="code"
          onRowClick={(r) => setSelected(r)}
          empty={{ title: 'Chưa có chiến dịch nào được xử lý' }}
          columns={[
            { key: 'code', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
            { key: 'name', header: 'Chiến dịch', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
            { key: 'scope', header: 'Phạm vi', render: (r) => <Badge tone="brand">{r.scope}</Badge> },
            { key: 'discount', header: 'Giảm', align: 'right', render: (r) => discountLabel(r) },
            { key: 'period', header: 'Thời gian', render: (r) => `${formatDate(r.fromDate)} → ${formatDate(r.toDate)}` },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          actions={(r) => (
            <Button size="sm" variant="secondary" icon={Eye} onClick={() => setSelected(r)}>Xem</Button>
          )}
        />
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Chiến dịch ${selected.code}` : ''}
        subtitle={selected?.name}
        footer={
          selected?.status === PENDING ? (
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
            <Row label="Phạm vi áp dụng" value={selected.scope} />
            <Row label="Mức giảm" value={discountLabel(selected)} />
            <Row label="Bắt đầu" value={formatDate(selected.fromDate)} />
            <Row label="Kết thúc" value={formatDate(selected.toDate)} />
            <Row label="Trạng thái" value={<StatusBadge status={selected.status} />} />
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
