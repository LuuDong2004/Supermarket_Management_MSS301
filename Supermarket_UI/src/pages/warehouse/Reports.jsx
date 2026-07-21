import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatDate, formatNumber } from '../../lib/format.js'
import { productService, toList, warehouseTxnService, withFallback } from '../../services/index.js'
import { Boxes, FileBarChart, FileSpreadsheet, PackageCheck, RotateCcw, Wallet } from 'lucide-react'

const initialFilters = { reportType: 'Inventory Movement', from: '', to: '', group: '', exportType: 'CSV' }
const statusTone = (status = '') => status.toLowerCase().includes('approved') || status.toLowerCase().includes('duyệt') ? 'green' : status.toLowerCase().includes('reject') || status.toLowerCase().includes('từ') ? 'red' : 'amber'

export default function Reports() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [applied, setApplied] = useState(initialFilters)
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async () => {
    setLoading(true)
    const [productResult, transactionResult] = await Promise.all([withFallback(() => productService.list()), withFallback(() => warehouseTxnService.list())])
    setProducts(toList(productResult.data)); setTransactions(toList(transactionResult.data)); setLoading(false)
  })() }, [])

  const groups = useMemo(() => [...new Set(products.map((row) => row.category).filter(Boolean))], [products])
  const rows = useMemo(() => transactions.filter((row) => (!applied.from || row.txnDate >= applied.from) && (!applied.to || row.txnDate <= applied.to) && (!applied.group || String(row.product || '').toLowerCase().includes(applied.group.toLowerCase()))), [applied, transactions])
  const inventoryValue = products.reduce((sum, row) => sum + Number(row.cost || row.price || 0) * Number(row.stock || 0), 0)
  const totalUnits = products.reduce((sum, row) => sum + Number(row.stock || 0), 0)
  const trend = useMemo(() => {
    const grouped = {}
    rows.forEach((row) => { const key = row.txnDate || 'Unknown'; grouped[key] = (grouped[key] || 0) + Math.abs(Number(row.qty || 0)) })
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).slice(-7).map(([date, quantity]) => ({ date: date.slice(5), quantity }))
  }, [rows])
  const setField = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const reset = () => { setFilters(initialFilters); setApplied(initialFilters) }
  const exportReport = () => {
    const header = ['Date', 'Category', 'Revenue', 'Cost', 'Profit', 'Status']
    const data = rows.map((row) => [row.txnDate, row.type, Math.abs(Number(row.qty || 0)), row.product, row.ref, row.status])
    const csv = [header, ...data].map((line) => line.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'warehouse-report.csv'; anchor.click(); URL.revokeObjectURL(url)
    toast.success('Warehouse report exported.')
  }

  return <div>
    <PageHeader breadcrumb="Warehouse Management · 3.6.4" title="View Warehouse Reports" subtitle="Generate warehouse performance and inventory movement reports." />
    <FilterBar className="mb-6">
      <Field label="Report Type"><Select value={filters.reportType} onChange={(event) => setField('reportType', event.target.value)}><option>Inventory Movement</option><option>Stock Valuation</option><option>Inventory Risk</option></Select></Field>
      <Field label="Date Range" className="grow"><div className="grid grid-cols-2 gap-2"><Input type="date" value={filters.from} onChange={(event) => setField('from', event.target.value)} placeholder="From" /><Input type="date" value={filters.to} onChange={(event) => setField('to', event.target.value)} placeholder="To" min={filters.from || undefined} /></div></Field>
      <Field label="Filter"><Select value={filters.group} onChange={(event) => setField('group', event.target.value)}><option value="">Branch/category</option>{groups.map((group) => <option key={group}>{group}</option>)}</Select></Field>
      <Field label="Export"><Select value={filters.exportType} onChange={(event) => setField('exportType', event.target.value)}><option>CSV</option><option>PDF / Excel</option></Select></Field>
      <div className="flex !basis-auto !grow-0 gap-2"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={reset}>Reset</Button></div>
    </FilterBar>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Units" value={formatNumber(totalUnits)} icon={Boxes} tone="brand" /><StatCard label="Transactions" value={formatNumber(rows.length)} icon={PackageCheck} tone="blue" /><StatCard label="Approved Movements" value={formatNumber(rows.filter((row) => statusTone(row.status) === 'green').length)} icon={FileBarChart} tone="green" /><StatCard label="Inventory Value" value={formatCurrency(inventoryValue)} icon={Wallet} tone="violet" /></div>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-2">
      <Card><CardHeader title="Trend Summary" subtitle="Warehouse movements by day" icon={FileBarChart} /><CardBody><Bars data={trend} x="date" series={[{ key: 'quantity', name: 'Quantity', color: '#111111' }]} /></CardBody></Card>
      <section className="min-w-0"><div className="mb-3 flex justify-between"><h2 className="font-bold text-slate-900">Report Detail</h2><Badge tone="slate">{rows.length} rows</Badge></div><DataTable dense rows={rows} empty={{ title: 'No report data found' }} columns={[
        { key: 'txnDate', header: 'Date', render: (row) => formatDate(row.txnDate) }, { key: 'type', header: 'Category' },
        { key: 'qty', header: 'Revenue', render: (row) => formatNumber(Math.abs(row.qty)) }, { key: 'product', header: 'Cost' },
        { key: 'ref', header: 'Profit' }, { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
      ]} /></section>
    </div>}
    {!loading && <div className="mt-6 flex gap-2"><Button icon={FileBarChart} onClick={() => setApplied(filters)}>Generate</Button><Button variant="secondary" icon={FileSpreadsheet} onClick={exportReport}>Export</Button></div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.6.4 Warehouse Reports · report values are generated from product and transaction data</div>}
  </div>
}
