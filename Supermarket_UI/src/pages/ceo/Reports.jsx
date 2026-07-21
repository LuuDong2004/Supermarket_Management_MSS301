import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, CardHeader, Field, Input, Select, Button, Badge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import {
  mockProducts,
  mockSalesTrend,
  productService,
  reportService,
  toList,
  withFallback,
} from '../../services/index.js'
import {
  BarChart3,
  Boxes,
  DollarSign,
  FileDown,
  ReceiptText,
  RefreshCw,
  TableProperties,
  Wallet,
} from 'lucide-react'

const DEMO_TREND = [
  { label: '06 Jun', revenue: 42 },
  { label: '07 Jun', revenue: 58 },
  { label: '08 Jun', revenue: 49 },
  { label: '09 Jun', revenue: 73 },
  { label: '10 Jun', revenue: 61 },
  { label: '11 Jun', revenue: 82 },
  { label: '12 Jun', revenue: 128.4 },
]

const DEMO_DETAILS = [
  { id: 'R-01', date: '12/01/26', category: 'Milk', revenue: 120, cost: 'Milk', profit: 'Milk', status: 'Pending' },
  { id: 'R-02', date: '12/02/26', category: 'Rice', revenue: 240, cost: 'Rice', profit: 'Rice', status: 'Approved' },
  { id: 'R-03', date: '12/03/26', category: 'Staff A', revenue: 360, cost: 'Staff A', profit: 'Staff A', status: 'Active' },
  { id: 'R-04', date: '12/04/26', category: 'Customer B', revenue: 480, cost: 'Customer B', profit: 'Customer B', status: 'Rejected' },
  { id: 'R-05', date: '12/05/26', category: 'Supplier C', revenue: 600, cost: 'Supplier C', profit: 'Supplier C', status: 'Pending' },
  { id: 'R-06', date: '12/06/26', category: 'Order D', revenue: 720, cost: 'Order D', profit: 'Order D', status: 'Approved' },
]

