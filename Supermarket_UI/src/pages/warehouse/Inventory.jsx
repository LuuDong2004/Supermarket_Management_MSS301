import { useMemo, useState, useEffect } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Field, Input, Select, Button, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import { inventoryService, withFallback, toList, mockInventory } from '../../services/index.js'
import { Boxes, AlertTriangle, DollarSign, Layers, Search, Eye } from 'lucide-react'

export default function Inventory() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stockStatus, setStockStatus] = useState('all')
  const [detail, setDetail] = useState(null)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => inventoryService.list(), mockInventory)
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const categories = useMemo(() => [...new Set(rows.map((p) => p.category))], [rows])

  const isLow = (p) => Number(p.onHand) <= Number(p.threshold ?? 10)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((p) => {
      if (q && !(p.name || '').toLowerCase().includes(q) && !(p.code || '').toLowerCase().includes(q) && !(p.productCode || '').toLowerCase().includes(q)) return false
      if (category !== 'all' && p.category !== category) return false
      if (stockStatus === 'low' && !isLow(p)) return false
      if (stockStatus === 'ok' && isLow(p)) return false
      return true
    })
  }, [rows, search, category, stockStatus])

  const lowCount = rows.filter(isLow).length
  const totalUnits = rows.reduce((s, p) => s + Number(p.onHand || 0), 0)

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.2"
        title="Thông tin tồn kho"
        subtitle="Tra cứu chi tiết hàng hóa, số lượng tồn và hạn sử dụng."
        actions={
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng SKU" value={formatNumber(rows.length)} icon={Boxes} tone="brand" hint="mặt hàng" />
        <StatCard label="Tổng số lượng" value={formatNumber(totalUnits)} icon={Layers} tone="blue" hint="đơn vị tồn" />
        <StatCard label="Tồn kho thấp" value={formatNumber(lowCount)} icon={AlertTriangle} tone="amber" hint="≤ ngưỡng" />
        <StatCard label="Tổng vị trí" value={formatNumber(new Set(rows.map((p) => p.location)).size)} icon={DollarSign} tone="green" hint="khu vực kho" />
      </div>

      <div className="mt-6">
        <FilterBar>
          <Field label="Tìm kiếm" className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="Tên hoặc mã..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner className="h-7 w-7" />
          </div>
        ) : (
          <DataTable
            rows={filtered}
            onRowClick={(r) => setDetail(r)}
            empty={{ title: 'Không tìm thấy sản phẩm', subtitle: 'Thử thay đổi từ khóa hoặc bộ lọc.' }}
            columns={[
              { key: 'code', header: 'Mã hàng', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
              { key: 'name', header: 'Sản phẩm', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
              { key: 'category', header: 'Ngành hàng', render: (r) => <Badge tone="slate">{r.category}</Badge> },
              { key: 'location', header: 'Vị trí', render: (r) => <span className="text-slate-600">{r.location}</span> },
              { key: 'threshold', header: 'Ngưỡng', align: 'center' },
              { key: 'onHand', header: 'Tồn', align: 'right', render: (r) => (
                <Badge tone={isLow(r) ? 'red' : 'green'}>{r.onHand} {r.unit}</Badge>
              ) },
              { key: 'unit', header: 'Đơn vị', align: 'center' },
            ]}
            actions={(r) => (
              <Button size="sm" variant="secondary" icon={Eye} onClick={() => setDetail(r)}>Xem</Button>
            )}
          />
        )}
      </div>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name || ''}
        subtitle={detail ? `Mã hàng ${detail.code}` : ''}
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Đóng</Button>}
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Mã sản phẩm" value={<span className="font-mono text-xs">{detail.productCode}</span>} />
            <Row label="Ngành hàng" value={<Badge tone="slate">{detail.category}</Badge>} />
            <Row label="Vị trí" value={detail.location} />
            <Row label="Ngưỡng cảnh báo" value={formatNumber(detail.threshold)} />
            <Row label="Tồn kho" value={<Badge tone={isLow(detail) ? 'red' : 'green'}>{detail.onHand} {detail.unit}</Badge>} />
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
