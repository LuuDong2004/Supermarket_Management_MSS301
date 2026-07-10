import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatCurrency, formatDate } from '../../lib/format.js'
import { goodsReceiptService, withFallback, toList } from '../../services/index.js'
import { Plus, CheckCircle2, XCircle, Printer, FileInput, Clock, PackageCheck } from 'lucide-react'

const MANAGER = ['ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN']
const today = () => new Date().toISOString().slice(0, 10)
const emptyForm = { code: '', poCode: '', supplier: '', receiveDate: today(), receivedBy: '', items: '', total: '', note: '' }

function printReceipt(r) {
  const rows = `
    <tr><td>Nhà cung cấp</td><td>${r.supplier || ''}</td></tr>
    <tr><td>Đơn mua (PO)</td><td>${r.poCode || '—'}</td></tr>
    <tr><td>Ngày nhận</td><td>${r.receiveDate || ''}</td></tr>
    <tr><td>Người nhận</td><td>${r.receivedBy || '—'}</td></tr>
    <tr><td>Số mặt hàng</td><td>${r.items ?? ''}</td></tr>
    <tr><td>Tổng giá trị</td><td>${new Intl.NumberFormat('vi-VN').format(r.total || 0)} đ</td></tr>
    <tr><td>Trạng thái</td><td>${r.status || ''}</td></tr>
    <tr><td>Ghi chú</td><td>${r.note || '—'}</td></tr>`
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${r.code}</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#0f172a}h1{font-size:20px;margin:0 0 4px}
    .sub{color:#64748b;font-size:13px;margin-bottom:20px}table{width:100%;border-collapse:collapse}
    td{border:1px solid #e2e8f0;padding:8px 10px;font-size:14px}td:first-child{width:180px;color:#64748b;font-weight:600}
    .sign{margin-top:48px;display:flex;justify-content:space-between;text-align:center;font-size:13px;color:#334155}</style></head>
    <body><h1>PHIẾU NHẬP KHO — ${r.code}</h1><div class="sub">Siêu thị MSS301 · Goods Receipt Note</div>
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
  const { user } = useAuth()
  const isManager = MANAGER.includes(user?.role)
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')
  const [form, setForm] = useState(null)
  const [selected, setSelected] = useState(null)

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

  const create = async () => {
    if (!form.code.trim() || !form.supplier.trim()) { toast.error('Nhập mã phiếu và nhà cung cấp.'); return }
    if (source !== 'backend') { toast.error('Không có kết nối backend.'); return }
    const body = {
      code: form.code, poCode: form.poCode || null, supplier: form.supplier,
      receiveDate: form.receiveDate || today(), receivedBy: form.receivedBy || null,
      items: Number(form.items) || 0, total: Number(form.total) || 0, note: form.note || null,
    }
    try {
      await goodsReceiptService.create(body)
      toast.success(`Đã tạo phiếu nhập ${form.code}.`)
      setForm(null)
      await load()
    } catch (e) { toast.error(e.message) }
  }

  const decide = async (r, approve) => {
    setSelected(null)
    if (source !== 'backend' || !r.id) { toast.error('Không có kết nối backend.'); return }
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
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={() => setForm({ ...emptyForm, code: `GRN-${Date.now().toString().slice(-4)}` })}>Lập phiếu</Button>
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
            onRowClick={(r) => setSelected(r)}
            empty={{ title: 'Chưa có phiếu nhập kho' }}
            columns={[
              { key: 'code', header: 'Mã phiếu', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
              { key: 'supplier', header: 'Nhà cung cấp', render: (r) => <span className="font-medium text-slate-700">{r.supplier}</span> },
              { key: 'poCode', header: 'PO', render: (r) => r.poCode || '—' },
              { key: 'receiveDate', header: 'Ngày nhận', render: (r) => formatDate(r.receiveDate) },
              { key: 'items', header: 'Mặt hàng', align: 'right' },
              { key: 'total', header: 'Giá trị', align: 'right', render: (r) => formatCurrency(r.total) },
              { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'actions', header: '', align: 'right', render: (r) => (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" icon={Printer} onClick={(e) => { e.stopPropagation(); printReceipt(r) }} />
                  {isManager && r.status === 'Chờ duyệt' && (
                    <>
                      <Button size="sm" variant="success" icon={CheckCircle2} onClick={(e) => { e.stopPropagation(); decide(r, true) }}>Duyệt</Button>
                      <Button size="sm" variant="danger" icon={XCircle} onClick={(e) => { e.stopPropagation(); decide(r, false) }}>Từ chối</Button>
                    </>
                  )}
                </div>
              ) },
            ]}
          />
        </CardBody>
      </Card>

      {/* Create modal */}
      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title="Lập phiếu nhập kho"
        subtitle="Ghi nhận lô hàng nhận từ nhà cung cấp"
        size="lg"
        footer={<><Button variant="secondary" onClick={() => setForm(null)}>Hủy</Button><Button onClick={create}>Tạo phiếu</Button></>}
      >
        {form && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mã phiếu" required><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field label="Mã PO"><Input value={form.poCode} onChange={(e) => setForm({ ...form, poCode: e.target.value })} placeholder="PO-..." /></Field>
            <Field label="Nhà cung cấp" required className="sm:col-span-2"><Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></Field>
            <Field label="Ngày nhận"><Input type="date" value={form.receiveDate} onChange={(e) => setForm({ ...form, receiveDate: e.target.value })} /></Field>
            <Field label="Người nhận"><Input value={form.receivedBy} onChange={(e) => setForm({ ...form, receivedBy: e.target.value })} /></Field>
            <Field label="Số mặt hàng"><Input type="number" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} /></Field>
            <Field label="Tổng giá trị"><Input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} /></Field>
            <Field label="Ghi chú" className="sm:col-span-2"><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
          </div>
        )}
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Phiếu ${selected.code}` : ''}
        subtitle={selected?.supplier}
        footer={
          <>
            <Button variant="secondary" icon={Printer} onClick={() => printReceipt(selected)}>In phiếu</Button>
            {isManager && selected?.status === 'Chờ duyệt' ? (
              <>
                <Button variant="danger" icon={XCircle} onClick={() => decide(selected, false)}>Từ chối</Button>
                <Button variant="success" icon={CheckCircle2} onClick={() => decide(selected, true)}>Duyệt</Button>
              </>
            ) : (
              <Button onClick={() => setSelected(null)}>Đóng</Button>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-2 text-sm">
            {[['PO', selected.poCode || '—'], ['Ngày nhận', formatDate(selected.receiveDate)], ['Người nhận', selected.receivedBy || '—'],
              ['Số mặt hàng', selected.items], ['Tổng giá trị', formatCurrency(selected.total)]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">{k}</span><span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Trạng thái</span><StatusBadge status={selected.status} />
            </div>
            <div><p className="text-slate-500">Ghi chú</p><p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-slate-700">{selected.note || 'Không có.'}</p></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
