import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { formatCurrency, formatDate, isoDate } from '../../lib/format.js'
import { returnService, withFallback, toList } from '../../services/index.js'
import { Plus, Printer, Undo2, RotateCcw, Coins } from 'lucide-react'

export const REASONS = ['Khách đổi ý', 'Hàng lỗi / hư hỏng', 'Sai sản phẩm', 'Hết hạn sử dụng', 'Lý do khác']
const STORE = { name: 'Siêu thị MSS301', address: '123 Đường Trần Phú, Hà Nội' }

export function printReturn(r) {
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
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')

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

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.4"
        title="Trả hàng & Hoàn tiền"
        subtitle="Tra cứu hóa đơn gốc, chọn mặt hàng trả và tạo phiếu hoàn tiền (trong 7 ngày)."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={() => navigate('/app/pos/returns/new')}>Tạo phiếu trả</Button>
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
            ]}
            actions={(r) => (
              <Button size="sm" variant="secondary" icon={Printer} onClick={() => printReturn(r)}>In</Button>
            )}
          />
        </CardBody>
      </Card>
    </div>
  )
}
