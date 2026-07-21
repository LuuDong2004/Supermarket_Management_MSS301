import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { inventoryService, mockInventory, mockProducts, mockStockCounts, productService, stockCountService, toList, withFallback } from '../../services/index.js'
import { ClipboardList, RotateCcw, Search, Send, X } from 'lucide-react'

const emptyFilters = { search: '', status: '', dateFrom: '', dateTo: '', type: '' }
const emptyForm = { productCode: '', physicalQty: '', reason: '' }
const today = () => new Date().toISOString().slice(0, 10)

export default function StockCount() {
  const toast = useToast()
  const [sessions, setSessions] = useState([])
  const [inventory, setInventory] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [countResult, inventoryResult, productResult] = await Promise.all([
        withFallback(() => stockCountService.list(), mockStockCounts), withFallback(() => inventoryService.list(), mockInventory), withFallback(() => productService.list(), mockProducts),
      ])
      const products = toList(productResult.data)
      const inventoryRows = toList(inventoryResult.data).map((item) => {
        const product = products.find((candidate) => candidate.id === item.id || candidate.code === item.productCode || candidate.barcode === item.sku || candidate.name === item.product) || {}
        return { ...product, ...item, code: item.productCode || item.code || item.sku || product.code || product.barcode, name: item.name || item.product || product.name, onHand: Number(item.onHand ?? item.stock ?? product.stock ?? 0), location: item.location || 'Main Warehouse' }
      })
      const saved = toList(countResult.data).flatMap((count) => {
        try { const detail = JSON.parse(count.note || '{}'); return detail.product ? [{ ...count, ...detail, session: count.code }] : [] } catch { return [] }
      })
      const draftRows = inventoryRows.slice(0, 8).map((item, index) => ({ id: `draft-${item.id || index}`, session: `SC-${String(index + 1).padStart(3, '0')}`, product: item.name, productCode: item.code, systemQty: item.onHand, physicalQty: '', difference: '', status: 'Pending', countDate: today(), type: item.category || 'General' }))
      setInventory(inventoryRows); setSessions(saved.length ? saved : draftRows); setSource(countResult.source); setLoading(false)
    }
    load()
  }, [])

  const selectedProduct = inventory.find((item) => item.code === form.productCode)
  const systemQty = Number(selectedProduct?.onHand || 0)
  const difference = form.physicalQty === '' ? '' : Number(form.physicalQty) - systemQty
  const rows = useMemo(() => { const query = applied.search.trim().toLowerCase(); return sessions.filter((row) => (!query || [row.session, row.product, row.productCode].some((value) => String(value || '').toLowerCase().includes(query))) && (!applied.status || row.status === applied.status) && (!applied.type || row.type === applied.type) && (!applied.dateFrom || (row.countDate || '') >= applied.dateFrom) && (!applied.dateTo || (row.countDate || '') <= applied.dateTo)) }, [applied, sessions])
  const types = useMemo(() => [...new Set(inventory.map((item) => item.category).filter(Boolean))], [inventory])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const resetFilters = () => { setFilters(emptyFilters); setApplied(emptyFilters) }

  const submit = async () => {
    if (!selectedProduct || form.physicalQty === '' || Number(form.physicalQty) < 0) return toast.error('Product and physical quantity are required.')
    if (difference !== 0 && !form.reason.trim()) return toast.error('Discrepancy reason is required when quantities do not match.')
    const code = `SC-${Date.now().toString().slice(-7)}`
    const detail = { product: selectedProduct.name, productCode: selectedProduct.code, systemQty, physicalQty: Number(form.physicalQty), difference, reason: form.reason, type: selectedProduct.category || 'General' }
    const payload = { code, location: selectedProduct.location || 'Main Warehouse', status: difference === 0 ? 'Completed' : 'Pending Adjustment', countDate: today(), note: JSON.stringify(detail) }
    setSaving(true)
    try {
      const response = source === 'backend' ? await stockCountService.create(payload) : { id: code, ...payload }
      setSessions((current) => [{ ...response, ...detail, session: code }, ...current])
      setForm(emptyForm)
      toast.success(difference === 0 ? 'Stock count completed.' : 'Stock discrepancy submitted for adjustment.')
    } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }

  return <div>
    <PageHeader breadcrumb="Warehouse Operations · 3.7.3" title="Conduct Stock Count" subtitle="Compare physical inventory with the system quantity and record discrepancies." />
    <FilterBar className="mb-6"><Field label="Search" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Session / product" value={filters.search} onChange={(event) => setFilter('search', event.target.value)} /></div></Field><Field label="Status"><Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All</option><option>Pending</option><option>Completed</option><option>Pending Adjustment</option></Select></Field><Field label="Date" className="grow"><div className="grid grid-cols-2 gap-2"><Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} /><Input type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(event) => setFilter('dateTo', event.target.value)} /></div></Field><Field label="Type"><Select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}><option value="">All</option>{types.map((type) => <option key={type}>{type}</option>)}</Select></Field><div className="flex !basis-auto !grow-0 gap-2"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button></div></FilterBar>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-5"><section className="min-w-0 xl:col-span-3"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Stock Count Sessions</h2><p className="text-xs text-slate-500">Count results and differences by product.</p></div><Badge tone="slate">{rows.length} sessions</Badge></div><DataTable dense rows={rows} empty={{ title: 'No stock count sessions found' }} columns={[
      { key: 'session', header: 'Session', render: (row) => <span className="font-mono text-xs font-semibold">{row.session || row.code}</span> }, { key: 'product', header: 'Product' }, { key: 'systemQty', header: 'System Qty' }, { key: 'physicalQty', header: 'Physical Qty', render: (row) => row.physicalQty === '' ? '—' : row.physicalQty }, { key: 'difference', header: 'Diff', render: (row) => row.difference === '' ? '—' : <Badge tone={Number(row.difference) === 0 ? 'green' : 'amber'}>{Number(row.difference) > 0 ? '+' : ''}{row.difference}</Badge> }, { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    ]} /></section><Card className="xl:col-span-2"><CardHeader title="Stock Count Form" subtitle="Record a physical product count" icon={ClipboardList} /><CardBody className="flex min-h-[24rem] flex-col"><div className="grid gap-4 sm:grid-cols-2"><Field label="Count Session"><Input value="Auto" readOnly /></Field><Field label="Product" required><Select value={form.productCode} onChange={(event) => setField('productCode', event.target.value)}><option value="">Search product</option>{inventory.map((item) => <option key={item.id || item.code} value={item.code}>{item.name}</option>)}</Select></Field><Field label="System Quantity"><Input value={selectedProduct ? systemQty : ''} readOnly placeholder="Select product" /></Field><Field label="Physical Quantity" required><Input type="number" min="0" value={form.physicalQty} onChange={(event) => setField('physicalQty', event.target.value)} /></Field><Field label="Difference"><Input value={difference} readOnly /></Field><Field label="Discrepancy Reason" required={difference !== '' && difference !== 0}><Input value={form.reason} onChange={(event) => setField('reason', event.target.value)} placeholder="Required if mismatch" /></Field></div><div className="mt-auto flex gap-2 border-t border-slate-100 pt-5"><Button icon={Send} onClick={submit} loading={saving}>Submit</Button><Button variant="secondary" icon={X} onClick={() => setForm(emptyForm)}>Cancel</Button></div></CardBody></Card></div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.7.3 Conduct Stock Count · mismatches require a reason and create a pending adjustment record</div>}
  </div>
}
