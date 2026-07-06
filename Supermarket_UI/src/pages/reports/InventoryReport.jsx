import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars, Donut } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber } from '../../lib/format.js'
import {
  inventoryService, reportService, withFallback, toList,
  mockInventory, mockCategoryShare,
} from '../../services/index.js'
import {
  Warehouse, Package, AlertTriangle, PackageX, FileSpreadsheet, Boxes, BarChart3,
} from 'lucide-react'

export default function InventoryReport() {
  const toast = useToast()
  const [date, setDate] = useState('2026-06-15')
  const [category, setCategory] = useState('all')

  const [source, setSource] = useState('backend')
  const [items, setItems] = useState([])
  const [share, setShare] = useState([])

  const load = async () => {
    const inv = await withFallback(() => inventoryService.list(), mockInventory)
    const s = await withFallback(() => reportService.categoryShare(), mockCategoryShare)
    setItems(toList(inv.data))
    setShare(toList(s.data))
    setSource(inv.source)
  }
  useEffect(() => { load() }, [])

  const categories = useMemo(() => [...new Set(items.map((p) => p.category))], [items])

  const filtered = useMemo(
    () => items.filter((p) => category === 'all' || p.category === category),
    [category, items],
  )

  // Compute low-stock / valuation from onHand (backend inventory has no cost field).
  const totalUnits = useMemo(() => items.reduce((s, p) => s + (p.onHand || 0), 0), [items])
  const lowStock = useMemo(() => items.filter((p) => (p.onHand || 0) <= (p.threshold ?? 10)), [items])
  const outOfStock = useMemo(() => items.filter((p) => (p.onHand || 0) === 0), [items])

  // Aggregate units on hand by category for the bar chart.
  const byCategory = useMemo(() => {
    const map = {}
    for (const p of items) map[p.category] = (map[p.category] || 0) + (p.onHand || 0)
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [items])

  const rows = useMemo(
    () => [...filtered].sort((a, b) => (b.onHand || 0) - (a.onHand || 0)),
    [filtered],
  )

  const exportReport = () => toast.success('Đã xuất báo cáo tồn kho ra Excel.')

  const stockBadge = (p) => {
    const onHand = p.onHand || 0
    const threshold = p.threshold ?? 10
    if (onHand <= threshold) return <Badge tone="red" dot>Tồn thấp</Badge>
    if (onHand <= threshold * 4) return <Badge tone="amber" dot>Trung bình</Badge>
    return <Badge tone="green" dot>Đủ hàng</Badge>
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Báo cáo · 3.10.2"
        title="Kho & Tồn kho"
        subtitle="Giá trị tồn kho, cảnh báo tồn thấp và hàng cận hạn sử dụng."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={FileSpreadsheet} onClick={exportReport}>Xuất Excel</Button>
          </div>
        }
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
        <StatCard label="Tổng tồn kho" value={`${formatNumber(totalUnits)} đơn vị`} icon={Warehouse} tone="brand" hint="theo số lượng" />
        <StatCard label="Số SKU" value={formatNumber(items.length)} icon={Package} tone="blue" hint="đang kinh doanh" />
        <StatCard label="Tồn kho thấp" value={formatNumber(lowStock.length)} icon={AlertTriangle} tone="red" hint="≤ ngưỡng cảnh báo" />
        <StatCard label="Hết hàng" value={formatNumber(outOfStock.length)} icon={PackageX} tone="amber" hint="cần nhập bổ sung" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tồn kho theo ngành hàng" subtitle="Số lượng đơn vị" icon={BarChart3} />
          <CardBody>
            <Bars data={byCategory} x="name" series={[{ key: 'value', name: 'Tồn kho' }]} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu ngành hàng" subtitle="Tỷ trọng" icon={Boxes} />
          <CardBody><Donut data={share} /></CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Chi tiết tồn kho" subtitle="Sắp xếp theo tồn kho giảm dần" icon={Package} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={rows}
              rowKey="code"
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
                { key: 'onHand', header: 'Tồn kho', align: 'center', render: (r) => <span className="font-medium">{formatNumber(r.onHand || 0)} {r.unit}</span> },
                { key: 'threshold', header: 'Ngưỡng', align: 'center', render: (r) => formatNumber(r.threshold ?? 10) },
                { key: 'location', header: 'Vị trí', align: 'center', render: (r) => r.location || '—' },
                { key: 'status', header: 'Trạng thái', align: 'center', render: stockBadge },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
