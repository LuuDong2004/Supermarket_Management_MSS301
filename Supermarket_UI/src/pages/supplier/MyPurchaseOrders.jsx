import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatCurrency, formatDate } from '../../lib/format.js'
import { purchaseOrderService, withFallback, toList } from '../../services/index.js'
import { ClipboardList, Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react'

const SUP_TONE = {
  'Chờ xác nhận': 'amber',
  'Đã xác nhận': 'blue',
  'Đang giao': 'violet',
  'Đã giao': 'green',
  'NCC từ chối': 'red',
}

export default function MyPurchaseOrders() {
  const toast = useToast()
  const confirm = useConfirm()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [ship, setShip] = useState(null) // { po, expectedDelivery, note }

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => purchaseOrderService.mine())
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.supplierStatus === 'Chờ xác nhận').length,
    shipping: rows.filter((r) => r.supplierStatus === 'Đang giao').length,
    delivered: rows.filter((r) => r.supplierStatus === 'Đã giao').length,
  }), [rows])

  const act = async (fn, okMsg) => {
    try { await fn(); toast.success(okMsg); await load() }
    catch (e) { toast.error(e.message || 'Thao tác thất bại.') }
  }

  const confirmPo = async (r) => {
    if (!(await confirm({
      title: 'Xác nhận đơn mua?',
      message: `Xác nhận nhận đơn ${r.code} (${formatCurrency(r.total)}) từ siêu thị.`,
      confirmLabel: 'Xác nhận',
    }))) return
    await act(() => purchaseOrderService.confirm(r.id), `Đã xác nhận đơn ${r.code}.`)
  }

  const rejectPo = async (r) => {
    if (!(await confirm({
      title: 'Từ chối đơn mua?',
      message: `Đơn ${r.code} sẽ bị từ chối và không thể xác nhận lại.`,
      confirmLabel: 'Từ chối',
      danger: true,
    }))) return
    await act(() => purchaseOrderService.rejectBySupplier(r.id), `Đã từ chối đơn ${r.code}.`)
  }

  const deliverPo = async (r) => {
    if (!(await confirm({
      title: 'Xác nhận đã giao hàng?',
      message: `Đánh dấu đơn ${r.code} là đã giao. Thao tác này không thể hoàn tác.`,
      confirmLabel: 'Đã giao',
    }))) return
    await act(() => purchaseOrderService.deliver(r.id), `Đơn ${r.code} đã giao.`)
  }

  const confirmShip = async () => {
    if (!ship) return
    await act(() => purchaseOrderService.ship(ship.po.id, {
      expectedDelivery: ship.expectedDelivery || null,
      note: ship.note || null,
    }), `Đã bắt đầu giao đơn ${ship.po.code}.`)
    setShip(null)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhà cung cấp · 3.12.1"
        title="Đơn mua của tôi"
        subtitle="Xác nhận, cập nhật giao hàng cho các đơn mua từ siêu thị."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng đơn" value={stats.total} icon={ClipboardList} tone="brand" />
        <StatCard label="Chờ xác nhận" value={stats.pending} icon={Clock} tone="amber" />
        <StatCard label="Đang giao" value={stats.shipping} icon={Truck} tone="violet" />
        <StatCard label="Đã giao" value={stats.delivered} icon={PackageCheck} tone="green" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Spinner className="h-7 w-7" /></div>
          ) : (
            <DataTable
              rows={rows}
              rowKey="code"
              empty={{ title: 'Chưa có đơn mua nào', subtitle: 'Các đơn mua từ siêu thị sẽ hiển thị ở đây.' }}
              columns={[
                { key: 'code', header: 'Mã đơn', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
                { key: 'orderDate', header: 'Ngày đặt', render: (r) => formatDate(r.orderDate) },
                { key: 'items', header: 'Mặt hàng', align: 'center' },
                { key: 'total', header: 'Giá trị', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.total)}</span> },
                { key: 'approval', header: 'Duyệt (bên mua)', render: (r) => <StatusBadge status={r.approval || r.status} /> },
                { key: 'supplierStatus', header: 'Trạng thái NCC', render: (r) => <Badge tone={SUP_TONE[r.supplierStatus] || 'slate'}>{r.supplierStatus || '—'}</Badge> },
                { key: 'expectedDelivery', header: 'Giao dự kiến', render: (r) => r.expectedDelivery ? formatDate(r.expectedDelivery) : '—' },
              ]}
              actions={(r) => (
                <>
                  {r.supplierStatus === 'Chờ xác nhận' && (
                    <>
                      <Button size="sm" variant="success" icon={CheckCircle2} onClick={() => confirmPo(r)}>Xác nhận</Button>
                      <Button size="sm" variant="danger" icon={XCircle} onClick={() => rejectPo(r)}>Từ chối</Button>
                    </>
                  )}
                  {r.supplierStatus === 'Đã xác nhận' && (
                    <Button size="sm" variant="secondary" icon={Truck} onClick={() => setShip({ po: r, expectedDelivery: '', note: '' })}>Giao hàng</Button>
                  )}
                  {r.supplierStatus === 'Đang giao' && (
                    <Button size="sm" variant="success" icon={PackageCheck} onClick={() => deliverPo(r)}>Đã giao</Button>
                  )}
                  {(r.supplierStatus === 'Đã giao' || r.supplierStatus === 'NCC từ chối') && (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </>
              )}
            />
          )}
        </CardBody>
      </Card>

      <Modal
        open={!!ship}
        onClose={() => setShip(null)}
        title="Cập nhật giao hàng"
        subtitle={ship ? `Đơn ${ship.po.code}` : ''}
        footer={<><Button variant="secondary" onClick={() => setShip(null)}>Hủy</Button><Button icon={Truck} onClick={confirmShip}>Bắt đầu giao</Button></>}
      >
        {ship && (
          <div className="space-y-4">
            <Field label="Ngày giao dự kiến">
              <Input type="date" value={ship.expectedDelivery} onChange={(e) => setShip({ ...ship, expectedDelivery: e.target.value })} />
            </Field>
            <Field label="Ghi chú giao hàng">
              <Textarea rows={2} value={ship.note} onChange={(e) => setShip({ ...ship, note: e.target.value })} placeholder="VD: Giao bằng xe tải, liên hệ trước 30 phút..." />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
