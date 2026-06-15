import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, EmptyState } from '../../components/ui/primitives.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatDate, formatNumber } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { PackageCheck, ClipboardCheck, Inbox } from 'lucide-react'

const receivablePOs = db.purchaseOrders.filter((o) => o.status === 'Approved' || o.status === 'Received')

function buildSheet() {
  return db.products.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    barcode: p.barcode,
    unit: p.unit,
    ordered: Math.max(10, Math.round(p.stock / 4)),
    received: Math.max(10, Math.round(p.stock / 4)),
    condition: 'Tốt',
  }))
}

export default function Receive() {
  const toast = useToast()
  const [poId, setPoId] = useState(receivablePOs[0]?.id || '')
  const [sheet, setSheet] = useState(buildSheet())
  const [confirm, setConfirm] = useState(false)

  const selectedPO = useMemo(() => receivablePOs.find((o) => o.id === poId), [poId])

  const setRow = (id, key, val) => setSheet((s) => s.map((r) => (r.id === id ? { ...r, [key]: val } : r)))
  const totalReceived = sheet.reduce((s, r) => s + Number(r.received || 0), 0)

  const confirmReceive = () => {
    setConfirm(false)
    setSheet(buildSheet())
    toast.success(`Đã nhận hàng cho đơn ${poId}. Tồn kho sẽ được cập nhật.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.1"
        title="Nhận hàng"
        subtitle="Đối chiếu số lượng thực nhận với đơn mua đã duyệt và ghi nhận tình trạng hàng."
        actions={<Button icon={PackageCheck} disabled={!selectedPO} onClick={() => setConfirm(true)}>Xác nhận nhận hàng</Button>}
      />

      <Card className="mb-6">
        <CardHeader title="Đơn mua cần nhận" subtitle="Chọn đơn đã được phê duyệt" icon={ClipboardCheck} />
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Đơn mua">
              <Select value={poId} onChange={(e) => setPoId(e.target.value)}>
                {receivablePOs.map((o) => (
                  <option key={o.id} value={o.id}>{o.id} — {o.supplier}</option>
                ))}
              </Select>
            </Field>
            {selectedPO && (
              <>
                <Info label="Nhà cung cấp" value={selectedPO.supplier} />
                <Info label="Ngày đặt" value={formatDate(selectedPO.date)} />
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
            <table className="w-full text-sm">
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
                      <p className="font-mono text-xs text-slate-400">{r.barcode}</p>
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
          </CardBody>
        </Card>
      ) : (
        <Card><CardBody><EmptyState icon={Inbox} title="Không có đơn để nhận" subtitle="Chưa có đơn mua nào ở trạng thái đã duyệt." /></CardBody></Card>
      )}

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Xác nhận nhận hàng"
        subtitle={selectedPO ? `${selectedPO.id} · ${selectedPO.supplier}` : ''}
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
          <p className="pt-2 text-xs text-slate-400">Tồn kho sẽ được cộng tương ứng khi tích hợp inventory-service.</p>
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
