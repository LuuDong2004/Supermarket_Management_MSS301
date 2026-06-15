import { useState, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars, Donut } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import {
  Warehouse, Package, AlertTriangle, CalendarClock, FileSpreadsheet, Boxes, BarChart3,
} from 'lucide-react'

const LOW_STOCK_THRESHOLD = 10
const EXPIRY_WINDOW_DAYS = 30

function daysUntil(dateStr) {
  const diff = new Date(dateStr).getTime() - new Date('2026-06-15').getTime()
  return Math.round(diff / 86_400_000)
}

export default function InventoryReport() {
  const toast = useToast()
  const [date, setDate] = useState('2026-06-15')
  const [category, setCategory] = useState('all')

  const categories = useMemo(() => [...new Set(db.products.map((p) => p.category))], [])

  const filtered = useMemo(
    () => db.products.filter((p) => category === 'all' || p.category === category),
    [category],
  )

  const stockValue = useMemo(() => db.products.reduce((s, p) => s + p.cost * p.stock, 0), [])
  const lowStock = useMemo(() => db.products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD), [])
  const nearExpiry = useMemo(
    () => db.products.filter((p) => daysUntil(p.expiry) <= EXPIRY_WINDOW_DAYS && daysUntil(p.expiry) >= 0),
    [],
  )

  // Aggregate stock value by category for the bar chart (value in millions).
  const byCategory = useMemo(() => {
    const map = {}
    for (const p of db.products) map[p.category] = (map[p.category] || 0) + p.cost * p.stock
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value / 1_000_000) }))
  }, [])

  const rows = useMemo(
    () => filtered.map((p) => ({ ...p, value: p.cost * p.stock })).sort((a, b) => b.value - a.value),
    [filtered],
  )

  const exportReport = () => toast.success('Đã xuất báo cáo tồn kho ra Excel.')

  const stockBadge = (p) => {
    if (p.stock <= LOW_STOCK_THRESHOLD) return <Badge tone="red" dot>Tồn thấp</Badge>
    if (p.stock <= 40) return <Badge tone="amber" dot>Trung bình</Badge>
    return <Badge tone="green" dot>Đủ hàng</Badge>
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Báo cáo · 3.10.2"
        title="Kho & Tồn kho"
        subtitle="Giá trị tồn kho, cảnh báo tồn thấp và hàng cận hạn sử dụng."
        actions={<Button icon={FileSpreadsheet} onClick={exportReport}>Xuất Excel</Button>}
      />

      <FilterBar>
        <Field label="Ngày chốt" className="w-40">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Ngành hàng" className="w-52">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Tất cả ngành hàng</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <div className="ml-auto">
          <Button variant="secondary" icon={FileSpreadsheet} onClick={exportReport}>Xuất báo cáo</Button>
        </div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Giá trị tồn kho" value={formatCurrency(stockValue, { compact: true })} icon={Warehouse} tone="brand" hint="theo giá vốn" />
        <StatCard label="Số SKU" value={formatNumber(db.products.length)} icon={Package} tone="blue" hint="đang kinh doanh" />
        <StatCard label="Tồn kho thấp" value={formatNumber(lowStock.length)} icon={AlertTriangle} tone="red" hint={`≤ ${LOW_STOCK_THRESHOLD} đơn vị`} />
        <StatCard label="Cận hạn sử dụng" value={formatNumber(nearExpiry.length)} icon={CalendarClock} tone="amber" hint={`trong ${EXPIRY_WINDOW_DAYS} ngày`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Giá trị tồn theo ngành hàng" subtitle="Triệu đồng" icon={BarChart3} />
          <CardBody>
            <Bars data={byCategory} x="name" series={[{ key: 'value', name: 'Giá trị tồn' }]} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu ngành hàng" subtitle="Tỷ trọng" icon={Boxes} />
          <CardBody><Donut data={db.categoryShare} /></CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Chi tiết tồn kho" subtitle="Sắp xếp theo giá trị tồn giảm dần" icon={Package} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={rows}
              rowKey="id"
              columns={[
                {
                  key: 'name',
                  header: 'Sản phẩm',
                  render: (r) => (
                    <div>
                      <p className="font-medium text-slate-700">{r.name}</p>
                      <p className="font-mono text-xs text-slate-400">{r.category}</p>
                    </div>
                  ),
                },
                { key: 'stock', header: 'Tồn kho', align: 'center', render: (r) => <span className="font-medium">{formatNumber(r.stock)} {r.unit}</span> },
                { key: 'cost', header: 'Giá vốn', align: 'right', render: (r) => formatCurrency(r.cost) },
                { key: 'expiry', header: 'Hạn dùng', align: 'center', render: (r) => formatDate(r.expiry) },
                { key: 'value', header: 'Giá trị tồn', align: 'right', render: (r) => <span className="font-semibold text-slate-800">{formatCurrency(r.value)}</span> },
                { key: 'status', header: 'Trạng thái', align: 'center', render: stockBadge },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
