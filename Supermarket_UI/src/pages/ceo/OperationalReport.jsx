import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Badge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars, Donut } from '../../components/ui/Charts.jsx'
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format.js'
import { reportService, withFallback, toList } from '../../services/index.js'
import { ShoppingCart, Boxes, AlertTriangle, Gauge, BarChart3, PieChart } from 'lucide-react'

const money = (millions, opts) => formatCurrency((Number(millions) || 0) * 1_000_000, opts)

export default function OperationalReport() {
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')

  const load = async () => {
    const res = await withFallback(() => reportService.operational())
    setRows(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const totals = useMemo(() => {
    const orders = rows.reduce((s, r) => s + (Number(r.orders) || 0), 0)
    const inventory = rows.reduce((s, r) => s + (Number(r.inventoryValue) || 0), 0)
    const lowStock = rows.reduce((s, r) => s + (Number(r.lowStockItems) || 0), 0)
    const fulfillment = rows.length
      ? rows.reduce((s, r) => s + (Number(r.fulfillmentRate) || 0), 0) / rows.length
      : 0
    return { orders, inventory, lowStock, fulfillment }
  }, [rows])

  const inventoryShare = useMemo(
    () => rows.map((r) => ({ name: r.area, value: Number(r.inventoryValue) || 0 })),
    [rows],
  )

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.6"
        title="Báo cáo vận hành"
        subtitle="Hiệu suất tồn kho, đơn hàng và nhân sự theo từng ngành hàng."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng đơn hàng" value={formatNumber(totals.orders)} icon={ShoppingCart} tone="brand" hint="toàn kỳ" />
        <StatCard label="Giá trị tồn kho" value={money(totals.inventory, { compact: true })} icon={Boxes} tone="blue" hint="hiện tại" />
        <StatCard label="SP sắp hết hàng" value={formatNumber(totals.lowStock)} icon={AlertTriangle} tone="amber" hint="dưới định mức" />
        <StatCard label="Tỉ lệ hoàn tất TB" value={formatPercent(totals.fulfillment)} icon={Gauge} tone="green" hint="đơn hàng" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Đơn hàng · Điểm nhân sự theo ngành" icon={BarChart3} />
          <CardBody>
            <Bars
              data={rows}
              x="area"
              series={[
                { key: 'orders', name: 'Đơn hàng', color: '#111111' },
                { key: 'staffScore', name: 'Điểm nhân sự', color: '#999999' },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu giá trị tồn kho" icon={PieChart} />
          <CardBody><Donut data={inventoryShare} /></CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Chi tiết theo ngành hàng" />
        <CardBody className="p-0">
          <DataTable
            rows={rows}
            rowKey="area"
            empty={{ title: 'Chưa có dữ liệu vận hành' }}
            columns={[
              { key: 'area', header: 'Ngành hàng', render: (r) => <span className="font-medium text-slate-700">{r.area}</span> },
              { key: 'orders', header: 'Đơn', align: 'right', render: (r) => formatNumber(r.orders) },
              { key: 'inventoryValue', header: 'Tồn kho', align: 'right', render: (r) => money(r.inventoryValue, { compact: true }) },
              { key: 'turnoverRate', header: 'Vòng quay', align: 'right', render: (r) => `${Number(r.turnoverRate).toFixed(1)}×` },
              { key: 'lowStockItems', header: 'Sắp hết', align: 'center', render: (r) => (
                <Badge tone={r.lowStockItems > 4 ? 'red' : 'slate'}>{r.lowStockItems}</Badge>
              ) },
              { key: 'fulfillmentRate', header: 'Hoàn tất', align: 'right', render: (r) => formatPercent(r.fulfillmentRate) },
              { key: 'staffScore', header: 'Điểm NS', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{r.staffScore}</span> },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  )
}
