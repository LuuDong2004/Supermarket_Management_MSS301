import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency, formatDate, isoDate } from '../../lib/format.js'
import { returnService, withFallback, toList } from '../../services/index.js'
import { Plus, Search, Printer, Undo2, RotateCcw, Coins, X } from 'lucide-react'

const REASONS = ['Khách đổi ý', 'Hàng lỗi / hư hỏng', 'Sai sản phẩm', 'Hết hạn sử dụng', 'Lý do khác']
const STORE = { name: 'Siêu thị MSS301', address: '123 Đường Trần Phú, Hà Nội' }

function printReturn(r) {
  if (!r) return
  const rows = (r.lineItems || []).map((x) => `
    <tr><td>${x.productName || x.productCode || ''}</td><td style="text-align:center">${x.quantity}</td>
    <td style="text-align:right">${new Intl.NumberFormat('vi-VN').format(x.lineTotal || 0)} ₫</td></tr>`).join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${r.code}</title>
    <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#0f172a;padding:16px;max-width:360px;margin:0 auto}
    h1{font-size:17px;text-align:center;margin:0}.muted{color:#64748b;font-size:12px;text-align:center;margin:2px 0}
    table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}th{border-bottom:1px dashed #cbd5e1;padding:4px 2px;text-align:left;color:#64748b;font-size:11px}
    td{padding:4px 2px}.total{display:flex;justify-content:space-between;font-weight:800;font-size:15px;border-top:1px dashed #cbd5e1;margin-top:8px;padding-top:8px}
    .center{text-align:center;margin-top:14px;font-size:12px;color:#334155}</style></head><body>
    <h1>${STORE.name}</h1><div class="muted">${STORE.address}</div>
    <div class="muted" style="margin-top:8px;font-weight:700;color:#0f172a">PHIẾU TRẢ HÀNG / HOÀN TIỀN</div>
    <div class="muted">Số phiếu: ${r.code} · HĐ gốc: ${r.saleCode || '—'}</div>
    <div class="muted">${r.returnDate || ''} · Thu ngân: ${r.cashier || ''}</div>
    <div class="muted">Lý do: ${r.reason || '—'}</div>
    <table><thead><tr><th>Sản phẩm</th><th style="text-align:center">SL</th><th style="text-align:right">Hoàn</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="total"><span>Tổng hoàn</span><span>${new Intl.NumberFormat('vi-VN').format(r.refundAmount || 0)} ₫</span></div>
    <div class="center">Cảm ơn quý khách.</div></body></html>`
  const w = window.open('', '_blank', 'width=420,height=640')
  if (!w) return
  w.document.write(html); w.document.close(); w.focus(); w.print()
}

export default function Returns() {
  const toast = useToast()
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')
  const [open, setOpen] = useState(false)

  // create flow
  const [saleCode, setSaleCode] = useState('')
  const [sale, setSale] = useState(null)        // looked-up original sale
  const [picks, setPicks] = useState({})        // code -> qty to return
  const [reason, setReason] = useState(REASONS[0])
  const [note, setNote] = useState('')
  const [looking, setLooking] = useState(false)

  const load = async () => {
    const res = await withFallback(() => returnService.list())
    setRows(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const stats = useMemo(() => ({
    total: rows.length,
    today: rows.filter((r) => (r.returnDate || '').slice(0, 10) === isoDate()).length,
    refunded: rows.reduce((s, r) => s + (Number(r.refundAmount) || 0), 0),
  }), [rows])

  const resetCreate = () => { setSaleCode(''); setSale(null); setPicks({}); setReason(REASONS[0]); setNote('') }

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
    if (source !== 'backend') return toast.error('Không có kết nối backend.')
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
    try {
      const created = await returnService.create(body)
      toast.success(`Đã tạo phiếu trả hàng ${created?.code || ''}.`)
      setOpen(false)
      resetCreate()
      await load()
      if (created) printReturn(created)
    } catch (e) {
      toast.error(e.message || 'Không tạo được phiếu trả hàng.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.4"
        title="Trả hàng & Hoàn tiền"
        subtitle="Tra cứu hóa đơn gốc, chọn mặt hàng trả và tạo phiếu hoàn tiền (trong 7 ngày)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={() => { resetCreate(); setOpen(true) }}>Tạo phiếu trả</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Tổng phiếu trả" value={stats.total} icon={Undo2} tone="brand" />
        <StatCard label="Trả hôm nay" value={stats.today} icon={RotateCcw} tone="amber" />
        <StatCard label="Tổng hoàn tiền" value={formatCurrency(stats.refunded, { compact: true })} icon={Coins} tone="green" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <DataTable
            rows={rows}
            rowKey="code"
            empty={{ title: 'Chưa có phiếu trả hàng', subtitle: 'Tạo phiếu trả để hoàn tiền cho khách.' }}
            columns={[
              { key: 'code', header: 'Mã phiếu', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
              { key: 'saleCode', header: 'HĐ gốc', render: (r) => <span className="font-mono text-xs text-slate-500">{r.saleCode || '—'}</span> },
              { key: 'returnDate', header: 'Ngày', render: (r) => formatDate(r.returnDate) },
              { key: 'reason', header: 'Lý do', render: (r) => <span className="text-slate-600">{r.reason || '—'}</span> },
              { key: 'refundAmount', header: 'Hoàn tiền', align: 'right', render: (r) => <span className="font-bold text-rose-600">{formatCurrency(r.refundAmount)}</span> },
              { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'actions', header: '', align: 'right', render: (r) => (
                <Button size="sm" variant="ghost" icon={Printer} onClick={() => printReturn(r)}>In</Button>
              ) },
            ]}
          />
        </CardBody>
      </Card>

      {/* Create modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tạo phiếu trả hàng"
        subtitle="Tra cứu hóa đơn gốc rồi chọn mặt hàng cần trả"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={submit} disabled={!sale || refundItems.length === 0}>
              Hoàn {refundItems.length > 0 ? formatCurrency(refundTotal) : ''}
            </Button>
          </>
        }
      >
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
        </div>
      </Modal>
    </div>
  )
}