function millions(value) {
  const number = Number(value || 0)
  const inMillions = Math.abs(number) >= 1_000_000 ? number / 1_000_000 : number
  return `${inMillions.toLocaleString('en-US', { maximumFractionDigits: 1 })}M`
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export default function Reports() {
  const [reportType, setReportType] = useState('management')
  const [dateFrom, setDateFrom] = useState('2026-06-06')
  const [dateTo, setDateTo] = useState('2026-06-12')
  const [filter, setFilter] = useState('')
  const [appliedFilter, setAppliedFilter] = useState('')
  const [exportType, setExportType] = useState('excel')
  const [trend, setTrend] = useState([])
  const [financial, setFinancial] = useState([])
  const [products, setProducts] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [sources, setSources] = useState({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [trendResult, financialResult, productResult, dashboardResult] = await Promise.all([
      withFallback(() => reportService.salesTrend(), mockSalesTrend),
      withFallback(() => reportService.financial()),
      withFallback(() => productService.list({ size: 200 }), mockProducts),
      withFallback(() => reportService.dashboard()),
    ])

    setTrend(toList(trendResult.data))
    setFinancial(toList(financialResult.data))
    setProducts(toList(productResult.data))
    setDashboard(dashboardResult.data && !Array.isArray(dashboardResult.data) ? dashboardResult.data : {})
    setSources({
      trend: trendResult.source,
      financial: financialResult.source,
      products: productResult.source,
      dashboard: dashboardResult.source,
    })
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const trendRows = useMemo(() => {
    if (sources.trend !== 'backend') return DEMO_TREND
    return trend.slice(-7).map((row, index) => ({
      ...row,
      label: row.label || row.day || row.date || `Day ${index + 1}`,
      revenue: Number(row.revenue ?? row.sales ?? row.value ?? 0),
    }))
  }, [sources.trend, trend])

  const reportDetails = useMemo(() => {
    if (sources.financial !== 'backend' || financial.length === 0) return DEMO_DETAILS
    return financial.slice(-6).map((row, index) => ({
      id: row.id || row.month || `R-${index + 1}`,
      date: row.month || `Period ${index + 1}`,
      category: 'All Categories',
      revenue: Number(row.revenue || 0),
      cost: Number(row.cost || 0),
      profit: Number(row.grossProfit ?? row.netProfit ?? 0),
      status: 'Approved',
    }))
  }, [financial, sources.financial])

  const visibleDetails = useMemo(() => {
    const query = appliedFilter.trim().toLowerCase()
    if (!query) return reportDetails
    return reportDetails.filter((row) =>
      [row.date, row.category, row.revenue, row.cost, row.profit, row.status]
        .some((value) => String(value ?? '').toLowerCase().includes(query)))
  }, [appliedFilter, reportDetails])

  const totalSales = sources.dashboard === 'backend' && Number(dashboard.todayRevenue) > 0
    ? Number(dashboard.todayRevenue)
    : 128_400_000
  const transactions = sources.dashboard === 'backend' && Number.isFinite(Number(dashboard.todayOrders))
    ? Number(dashboard.todayOrders)
    : 1248
  const grossProfit = sources.dashboard === 'backend' ? totalSales * 0.223 : 28_600_000
  const inventoryValue = sources.products === 'backend'
    ? products.reduce((sum, product) => sum + Number(product.cost || 0) * Number(product.stock || 0), 0)
    : 412_000_000

  const resetFilters = () => {
    setReportType('management')
    setDateFrom('2026-06-06')
    setDateTo('2026-06-12')
    setFilter('')
    setAppliedFilter('')
    setExportType('excel')
  }

  const exportReport = () => {
    if (exportType === 'pdf') {
      window.print()
      return
    }

    const rows = [
      ['Date', 'Category', 'Revenue', 'Cost', 'Profit', 'Status'],
      ...visibleDetails.map((row) => [row.date, row.category, row.revenue, row.cost, row.profit, row.status]),
    ]
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `management-report_${dateFrom}_${dateTo}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Executive · 3.3.1"
        title="View Management Reports"
        subtitle="Generate and review management reports for executive decision-making."
      />

      <FilterBar>
        <Field label="Report Type">
          <Select value={reportType} onChange={(event) => setReportType(event.target.value)}>
            <option value="management">Management Report</option>
            <option value="financial">Financial Report</option>
            <option value="operational">Operational Report</option>
          </Select>
        </Field>
        <Field label="Date Range" className="sm:min-w-[19rem]">
          <div className="grid grid-cols-2 gap-2">
            <Input aria-label="From date" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            <Input aria-label="To date" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </div>
        </Field>
        <Field label="Filter" className="grow">
          <Input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Branch / category" />
        </Field>
        <Field label="Export">
          <Select value={exportType} onChange={(event) => setExportType(event.target.value)}>
            <option value="excel">Excel / CSV</option>
            <option value="pdf">PDF / Print</option>
          </Select>
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => setAppliedFilter(filter)}>Apply</Button>
          <Button variant="secondary" onClick={resetFilters}>Reset</Button>
        </div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={millions(totalSales)} icon={DollarSign} tone="green" hint="selected period" />
        <StatCard label="Transactions" value={transactions.toLocaleString('en-US')} icon={ReceiptText} tone="brand" hint="completed sales" />
        <StatCard label="Gross Profit" value={millions(grossProfit)} icon={Wallet} tone="violet" hint="estimated margin" />
        <StatCard label="Inventory Value" value={millions(inventoryValue)} icon={Boxes} tone="blue" hint="current stock value" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card className="min-w-0">
            <CardHeader title="Trend Summary" subtitle="Revenue · million VND" icon={BarChart3} />
            <CardBody>
              <Bars
                data={trendRows}
                x="label"
                height={285}
                series={[{ key: 'revenue', name: 'Revenue', color: '#059669' }]}
              />
            </CardBody>
          </Card>

          <Card className="min-w-0">
            <CardHeader title="Report Detail" subtitle={`${visibleDetails.length} report rows`} icon={TableProperties} />
            <CardBody className="p-0">
              <DataTable
                className="rounded-none border-0 shadow-none"
                dense
                rows={visibleDetails}
                rowKey="id"
                empty={{ title: 'No report rows found', subtitle: 'Reset the filter or generate another report.' }}
                columns={[
                  { key: 'date', header: 'Date' },
                  { key: 'category', header: 'Category' },
                  { key: 'revenue', header: 'Revenue', align: 'right' },
                  { key: 'cost', header: 'Cost', align: 'right' },
                  { key: 'profit', header: 'Profit', align: 'right' },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (row) => <Badge tone={row.status === 'Approved' || row.status === 'Active' ? 'green' : row.status === 'Rejected' ? 'red' : 'amber'} dot>{row.status}</Badge>,
                  },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button icon={RefreshCw} loading={loading} onClick={load}>Generate</Button>
        <Button variant="secondary" icon={FileDown} onClick={exportReport}>Export</Button>
      </div>
    </div>
  )
}
