import { useMemo, useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, EmptyState, Spinner } from '../../components/ui/primitives.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatDate, formatNumber } from '../../lib/format.js'
import {
  purchaseOrderService, productService, warehouseTxnService,
  withFallback, toList, mockPurchaseOrders, mockProducts,
} from '../../services/index.js'
import { PackageCheck, ClipboardCheck, Inbox } from 'lucide-react'

function buildSheet(products) {
  return products.slice(0, 4).map((p) => ({
    id: p.id || p.code,
    name: p.name,
    code: p.code || p.id,
    unit: p.unit,
    ordered: Math.max(10, Math.round((p.stock || 0) / 4)),
    received: Math.max(10, Math.round((p.stock || 0) / 4)),
    condition: 'Tốt',
  }))
}

export default function Receive() {
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [poCode, setPoCode] = useState('')
  const [sheet, setSheet] = useState([])
  const [confirm, setConfirm] = useState(false)

  const load = async () => {
    setLoading(true)
    const [po, prod] = await Promise.all([
      withFallback(() => purchaseOrderService.list(), mockPurchaseOrders),
      withFallback(() => productService.list(), mockProducts),
    ])
    const poList = toList(po.data)
    const prodList = toList(prod.data)
    setOrders(poList)
    setProducts(prodList)
    setSource(po.source)
    const receivable = poList.filter((o) => o.status === 'Approved' || o.status === 'Received')
    setPoCode(receivable[0]?.code || '')
    setSheet(buildSheet(prodList))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const receivablePOs = useMemo(
    () => orders.filter((o) => o.status === 'Approved' || o.status === 'Received'),
    [orders],
  )
  const selectedPO = useMemo(() => receivablePOs.find((o) => o.code === poCode), [receivablePOs, poCode])

  const setRow = (id, key, val) => setSheet((s) => s.map((r) => (r.id === id ? { ...r, [key]: val } : r)))
  const totalReceived = sheet.reduce((s, r) => s + Number(r.received || 0), 0)

  const confirmReceive = async () => {
    try {
      // Ghi nhận một giao dịch nhập kho cho mỗi mặt hàng nhận được.
      await Promise.all(
        sheet
          .filter((r) => Number(r.received) > 0)
          .map((r, i) =>
            warehouseTxnService.create({
              code: `WT-${poCode}-${i + 1}`,
              type: 'Nhập kho',
              ref: poCode,
              product: r.name,
              qty: Number(r.received),
              txnDate: '2026-06-15',
              status: 'Chờ duyệt',
            }),
          ),
      )
      toast.success(`Đã nhận hàng cho đơn ${poCode}. Tồn kho sẽ được cập nhật.`)
      setConfirm(false)
      setSheet(buildSheet(products))
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.1"
        title="Nhận hàng"
        subtitle="Đối chiếu số lượng thực nhận với đơn mua đã duyệt và ghi nhận tình trạng hàng."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={PackageCheck} disabled={!selectedPO} onClick={() => setConfirm(true)}>Xác nhận nhận hàng</Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader title="Đơn mua cần nhận" subtitle="Chọn đơn đã được phê duyệt" icon={ClipboardCheck} />
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Đơn mua">
                  <Select value={poCode} onChange={(e) => setPoCode(e.target.value)}>
                    {receivablePOs.map((o) => (
                      <option key={o.code} value={o.code}>{o.code} — {o.supplier}</option>
                    ))}
                  </Select>
                </Field>
                {selectedPO && (
                  <>
                    <Info label="Nhà cung cấp" value={selectedPO.supplier} />
                    <Info label="Ngày đặt" value={formatDate(selectedPO.orderDate)} />
                    <Info label="Giá trị" value={formatCurrency(selectedPO.total)} />
                  </>
                )}
              </div>
            </CardBody>
          </Card>

          {selectedPO ? (
            <Card>
              <CardHeader title="Phiếu nhận hàng" subtitle={`${sheet.length} mặt hàng · ${formatNumber(totalReceived)} đơn vị`} icon={PackageCheck} />
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Sản phẩm</th>
                      <th className="px-4 py-3 text-center">Đặt</th>
                      <th className="px-4 py-3 text-center">Số lượng nhận</th>
                      <th className="px-4 py-3">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheet.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-700">{r.name}</p>
                          <p className="font-mono text-xs text-slate-400">{r.code}</p>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600">{r.ordered} {r.unit}</td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min={0}
                            className="mx-auto w-24 text-center"
                            value={r.received}
                            onChange={(e) => setRow(r.id, 'received', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select value={r.condition} onChange={(e) => setRow(r.id, 'condition', e.target.value)} className="w-36">
                            <option value="Tốt">Tốt</option>
                            <option value="Hư hỏng">Hư hỏng</option>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card><CardBody><EmptyState icon={Inbox} title="Không có đơn để nhận" subtitle="Chưa có đơn mua nào ở trạng thái đã duyệt." /></CardBody></Card>
          )}
        </>
      )}

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Xác nhận nhận hàng"
        subtitle={selectedPO ? `${selectedPO.code} · ${selectedPO.supplier}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>Hủy</Button>
            <Button variant="success" onClick={confirmReceive}>Xác nhận</Button>
          </>
        }
      >
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Số mặt hàng</span>
            <span className="font-medium text-slate-700">{sheet.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tổng số lượng nhận</span>
            <span className="font-semibold text-slate-800">{formatNumber(totalReceived)} đơn vị</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Hàng hư hỏng</span>
            <Badge tone="amber">{sheet.filter((r) => r.condition === 'Hư hỏng').length} mặt hàng</Badge>
          </div>
          <p className="pt-2 text-xs text-slate-400">Mỗi mặt hàng sẽ tạo một giao dịch nhập kho chờ duyệt.</p>
        </div>
      </Modal>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">{label}</p>
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{value}</p>
    </div>
  )
}
