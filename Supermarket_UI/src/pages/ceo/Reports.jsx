import { useState, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Field, Select, Badge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars, Donut, AreaTrend } from '../../components/ui/Charts.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { DollarSign, Wallet, TrendingUp, ShoppingCart, BarChart3, PieChart, LineChart, Package } from 'lucide-react'

export default function Reports() {
  const [period, setPeriod] = useState('6m')

  const monthly = useMemo(() => {
    if (period === '3m') return db.monthlyRevenue.slice(-3)
    return db.monthlyRevenue
  }, [period])

  const lastMonth = db.monthlyRevenue[db.monthlyRevenue.length - 1]
  const prevMonth = db.monthlyRevenue[db.monthlyRevenue.length - 2]
  const growth = prevMonth ? Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100) : 0

  // Revenue figures are in "triệu đồng" in the dataset; show as currency.
  const revenueVnd = lastMonth.revenue * 1_000_000
  const profitVnd = Math.round(revenueVnd * 0.22)

  const topProducts = useMemo(
    () =>
      db.products
        .map((p) => ({ ...p, revenue: p.price * Math.max(1, 200 - p.stock) }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6),
    [],
  )

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.1"
        title="Báo cáo quản trị"
        subtitle="Tổng quan kết quả kinh doanh cho ban điều hành."
        actions={
          <Field>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="3m">3 tháng gần nhất</option>
              <option value="6m">6 tháng gần nhất</option>
            </Select>
          </Field>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu tháng" value={formatCurrency(revenueVnd, { compact: true })} icon={DollarSign} tone="green" delta={growth} hint="so với tháng trước" />
        <StatCard label="Lợi nhuận" value={formatCurrency(profitVnd, { compact: true })} icon={Wallet} tone="brand" delta={9} hint="ước tính 22%" />
        <StatCard label="Tăng trưởng" value={`${growth}%`} icon={TrendingUp} tone={growth >= 0 ? 'blue' : 'red'} hint="theo tháng" />
        <StatCard label="Đơn hàng" value={formatNumber(4820)} icon={ShoppingCart} tone="violet" delta={6} hint="trong tháng" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Doanh thu vs Mục tiêu" subtitle="Triệu đồng" icon={BarChart3} />
          <CardBody>
            <Bars
              data={monthly}
              x="month"
              series={[
                { key: 'revenue', name: 'Doanh thu', color: '#4f46e5' },
                { key: 'target', name: 'Mục tiêu', color: '#94a3b8' },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu ngành hàng" icon={PieChart} />
          <CardBody><Donut data={db.categoryShare} /></CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Xu hướng doanh thu" subtitle="7 ngày · Triệu đồng" icon={LineChart} />
          <CardBody><AreaTrend data={db.salesTrend} x="day" y="revenue" /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Top sản phẩm" subtitle="Theo doanh thu ước tính" icon={Package} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={topProducts}
              dense
              columns={[
                { key: 'name', header: 'Sản phẩm', render: (p) => <span className="font-medium text-slate-700">{p.name}</span> },
                { key: 'category', header: 'Ngành', render: (p) => <Badge tone="slate">{p.category}</Badge> },
                { key: 'revenue', header: 'Doanh thu', align: 'right', render: (p) => <span className="font-semibold">{formatCurrency(p.revenue, { compact: true })}</span> },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
