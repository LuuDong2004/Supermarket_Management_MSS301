import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { formatDate, formatNumber } from '../../lib/format.js'
import { inventoryService, productService, stockAdjustmentService, toList, withFallback } from '../../services/index.js'
import { AlertTriangle, Boxes, Clock, ClipboardList, RotateCcw, Search } from 'lucide-react'

const emptyFilters = { search: '', category: '', risk: '', location: '' }
const isLow = (row) => Number(row.onHand ?? row.stock ?? 0) <= Number(row.threshold ?? 10)
const isExpiring = (row) => {
  if (!row.expiry) return false
  const days = (new Date(row.expiry) - new Date()) / 86400000
  return days >= 0 && days <= 45
}
const riskOf = (row) => isLow(row) && isExpiring(row) ? 'Low & Expiring' : isLow(row) ? 'Low Stock' : isExpiring(row) ? 'Expiring Soon' : 'Normal'
const riskTone = (risk) => risk === 'Normal' ? 'green' : risk === 'Low & Expiring' ? 'red' : 'amber'

export default function Monitor() {
  const [inventory, setInventory] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [selected, setSelected] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [inventoryResult, productResult, adjustmentResult] = await Promise.all([
        withFallback(() => inventoryService.list()),
        withFallback(() => productService.list()),
        withFallback(() => stockAdjustmentService.list()),
      ])
      const products = toList(productResult.data)
      const rows = toList(inventoryResult.data).map((item) => {
        const product = products.find((candidate) => candidate.code === item.productCode || candidate.code === item.code || candidate.name === item.name) || {}
        return { ...product, ...item, expiry: item.expiry || product.expiry, category: item.category || product.category, onHand: item.onHand ?? item.stock ?? product.stock }
      })
      setInventory(rows)
      setAdjustments(toList(adjustmentResult.data))
      setSelected(rows.find((row) => riskOf(row) !== 'Normal') || rows[0] || null)
      setLoading(false)
    }
    load()
  }, [])

  const categories = useMemo(() => [...new Set(inventory.map((row) => row.category).filter(Boolean))], [inventory])
  const locations = useMemo(() => [...new Set(inventory.map((row) => row.location).filter(Boolean))], [inventory])
  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return inventory.filter((row) => (!query || [row.code, row.productCode, row.name, row.barcode].some((value) => String(value || '').toLowerCase().includes(query)))
      && (!applied.category || row.category === applied.category)
      && (!applied.risk || riskOf(row) === applied.risk || (applied.risk === 'RISK' && riskOf(row) !== 'Normal'))
      && (!applied.location || row.location === applied.location))
  }, [applied, inventory])
  const lowCount = inventory.filter(isLow).length
  const expiringCount = inventory.filter(isExpiring).length
  const pendingAdjustments = adjustments.filter((row) => String(row.status || '').toLowerCase().includes('pending') || String(row.status || '').toLowerCase().includes('chờ')).length
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const resetFilters = () => { setFilters(emptyFilters); setApplied(emptyFilters) }

  return <div>
    <PageHeader breadcrumb="Warehouse Management · 3.6.3" title="Monitor Inventory, Low Stock, and Expiring Products" subtitle="Identify inventory risks and recommended warehouse actions." />
    <FilterBar className="mb-6">
      <Field label="Product Search" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Barcode / SKU" value={filters.search} onChange={(event) => setFilter('search', event.target.value)} /></div></Field>
      <Field label="Category"><Select value={filters.category} onChange={(event) => setFilter('category', event.target.value)}><option value="">All</option>{categories.map((category) => <option key={category}>{category}</option>)}</Select></Field>
      <Field label="Risk Status"><Select value={filters.risk} onChange={(event) => setFilter('risk', event.target.value)}><option value="">All</option><option value="RISK">Low / Expiring</option><option value="Low Stock">Low Stock</option><option value="Expiring Soon">Expiring Soon</option><option value="Normal">Normal</option></Select></Field>
      <Field label="Location"><Select value={filters.location} onChange={(event) => setFilter('location', event.target.value)}><option value="">Warehouse</option>{locations.map((location) => <option key={location}>{location}</option>)}</Select></Field>
      <div className="flex !basis-auto !grow-0 gap-2"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button></div>
    </FilterBar>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Low Stock" value={formatNumber(lowCount)} icon={AlertTriangle} tone="amber" /><StatCard label="Expiring Soon" value={formatNumber(expiringCount)} icon={Clock} tone="red" /><StatCard label="Total SKU" value={formatNumber(inventory.length)} icon={Boxes} tone="brand" /><StatCard label="Pending Adjustments" value={formatNumber(pendingAdjustments)} icon={ClipboardList} tone="blue" /></div>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-5">
      <section className="min-w-0 xl:col-span-3"><div className="mb-3 flex justify-between"><div><h2 className="font-bold text-slate-900">Inventory Risk List</h2><p className="text-xs text-slate-500">Select a product to inspect its risk detail.</p></div><Badge tone="slate">{rows.length} items</Badge></div><DataTable dense rows={rows} onRowClick={setSelected} empty={{ title: 'No inventory risks found' }} columns={[
        { key: 'code', header: 'SKU', render: (row) => <span className="font-mono text-xs font-semibold">{row.productCode || row.code}</span> }, { key: 'name', header: 'Product' },
        { key: 'onHand', header: 'Stock', render: (row) => formatNumber(row.onHand) }, { key: 'threshold', header: 'Threshold' },
        { key: 'expiry', header: 'Expiry', render: (row) => formatDate(row.expiry) }, { key: 'risk', header: 'Risk', render: (row) => <Badge tone={riskTone(riskOf(row))}>{riskOf(row)}</Badge> },
      ]} /></section>
      <Card className="xl:col-span-2"><CardHeader title="Product Inventory Detail" subtitle={selected?.name || 'Select a product'} icon={Boxes} /><CardBody className="min-h-[18rem] space-y-3 text-sm text-slate-600">{selected ? <><p><b className="text-slate-800">Batch:</b> {selected.batch || selected.code || 'Not available'}</p><p><b className="text-slate-800">Location:</b> {selected.location || 'Warehouse'}</p><p><b className="text-slate-800">Stock:</b> {formatNumber(selected.onHand)} {selected.unit || 'units'} · threshold {formatNumber(selected.threshold)}</p><p><b className="text-slate-800">Expiry:</b> {formatDate(selected.expiry)}</p><p><b className="text-slate-800">Risk:</b> <Badge tone={riskTone(riskOf(selected))}>{riskOf(selected)}</Badge></p><div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800"><b>Recommended action:</b> {isLow(selected) ? 'create a purchase order or adjust stock.' : isExpiring(selected) ? 'prioritize sale or transfer stock.' : 'continue routine monitoring.'}</div></> : <p>Select a product from the list.</p>}</CardBody></Card>
    </div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.6.3 Inventory Monitoring · low-stock and expiry risks are calculated from live inventory data</div>}
  </div>
}
