import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency, formatDate } from '../../lib/format.js'
import { goodsReceiptService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, CheckCircle2, XCircle, Printer } from 'lucide-react'
import { printReceipt } from './GoodsReceipts.jsx'

const MANAGER = ['ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN']

// Full-page goods receipt detail view (replaces the old detail modal).
export default function GoodsReceiptDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const isManager = MANAGER.includes(user?.role)
  const [receipt, setReceipt] = useState(null)
  const [source, setSource] = useState('backend')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await withFallback(() => goodsReceiptService.list())
    const r = toList(res.data).find((x) => String(x.id) === String(id) || x.code === id)
    if (!r) {
      toast.error('Không tìm thấy phiếu nhập kho.')
      navigate('/app/warehouse/goods-receipts')
      return
    }
    setReceipt(r)
    setSource(res.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [id])

  const decide = async (approve) => {
    if (source !== 'backend' || !receipt.id) { toast.error('Không có kết nối backend.'); return }
    try {
      if (approve) await goodsReceiptService.approve(receipt.id)
      else await goodsReceiptService.reject(receipt.id)
      toast.success(approve ? `Đã duyệt phiếu ${receipt.code}.` : `Đã từ chối phiếu ${receipt.code}.`)
      await load()
    } catch (e) { toast.error(e.message) }
  }

  if (loading || !receipt) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.6"
        title={`Phiếu ${receipt.code}`}
        subtitle={receipt.supplier}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/goods-receipts')}>Quay lại</Button>
            <Button variant="secondary" icon={Printer} onClick={() => printReceipt(receipt)}>In phiếu</Button>
            {isManager && receipt.status === 'Chờ duyệt' && (
              <>
                <Button variant="danger" icon={XCircle} onClick={() => decide(false)}>Từ chối</Button>
                <Button variant="success" icon={CheckCircle2} onClick={() => decide(true)}>Duyệt</Button>
              </>
            )}
          </div>
        }
      />

      <Card className="max-w-4xl">
        <CardBody>
          <div className="space-y-2 text-sm">
            {[['PO', receipt.poCode || '—'], ['Ngày nhận', formatDate(receipt.receiveDate)], ['Người nhận', receipt.receivedBy || '—'],
              ['Số mặt hàng', receipt.items], ['Tổng giá trị', formatCurrency(receipt.total)]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">{k}</span><span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Trạng thái</span><StatusBadge status={receipt.status} />
            </div>
            <div><p className="text-slate-500">Ghi chú</p><p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-slate-700">{receipt.note || 'Không có.'}</p></div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
