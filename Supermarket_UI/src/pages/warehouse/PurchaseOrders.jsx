import { useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { ClipboardList, Clock, CheckCircle2, DollarSign, Plus, Search, Trash2, Building2 } from 'lucide-react'

export default function PurchaseOrders() {
  const toast = useToast()
  const [orders, setOrders] = useState(db.purchaseOrders)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [supplier, setSupplier] = useState('all')
  const [detail, setDetail] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)

  const [form, setForm] = useState({ supplier: db.suppliers[0].name, date: '2026-06-15' })
  const [lines, setLines] = useState([{ product: db.products[0].name, qty: 10, price: db.products[0].cost }])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (search && !o.id.toLowerCase().includes(search.trim().toLowerCase())) return false
      if (status !== 'all' && o.status !== status) return false
      if (supplier !== 'all' && o.supplier !== supplier) return false
      return true
    })
  }, [orders, search, status, supplier])

  const pending = orders.filter((o) => o.status === 'Pending').length
  const approved = orders.filter((o) => o.status === 'Approved' || o.status === 'Received').length
  const totalValue = orders.reduce((s, o) => s + o.total, 0)

  const addLine = () => setLines((l) => [...l, { product: db.products[0].name, qty: 1, price: db.products[0].cost }])
  const removeLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i))
  const setLine = (i, key, val) => setLines((l) => l.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)))
  const draftTotal = lines.reduce((s, x) => s + Number(x.qty) * Number(x.price), 0)

  const createOrder = () => {
    const id = `PO-2026-0${42 + orders.length}`
    const newOrder = {
      id,
      supplier: form.supplier,
      date: form.date,
      items: lines.length,
      total: draftTotal,
      status: 'Pending',
      approval: 'Chờ duyệt',
    }
    setOrders((o) => [newOrder, ...o])
    setCreateOpen(false)
    setLines([{ product: db.products[0].name, qty: 10, price: db.products[0].cost }])
    toast.success(`Đã tạo đơn mua ${id}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.1"
        title="Đơn mua hàng"
        subtitle="Quản lý đơn đặt mua từ nhà cung cấp và theo dõi trạng thái duyệt."
        actions={<Button icon={Plus} onClick={() => setCreateOpen(true)}>Tạo đơn mua</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng đơn mua" value={formatNumber(orders.length)} icon={ClipboardList} tone="brand" hint="trong kỳ" />
        <StatCard label="Chờ duyệt" value={formatNumber(pending)} icon={Clock} tone="amber" hint="cần xử lý" />
        <StatCard label="Đã duyệt" value={formatNumber(approved)} icon={CheckCircle2} tone="green" hint="đã thông qua" />
        <StatCard label="Tổng giá trị" value={formatCurrency(totalValue, { compact: true })} icon={DollarSign} tone="blue" hint="toàn bộ đơn" />
      </div>

      <div className="mt-6">
        <FilterBar>
          <Field label="Tìm kiếm" className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="Mã đơn mua..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </Field>
          <Field label="Trạng thái">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Received">Đã nhận</option>
              <option value="Rejected">Từ chối</option>
            </Select>
          </Field>
          <Field label="Nhà cung cấp">
            <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="all">Tất cả</option>
              {db.suppliers.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </Select>
          </Field>
        </FilterBar>

        <DataTable
          rows={filtered}
          onRowClick={(r) => setDetail(r)}
          empty={{ title: 'Không có đơn mua', subtitle: 'Thử thay đổi bộ lọc hoặc tạo đơn mới.' }}
          columns={[
            { key: 'id', header: 'Mã đơn', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: 'supplier', header: 'Nhà cung cấp' },
            { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
            { key: 'items', header: 'Số mặt hàng', align: 'center' },
            { key: 'total', header: 'Giá trị', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.total)}</span> },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            { key: 'approval', header: 'Duyệt', render: (r) => <StatusBadge status={r.approval} /> },
          ]}
        />
      </div>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tạo đơn mua hàng"
        subtitle="Chọn nhà cung cấp và thêm các mặt hàng cần đặt."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button onClick={createOrder}>Tạo đơn</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nhà cung cấp" required>
              <Select value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}>
                {db.suppliers.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Ngày đặt" required>
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Danh sách mặt hàng</p>
            <Button variant="secondary" size="sm" icon={Plus} onClick={addLine}>Thêm dòng</Button>
          </div>

          <div className="space-y-2">
            {lines.map((ln, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-6">
                  <Select value={ln.product} onChange={(e) => setLine(i, 'product', e.target.value)}>
                    {db.products.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input type="number" min={1} value={ln.qty} onChange={(e) => setLine(i, 'qty', e.target.value)} placeholder="SL" />
                </div>
                <div className="col-span-3">
                  <Input type="number" min={0} value={ln.price} onChange={(e) => setLine(i, 'price', e.target.value)} placeholder="Đơn giá" />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button onClick={() => removeLine(i)} className="rounded p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Tổng giá trị dự kiến</span>
            <span className="text-lg font-bold text-brand-700">{formatCurrency(draftTotal)}</span>
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Chi tiết ${detail.id}` : ''}
        subtitle={detail?.supplier}
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Đóng</Button>}
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Nhà cung cấp" value={<span className="inline-flex items-center gap-1.5"><Building2 size={14} className="text-slate-400" />{detail.supplier}</span>} />
            <Row label="Ngày đặt" value={formatDate(detail.date)} />
            <Row label="Số mặt hàng" value={formatNumber(detail.items)} />
            <Row label="Tổng giá trị" value={<span className="font-semibold text-slate-800">{formatCurrency(detail.total)}</span>} />
            <Row label="Trạng thái" value={<StatusBadge status={detail.status} />} />
            <Row label="Duyệt" value={<StatusBadge status={detail.approval} />} />
            <Divider />
            <p className="text-xs text-slate-400">Chi tiết dòng hàng sẽ hiển thị khi tích hợp inventory-service.</p>
          </div>
        )}
      </Modal>
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
