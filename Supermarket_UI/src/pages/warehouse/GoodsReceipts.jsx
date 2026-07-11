import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency, formatDate } from '../../lib/format.js'
import { escapeHtml } from '../../lib/escapeHtml.js'
import { goodsReceiptService, withFallback, toList } from '../../services/index.js'
import { Plus, CheckCircle2, XCircle, Printer, FileInput, Clock, PackageCheck, Eye } from 'lucide-react'

const MANAGER = ['ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN']

export function printReceipt(r) {
  const rows = `
    <tr><td>Nhà cung cấp</td><td>${escapeHtml(r.supplier || '')}</td></tr>
    <tr><td>Đơn mua (PO)</td><td>${escapeHtml(r.poCode || '—')}</td></tr>
    <tr><td>Ngày nhận</td><td>${escapeHtml(r.receiveDate || '')}</td></tr>
    <tr><td>Người nhận</td><td>${escapeHtml(r.receivedBy || '—')}</td></tr>
    <tr><td>Số mặt hàng</td><td>${escapeHtml(r.items ?? '')}</td></tr>
    <tr><td>Tổng giá trị</td><td>${new Intl.NumberFormat('vi-VN').format(r.total || 0)} đ</td></tr>
    <tr><td>Trạng thái</td><td>${escapeHtml(r.status || '')}</td></tr>
    <tr><td>Ghi chú</td><td>${escapeHtml(r.note || '—')}</td></tr>`
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(r.code)}</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#0f172a}h1{font-size:20px;margin:0 0 4px}
    .sub{color:#64748b;font-size:13px;margin-bottom:20px}table{width:100%;border-collapse:collapse}
    td{border:1px solid #e2e8f0;padding:8px 10px;font-size:14px}td:first-child{width:180px;color:#64748b;font-weight:600}
    .sign{margin-top:48px;display:flex;justify-content:space-between;text-align:center;font-size:13px;color:#334155}</style></head>
    <body><h1>PHIẾU NHẬP KHO — ${escapeHtml(r.code)}</h1><div class="sub">Siêu thị MSS301 · Goods Receipt Note</div>
    <table>${rows}</table>
    <div class="sign"><div>Người lập phiếu<br/><br/><br/>__________</div><div>Quản lý kho<br/><br/><br/>__________</div></div>
    </body></html>`
  const w = window.open('', '_blank', 'width=800,height=600')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
}

export default function GoodsReceipts() {
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isManager = MANAGER.includes(user?.role)
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')

  const load = async () => {
    const res = await withFallback(() => goodsReceiptService.list())
    setRows(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.status === 'Chờ duyệt').length,
    approved: rows.filter((r) => r.status === 'Đã duyệt').length,
    value: rows.reduce((s, r) => s + (Number(r.total) || 0), 0),
  }), [rows])

  const decide = async (r, approve) => {
    if (source !== 'backend' || !r.id) { toast.error('Không có kết nối backend.'); return }
    const ok = approve
      ? await confirm({ title: 'Duyệt phiếu nhập?', message: `Duyệt phiếu nhập kho ${r.code} của ${r.supplier}.`, confirmLabel: 'Duyệt' })
      : await confirm({ title: 'Từ chối phiếu nhập?', message: `Từ chối phiếu nhập kho ${r.code} của ${r.supplier}.`, confirmLabel: 'Từ chối', danger: true })
    if (!ok) return
    try {
      if (approve) await goodsReceiptService.approve(r.id)
      else await goodsReceiptService.reject(r.id)
      toast.success(approve ? `Đã duyệt phiếu ${r.code}.` : `Đã từ chối phiếu ${r.code}.`)
      await load()
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.6"
        title="Phiếu nhập kho"
        subtitle="Lập, duyệt và in phiếu nhập hàng từ nhà cung cấp."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={() => navigate('/app/warehouse/goods-receipts/new')}>Lập phiếu</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng phiếu" value={stats.total} icon={FileInput} tone="brand" />
        <StatCard label="Chờ duyệt" value={stats.pending} icon={Clock} tone="amber" />
        <StatCard label="Đã duyệt" value={stats.approved} icon={PackageCheck} tone="green" />
        <StatCard label="Tổng giá trị" value={formatCurrency(stats.value, { compact: true })} icon={PackageCheck} tone="blue" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <DataTable
            rows={rows}
            rowKey="code"
            onRowClick={(r) => navigate(`/app/warehouse/goods-receipts/${r.id || r.code}`)}
            empty={{ title: 'Chưa có phiếu nhập kho' }}
            columns={[
              { key: 'code', header: 'Mã phiếu', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
              { key: 'supplier', header: 'Nhà cung cấp', render: (r) => <span className="font-medium text-slate-700">{r.supplier}</span> },
              { key: 'poCode', header: 'PO', render: (r) => r.poCode || '—' },
              { key: 'receiveDate', header: 'Ngày nhận', render: (r) => formatDate(r.receiveDate) },
              { key: 'items', header: 'Mặt hàng', align: 'right' },
              { key: 'total', header: 'Giá trị', align: 'right', render: (r) => formatCurrency(r.total) },
              { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            ]}
            actions={(r) => (
              <>
                <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/app/warehouse/goods-receipts/${r.id || r.code}`)}>Xem</Button>
                <Button size="sm" variant="ghost" icon={Printer} onClick={() => printReceipt(r)} />
                {isManager && r.status === 'Chờ duyệt' && (
                  <>
                    <Button size="sm" variant="success" icon={CheckCircle2} onClick={() => decide(r, true)}>Duyệt</Button>
                    <Button size="sm" variant="danger" icon={XCircle} onClick={() => decide(r, false)}>Từ chối</Button>
                  </>
                )}
              </>
            )}
          />
        </CardBody>
      </Card>
    </div>
  )
}
