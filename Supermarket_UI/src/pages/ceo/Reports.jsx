import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, CardHeader, Field, Input, Select, Button, Badge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import {
  productService, reportService, toList, withFallback } from '../../services/index.js'
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
      withFallback(() => reportService.salesTrend()),
      withFallback(() => reportService.financial()),
      withFallback(() => productService.list({ size: 200 })),
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
    return trend.slice(-7).map((row, index) => ({
      ...row,
      label: row.label || row.day || row.date || `Day ${index + 1}`,
      revenue: Number(row.revenue ?? row.sales ?? row.value ?? 0),
    }))
  }, [sources.trend, trend])

  const reportDetails = useMemo(() => {
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

  const totalSales = Number(dashboard.todayRevenue || 0)
  const transactions = Number(dashboard.todayOrders || 0)
  const grossProfit = financial.length
    ? Number(financial.at(-1)?.grossProfit || 0) * 1_000_000
    : 0
  const inventoryValue = products.reduce((sum, product) => sum + Number(product.cost || 0) * Number(product.stock || 0), 0)

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
