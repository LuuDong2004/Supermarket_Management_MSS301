import { useState, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { AreaTrend, Lines, Donut } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import {
  DollarSign, ShoppingCart, Receipt, TrendingUp, FileSpreadsheet,
  Boxes, LineChart, Trophy,
} from 'lucide-react'

export default function SalesReport() {
  const toast = useToast()
  const [from, setFrom] = useState('2026-06-09')
  const [to, setTo] = useState('2026-06-15')
  const [period, setPeriod] = useState('week')

  // Derived KPIs from the sales trend dataset (revenue is in millions).
  const totalRevenue = useMemo(() => db.salesTrend.reduce((s, d) => s + d.revenue, 0) * 1_000_000, [])
  const totalOrders = useMemo(() => db.salesTrend.reduce((s, d) => s + d.orders, 0), [])
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0

  // Top selling products: mock "đã bán" derived from stock, revenue = price * qty.
  const topProducts = useMemo(
    () =>
      db.products
        .map((p) => {
          const sold = Math.max(8, Math.round(p.stock * 0.6))
          return { ...p, sold, revenue: p.price * sold }
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8),
    [],
  )

  const exportReport = () => toast.success('Đã xuất báo cáo doanh thu ra Excel.')

  return (
    <div>
      <PageHeader
        breadcrumb="Báo cáo · 3.10.1"
        title="Doanh thu & Kinh doanh"
        subtitle="Tổng quan hiệu quả kinh doanh theo khoảng thời gian."
        actions={<Button icon={FileSpreadsheet} onClick={exportReport}>Xuất Excel</Button>}
      />

      <FilterBar>
        <Field label="Từ ngày" className="w-40">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Đến ngày" className="w-40">
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Field label="Kỳ báo cáo" className="w-44">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
          </Select>
        </Field>
        <div className="ml-auto">
          <Button variant="secondary" icon={FileSpreadsheet} onClick={exportReport}>Xuất báo cáo</Button>
        </div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(totalRevenue, { compact: true })} icon={DollarSign} tone="green" delta={12} hint="so với kỳ trước" />
        <StatCard label="Đơn hàng" value={formatNumber(totalOrders)} icon={ShoppingCart} tone="brand" delta={8} hint="trong kỳ" />
        <StatCard label="Giá trị TB / đơn" value={formatCurrency(avgOrder, { compact: true })} icon={Receipt} tone="blue" delta={3} hint="so với kỳ trước" />
        <StatCard label="Tăng trưởng" value="+12,4%" icon={TrendingUp} tone="violet" delta={12} hint="cùng kỳ năm trước" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Doanh thu theo ngày" subtitle="Triệu đồng" icon={TrendingUp} />
          <CardBody><AreaTrend data={db.salesTrend} x="day" y="revenue" /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu ngành hàng" subtitle="Tỷ trọng doanh thu" icon={Boxes} />
          <CardBody><Donut data={db.categoryShare} /></CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Doanh thu vs Mục tiêu" subtitle="Theo tháng · Triệu đồng" icon={LineChart} />
          <CardBody>
            <Lines
              data={db.monthlyRevenue}
              x="month"
              series={[
                { key: 'revenue', name: 'Doanh thu' },
                { key: 'target', name: 'Mục tiêu', color: '#f59e0b' },
              ]}
            />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Top sản phẩm bán chạy" subtitle="Theo doanh thu trong kỳ" icon={Trophy} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={topProducts}
              rowKey="id"
              columns={[
                {
                  key: 'name',
                  header: 'Sản phẩm',
                  render: (r) => (
                    <div>
                      <p className="font-medium text-slate-700">{r.name}</p>
                      <p className="font-mono text-xs text-slate-400">{r.barcode}</p>
                    </div>
                  ),
                },
                { key: 'category', header: 'Ngành hàng', render: (r) => <Badge tone="slate">{r.category}</Badge> },
                { key: 'price', header: 'Đơn giá', align: 'right', render: (r) => formatCurrency(r.price) },
                { key: 'sold', header: 'Đã bán', align: 'center', render: (r) => <span className="font-medium">{formatNumber(r.sold)} {r.unit}</span> },
                { key: 'revenue', header: 'Doanh thu', align: 'right', render: (r) => <span className="font-semibold text-slate-800">{formatCurrency(r.revenue)}</span> },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
