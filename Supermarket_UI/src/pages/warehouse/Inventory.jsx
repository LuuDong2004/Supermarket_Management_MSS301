import { useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Field, Input, Select, Button, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Boxes, AlertTriangle, DollarSign, Layers, Search } from 'lucide-react'

const categories = [...new Set(db.products.map((p) => p.category))]

export default function Inventory() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stockStatus, setStockStatus] = useState('all')
  const [detail, setDetail] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return db.products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.barcode.includes(q)) return false
      if (category !== 'all' && p.category !== category) return false
      if (stockStatus === 'low' && p.stock > 10) return false
      if (stockStatus === 'ok' && p.stock <= 10) return false
      return true
    })
  }, [search, category, stockStatus])

  const lowCount = db.products.filter((p) => p.stock <= 10).length
  const totalValue = db.products.reduce((s, p) => s + p.cost * p.stock, 0)
  const totalUnits = db.products.reduce((s, p) => s + p.stock, 0)

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.2"
        title="Thông tin tồn kho"
        subtitle="Tra cứu chi tiết hàng hóa, số lượng tồn và hạn sử dụng."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng SKU" value={formatNumber(db.products.length)} icon={Boxes} tone="brand" hint="mặt hàng" />
        <StatCard label="Tổng số lượng" value={formatNumber(totalUnits)} icon={Layers} tone="blue" hint="đơn vị tồn" />
        <StatCard label="Tồn kho thấp" value={formatNumber(lowCount)} icon={AlertTriangle} tone="amber" hint="≤ 10 đơn vị" />
        <StatCard label="Giá trị tồn" value={formatCurrency(totalValue, { compact: true })} icon={DollarSign} tone="green" hint="theo giá vốn" />
      </div>

      <div className="mt-6">
        <FilterBar>
          <Field label="Tìm kiếm" className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="Tên hoặc mã vạch..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </Field>
          <Field label="Ngành hàng">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Tất cả</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Trạng thái tồn">
            <Select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="low">Tồn thấp</option>
              <option value="ok">Đủ tồn</option>
            </Select>
          </Field>
        </FilterBar>

        <DataTable
          rows={filtered}
          onRowClick={(r) => setDetail(r)}
          empty={{ title: 'Không tìm thấy sản phẩm', subtitle: 'Thử thay đổi từ khóa hoặc bộ lọc.' }}
          columns={[
            { key: 'barcode', header: 'Mã vạch', render: (r) => <span className="font-mono text-xs">{r.barcode}</span> },
            { key: 'name', header: 'Sản phẩm', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
            { key: 'category', header: 'Ngành hàng', render: (r) => <Badge tone="slate">{r.category}</Badge> },
            { key: 'price', header: 'Giá bán', align: 'right', render: (r) => formatCurrency(r.price) },
            { key: 'stock', header: 'Tồn', align: 'right', render: (r) => (
              <Badge tone={r.stock <= 10 ? 'red' : 'green'}>{r.stock} {r.unit}</Badge>
            ) },
            { key: 'unit', header: 'Đơn vị', align: 'center' },
            { key: 'expiry', header: 'Hạn dùng', render: (r) => formatDate(r.expiry) },
          ]}
        />
      </div>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name || ''}
        subtitle={detail ? `Mã vạch ${detail.barcode}` : ''}
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Đóng</Button>}
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Mã sản phẩm" value={<span className="font-mono text-xs">{detail.id}</span>} />
            <Row label="Ngành hàng" value={<Badge tone="slate">{detail.category}</Badge>} />
            <Row label="Giá bán" value={formatCurrency(detail.price)} />
            <Row label="Giá vốn" value={formatCurrency(detail.cost)} />
            <Row label="Tồn kho" value={<Badge tone={detail.stock <= 10 ? 'red' : 'green'}>{detail.stock} {detail.unit}</Badge>} />
            <Row label="Giá trị tồn" value={<span className="font-semibold text-slate-800">{formatCurrency(detail.cost * detail.stock)}</span>} />
            <Row label="Hạn sử dụng" value={formatDate(detail.expiry)} />
            <Divider />
            <p className="text-xs text-slate-400">Lịch sử nhập xuất sẽ hiển thị khi tích hợp inventory-service.</p>
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
