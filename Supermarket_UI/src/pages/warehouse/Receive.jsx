import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { goodsReceiptService, productService, purchaseOrderService, toList, withFallback } from '../../services/index.js'
import { ClipboardCheck, RotateCcw, Search, Send, X } from 'lucide-react'

const emptyFilters = { search: '', status: '', dateFrom: '', dateTo: '', type: '' }
const emptyForm = { poCode: '', productCode: '', quantity: 1, condition: 'Good', expiry: '' }
const today = () => new Date().toISOString().slice(0, 10)

export default function Receive() {
  const toast = useToast()
  const [receipts, setReceipts] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [receiptResult, orderResult, productResult] = await Promise.all([
        withFallback(() => goodsReceiptService.list()),
        withFallback(() => purchaseOrderService.list()),
        withFallback(() => productService.list()),
      ])
      const orderRows = toList(orderResult.data)
      const productRows = toList(productResult.data)
      let receiptRows = toList(receiptResult.data)
      if (!receiptRows.length) {
        receiptRows = orderRows.slice(0, 6).map((order, index) => ({
          id: `GR-${String(index + 1).padStart(3, '0')}`, code: `GR-${String(index + 1).padStart(3, '0')}`,
          poCode: order.code, product: productRows[index % Math.max(productRows.length, 1)]?.name || 'Product item',
          quantity: order.items || 1, receiveDate: order.orderDate, condition: index % 4 ? 'Good' : 'Inspection',
          status: order.status === 'Received' ? 'Completed' : index % 3 ? 'Waiting' : 'Draft', supplier: order.supplier,
        }))
      }
      setReceipts(receiptRows)
      setOrders(orderRows)
      setProducts(productRows)
      setSource(receiptResult.source)
      setLoading(false)
    }
    load()
  }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return receipts.filter((row) => (!query || [row.code, row.poCode, row.product, row.supplier].some((value) => String(value || '').toLowerCase().includes(query)))
      && (!applied.status || row.status === applied.status)
      && (!applied.type || row.condition === applied.type)
      && (!applied.dateFrom || (row.receiveDate || '') >= applied.dateFrom)
      && (!applied.dateTo || (row.receiveDate || '') <= applied.dateTo))
  }, [applied, receipts])
  const selectedOrder = orders.find((order) => order.code === form.poCode)
  const selectedProduct = products.find((product) => String(product.code || product.id) === form.productCode)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const resetFilters = () => { setFilters(emptyFilters); setApplied(emptyFilters) }

  const submit = async () => {
    if (!selectedOrder || !selectedProduct || Number(form.quantity) < 1) return toast.error('Purchase order, product, and received quantity are required.')
    const code = `GR-${Date.now().toString().slice(-7)}`
    const payload = {
      code, poCode: selectedOrder.code, supplier: selectedOrder.supplier, receiveDate: today(), receivedBy: 'Warehouse Staff',
      items: Number(form.quantity), total: Number(selectedProduct.cost || selectedProduct.price || 0) * Number(form.quantity),
      productCode: selectedProduct.code, productName: selectedProduct.name, quantity: Number(form.quantity),
      productCondition: form.condition, expiry: form.expiry || null, note: form.note || null,
    }
    setSaving(true)
    try {
      const response = await goodsReceiptService.create(payload)
      setReceipts((current) => [{ ...response, product: selectedProduct.name, quantity: Number(form.quantity), condition: form.condition, expiry: form.expiry, status: response.status || 'Pending' }, ...current])
      setForm(emptyForm)
      toast.success('Goods receipt submitted for approval.')
    } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }

  return <div>
    <PageHeader breadcrumb="Warehouse Operations · 3.7.1" title="Receive Goods" subtitle="Record received products and submit the receipt for warehouse approval." />
    <FilterBar className="mb-6">
      <Field label="Search" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Receipt / PO / product" value={filters.search} onChange={(event) => setFilter('search', event.target.value)} /></div></Field>
      <Field label="Status"><Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All</option>{['Draft', 'Pending', 'Waiting', 'Completed', 'Rejected'].map((status) => <option key={status}>{status}</option>)}</Select></Field>
      <Field label="Date" className="grow"><div className="grid grid-cols-2 gap-2"><Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} /><Input type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(event) => setFilter('dateTo', event.target.value)} /></div></Field>
      <Field label="Type"><Select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}><option value="">All</option><option>Good</option><option>Damaged</option><option>Inspection</option></Select></Field>
      <div className="flex !basis-auto !grow-0 gap-2"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button></div>
    </FilterBar>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-5">
      <section className="min-w-0 xl:col-span-3"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Goods Receipt Drafts</h2><p className="text-xs text-slate-500">Recent receiving records and their approval status.</p></div><Badge tone="slate">{rows.length} receipts</Badge></div><DataTable dense rows={rows} empty={{ title: 'No goods receipts found' }} columns={[
        { key: 'code', header: 'Receipt ID', render: (row) => <span className="font-mono text-xs font-semibold">{row.code}</span> }, { key: 'poCode', header: 'PO' },
        { key: 'product', header: 'Product', render: (row) => row.product || row.note?.match(/Product: ([^;]+)/)?.[1] || `${row.items || 0} item(s)` },
        { key: 'quantity', header: 'Qty', render: (row) => row.quantity ?? row.items ?? 0 }, { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      ]} /></section>
      <Card className="xl:col-span-2"><CardHeader title="Goods Receipt Form" subtitle="Enter actual delivery information" icon={ClipboardCheck} /><CardBody className="flex min-h-[24rem] flex-col">
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Purchase Order" required><Select value={form.poCode} onChange={(event) => setField('poCode', event.target.value)}><option value="">Select PO</option>{orders.map((order) => <option key={order.id || order.code} value={order.code}>{order.code}</option>)}</Select></Field><Field label="Product" required><Select value={form.productCode} onChange={(event) => setField('productCode', event.target.value)}><option value="">Select product</option>{products.map((product) => <option key={product.id || product.code} value={product.code || product.id}>{product.name}</option>)}</Select></Field><Field label="Received Quantity" required><Input type="number" min="1" value={form.quantity} onChange={(event) => setField('quantity', event.target.value)} /></Field><Field label="Product Condition"><Select value={form.condition} onChange={(event) => setField('condition', event.target.value)}><option>Good</option><option>Damaged</option><option>Inspection</option></Select></Field><Field label="Expiration Date" className="sm:col-span-2"><Input type="date" value={form.expiry} onChange={(event) => setField('expiry', event.target.value)} /></Field></div>
        <div className="mt-auto flex gap-2 border-t border-slate-100 pt-5"><Button icon={Send} onClick={submit} loading={saving}>Submit</Button><Button variant="secondary" icon={X} onClick={() => setForm(emptyForm)}>Cancel</Button></div>
      </CardBody></Card>
    </div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.7.1 Receive Goods · received quantity, product condition, and expiry are retained in the receipt audit note</div>}
  </div>
}
