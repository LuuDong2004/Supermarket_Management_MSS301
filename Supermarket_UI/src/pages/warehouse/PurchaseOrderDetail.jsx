import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, StatusBadge, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatDate, formatNumber } from '../../lib/format.js'
import { purchaseOrderService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Building2 } from 'lucide-react'

// Full-page purchase order detail view (replaces the old detail modal).
export default function PurchaseOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const r = await withFallback(() => purchaseOrderService.list())
      const o = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!o) {
        toast.error('Không tìm thấy đơn mua.')
        navigate('/app/warehouse/purchase-orders')
        return
      }
      setOrder(o)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.1"
        title={`Chi tiết ${order.code}`}
        subtitle={order.supplier}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/purchase-orders')}>Quay lại danh sách</Button>}
      />

      <Card className="max-w-4xl">
        <CardBody>
          <div className="space-y-3 text-sm">
            <Row label="Nhà cung cấp" value={<span className="inline-flex items-center gap-1.5"><Building2 size={14} className="text-slate-400" />{order.supplier}</span>} />
            <Row label="Ngày đặt" value={formatDate(order.orderDate)} />
            <Row label="Số mặt hàng" value={formatNumber(order.items)} />
            <Row label="Tổng giá trị" value={<span className="font-semibold text-slate-800">{formatCurrency(order.total)}</span>} />
            <Row label="Trạng thái" value={<StatusBadge status={order.status} />} />
            <Row label="Duyệt" value={<StatusBadge status={order.approval} />} />
            <Divider />
            <p className="text-xs text-slate-400">Chi tiết dòng hàng sẽ hiển thị khi tích hợp inventory-service.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  )
}
