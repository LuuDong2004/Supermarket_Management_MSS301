import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Field, Input, Select, Button } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars, Donut, AreaTrend } from '../../components/ui/Charts.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import {
  reportService, productService, withFallback, toList,
  mockSalesTrend, mockCategoryShare, mockMonthlyRevenue, mockProducts,
} from '../../services/index.js'
import { DollarSign, Wallet, TrendingUp, ShoppingCart, BarChart3, PieChart, LineChart, Package } from 'lucide-react'

export default function Reports() {
  const [period, setPeriod] = useState('6m')
  const [source, setSource] = useState('backend')
  const [trend, setTrend] = useState([])
  const [share, setShare] = useState([])
  const [revenue, setRevenue] = useState([])
  const [products, setProducts] = useState([])

  const load = async () => {
    const t = await withFallback(() => reportService.salesTrend(), mockSalesTrend)
    const s = await withFallback(() => reportService.categoryShare(), mockCategoryShare)
    const m = await withFallback(() => reportService.monthlyRevenue(), mockMonthlyRevenue)
    const p = await withFallback(() => productService.list(), mockProducts)
    setTrend(toList(t.data))
    setShare(toList(s.data))
    setRevenue(toList(m.data))
    setProducts(toList(p.data))
    setSource(t.source)
  }
  useEffect(() => { load() }, [])

  const monthly = useMemo(() => {
    if (period === '3m') return revenue.slice(-3)
    return revenue
  }, [period, revenue])

  const lastMonth = revenue[revenue.length - 1] || { revenue: 0 }
  const prevMonth = revenue[revenue.length - 2]
  const growth = prevMonth ? Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100) : 0

  // Revenue figures are in "triệu đồng" in the dataset; show as currency.
  const revenueVnd = lastMonth.revenue * 1_000_000
  const profitVnd = Math.round(revenueVnd * 0.22)

  const topProducts = useMemo(
    () =>
      products
        .map((p) => ({ ...p, revenue: (p.price || 0) * Math.max(1, 200 - (p.stock || 0)) }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6),
    [products],
  )
  const reportDetails = [
    { date: '12/01/26', category: 'Milk', revenue: '120', cost: 'Milk', profit: 'Milk', status: 'Pending' },
    { date: '12/02/26', category: 'Rice', revenue: '240', cost: 'Rice', profit: 'Rice', status: 'Approved' },
    { date: '12/03/26', category: 'Staff A', revenue: '360', cost: 'Staff A', profit: 'Staff A', status: 'Active' },
    { date: '12/04/26', category: 'Customer B', revenue: '480', cost: 'Customer B', profit: 'Customer B', status: 'Rejected' },
    { date: '12/05/26', category: 'Supplier C', revenue: '600', cost: 'Supplier C', profit: 'Supplier C', status: 'Pending' },
    { date: '12/06/26', category: 'Order D', revenue: '720', cost: 'Order D', profit: 'Order D', status: 'Approved' },
  ]

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.1"
        title="Báo cáo quản trị"
        subtitle="Tổng quan kết quả kinh doanh cho ban điều hành."
      />

      <FilterBar>
        <Field label="Report Type">
          <Select value="management" onChange={() => {}}><option value="management">Select report</option></Select>
        </Field>
        <Field label="Date Range">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="3m">3 tháng gần nhất</option>
            <option value="6m">6 tháng gần nhất</option>
          </Select>
        </Field>
        <Field label="Filter"><Input placeholder="Branch/category" /></Field>
        <Field label="Export"><Select value="pdf" onChange={() => {}}><option value="pdf">PDF / Excel</option></Select></Field>
        <div className="flex gap-3"><Button>Apply</Button><Button variant="secondary">Reset</Button></div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu tháng" value={formatCurrency(revenueVnd, { compact: true })} icon={DollarSign} tone="green" delta={growth} hint="so với tháng trước" />
        <StatCard label="Lợi nhuận" value={formatCurrency(profitVnd, { compact: true })} icon={Wallet} tone="brand" delta={9} hint="ước tính 22%" />
        <StatCard label="Tăng trưởng" value={`${growth}%`} icon={TrendingUp} tone={growth >= 0 ? 'blue' : 'red'} hint="theo tháng" />
        <StatCard label="Đơn hàng" value={formatNumber(4820)} icon={ShoppingCart} tone="violet" delta={6} hint="trong tháng" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Trend Summary" subtitle="Triệu đồng" icon={BarChart3} />
          <CardBody>
            <Bars
              data={monthly}
              x="month"
              series={[
                { key: 'revenue', name: 'Doanh thu', color: '#111111' },
                { key: 'target', name: 'Mục tiêu', color: '#999999' },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Report Detail" icon={PieChart} />
          <CardBody className="p-0">
            <DataTable
              rows={reportDetails}
              stt={false}
              dense
              columns={[
                { key: 'date', header: 'Date' },
                { key: 'category', header: 'Category' },
                { key: 'revenue', header: 'Revenue' },
                { key: 'cost', header: 'Cost' },
                { key: 'profit', header: 'Profit' },
                { key: 'status', header: 'Status' },
              ]}
            />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 flex gap-3"><Button>Generate</Button><Button variant="secondary">Export</Button></div>
    </div>
  )
}
