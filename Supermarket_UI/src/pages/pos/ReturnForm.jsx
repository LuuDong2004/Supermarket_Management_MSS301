import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Textarea } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency, isoDate } from '../../lib/format.js'
import { returnService } from '../../services/index.js'
import { ArrowLeft, Search, X } from 'lucide-react'
import { REASONS, printReturn } from './Returns.jsx'

// Full-page create return / refund (replaces the old create modal).
export default function ReturnForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const [saleCode, setSaleCode] = useState('')
  const [sale, setSale] = useState(null)        // looked-up original sale
  const [picks, setPicks] = useState({})        // code -> qty to return
  const [reason, setReason] = useState(REASONS[0])
  const [note, setNote] = useState('')
  const [looking, setLooking] = useState(false)
  const [saving, setSaving] = useState(false)

  const lookup = async () => {
    const code = saleCode.trim()
    if (!code) return toast.error('Nhập mã hóa đơn gốc.')
    setLooking(true)
    try {
      const s = await returnService.lookup(code)
      if (!s) { toast.error('Không tìm thấy hóa đơn.'); setSale(null) }
      else {
        setSale(s)
        // default: return full quantity of each line
        const init = {}
        ;(s.lineItems || []).forEach((it) => { if (it.productCode) init[it.productCode] = it.quantity })
        setPicks(init)
      }
    } catch (e) {
      setSale(null)
      toast.error(e.message || 'Không tìm thấy hóa đơn.')
    } finally {
      setLooking(false)
    }
  }

  const setQty = (line, qty) => {
    const max = line.quantity
    const v = Math.max(0, Math.min(max, Number(qty) || 0))
    setPicks((p) => ({ ...p, [line.productCode]: v }))
  }

  const refundItems = useMemo(() => {
    if (!sale) return []
    return (sale.lineItems || [])
      .filter((it) => (picks[it.productCode] || 0) > 0)
      .map((it) => {
        const qty = picks[it.productCode]
        const unit = it.unitPrice || 0
        return { productCode: it.productCode, productName: it.productName, unitPrice: unit, quantity: qty, lineTotal: unit * qty }
      })
  }, [sale, picks])

  const refundTotal = useMemo(() => refundItems.reduce((s, x) => s + x.lineTotal, 0), [refundItems])

  const submit = async () => {
    if (!sale) return toast.error('Chưa chọn hóa đơn gốc.')
    if (refundItems.length === 0) return toast.error('Chọn ít nhất một mặt hàng để trả.')
    const body = {
      saleCode: sale.code,
      cashier: user?.fullName || user?.username || 'Thu ngân',
      customerCode: sale.customerCode || null,
      returnDate: isoDate(),
      reason,
      refundAmount: refundTotal,
      note: note || null,
      lineItems: refundItems,
    }
    setSaving(true)
    try {
      const created = await returnService.create(body)
      toast.success(`Đã tạo phiếu trả hàng ${created?.code || ''}.`)
      if (created) printReturn(created)
      navigate('/app/pos/returns')
    } catch (e) {
      toast.error(e.message || 'Không tạo được phiếu trả hàng.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.4"
        title="Tạo phiếu trả hàng"
        subtitle="Tra cứu hóa đơn gốc rồi chọn mặt hàng cần trả (trong 7 ngày)."
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/pos/returns')}>Quay lại danh sách</Button>}
      />

      <Card className="max-w-4xl">
        <CardBody>
          <div className="space-y-4">
            <Field label="Mã hóa đơn gốc" required>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-9 font-mono"
                    placeholder="VD: INV-1720000000000"
                    value={saleCode}
                    onChange={(e) => setSaleCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') lookup() }}
                  />
                </div>
                <Button variant="secondary" onClick={lookup} disabled={looking}>{looking ? 'Đang tìm...' : 'Tra cứu'}</Button>
              </div>
            </Field>

            {sale && (
              <>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm">
                  <div>
                    <p className="font-semibold text-slate-700">{sale.code}</p>
                    <p className="text-xs text-slate-500">{sale.customerName || 'Khách lẻ'} · {formatCurrency(sale.total)} · {sale.payment}</p>
                  </div>
                  <button onClick={() => { setSale(null); setPicks({}) }} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>

                {(sale.lineItems || []).length === 0 ? (
                  <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                    Hóa đơn này không có chi tiết mặt hàng để trả.
                  </p>
                ) : (
                  <div className="rounded-xl border border-slate-100 divide-y divide-slate-100">
                    {sale.lineItems.map((it) => (
                      <div key={it.productCode || it.id} className="flex items-center gap-3 px-4 py-2.5">
                        <div className="grow">
                          <p className="text-sm font-medium text-slate-700">{it.productName || it.productCode}</p>
                          <p className="text-xs text-slate-400">Đã mua: {it.quantity} · {formatCurrency(it.unitPrice)}</p>
                        </div>
                        <Field label="" className="w-24">
                          <Input
                            type="number" min="0" max={it.quantity}
                            value={picks[it.productCode] ?? 0}
                            onChange={(e) => setQty(it, e.target.value)}
                          />
                        </Field>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Lý do trả" required>
                    <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                      {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </Select>
                  </Field>
                  <Field label="Số tiền hoàn">
                    <Input value={formatCurrency(refundTotal)} disabled />
                  </Field>
                </div>
                <Field label="Ghi chú">
                  <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú thêm (nếu có)..." />
                </Field>
              </>
            )}

            <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/pos/returns')}>Hủy</Button>
              <Button onClick={submit} disabled={saving || !sale || refundItems.length === 0}>
                {saving ? 'Đang lưu...' : `Hoàn ${refundItems.length > 0 ? formatCurrency(refundTotal) : ''}`}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
