import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatCurrency, formatDate, isoDate } from '../../lib/format.js'
import { mockPurchaseOrders, mockSuppliers, purchaseOrderService, supplierService, toList, withFallback } from '../../services/index.js'
import { ClipboardList, RotateCcw, Search, Send, X } from 'lucide-react'

const emptyFilters = { search: '', status: '', type: '', dateFrom: '', dateTo: '' }
const emptyForm = { code: '', supplier: '', items: 1, expectedDelivery: '', status: 'Draft', total: 0 }

export default function PurchaseOrders() {
  const toast = useToast()
  const confirm = useConfirm()
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const [ordersResult, suppliersResult] = await Promise.all([
      withFallback(() => purchaseOrderService.list(), mockPurchaseOrders),
      withFallback(() => supplierService.list(), mockSuppliers),
    ])
    setOrders(toList(ordersResult.data))
    setSuppliers(toList(suppliersResult.data))
    setSource(ordersResult.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return orders.filter((order) => {
      const expected = order.expectedDelivery || order.orderDate || ''
      return (!query || [order.code, order.supplier].some((value) => String(value || '').toLowerCase().includes(query)))
        && (!applied.status || order.status === applied.status)
        && (!applied.type || order.supplier === applied.type)
        && (!applied.dateFrom || expected >= applied.dateFrom)
        && (!applied.dateTo || expected <= applied.dateTo)
    })
  }, [applied, orders])

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const selectOrder = (order) => {
    setSelected(order)
    setForm({
      code: order.code || '', supplier: order.supplier || '', items: order.items ?? 1,
      expectedDelivery: order.expectedDelivery || order.orderDate || '', status: order.status || 'Draft', total: order.total ?? 0,
    })
  }
  const resetFilters = () => { setFilters(emptyFilters); setApplied(emptyFilters) }
  const cancelForm = () => { setSelected(null); setForm(emptyForm) }

  const submit = async () => {
    if (!form.supplier || !form.expectedDelivery || Number(form.items) < 1) return toast.error('Supplier, product items, and expected delivery date are required.')
    const accepted = await confirm({
      title: selected ? 'Update purchase order?' : 'Create purchase order?',
      message: selected ? `Save changes to ${form.code}?` : `Create a purchase order for ${form.supplier}?`,
      confirmLabel: 'Submit',
    })
    if (!accepted) return
    const payload = {
      code: form.code || `PO-${Date.now().toString().slice(-8)}`,
      supplier: form.supplier,
      orderDate: selected?.orderDate || isoDate(),
      items: Number(form.items),
      total: Number(form.total || 0),
      status: form.status,
      approval: selected?.approval || (form.status === 'Draft' ? 'Pending' : form.status),
      expectedDelivery: form.expectedDelivery,
    }
    setSaving(true)
    try {
      let saved
      if (source === 'backend') saved = selected ? await purchaseOrderService.update(selected.id, payload) : await purchaseOrderService.create(payload)
      else saved = { id: selected?.id || payload.code, ...payload }
      setOrders((current) => selected ? current.map((order) => order.id === selected.id ? saved : order) : [saved, ...current])
      cancelForm()
      toast.success(selected ? 'Purchase order updated.' : 'Purchase order created.')
    } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader breadcrumb="Warehouse Management · 3.6.1" title="Manage Purchase Order" subtitle="Create purchase orders and track supplier delivery status." />
      <FilterBar className="mb-6">
        <Field label="Search" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Keyword" value={filters.search} onChange={(event) => setFilter('search', event.target.value)} onKeyDown={(event) => event.key === 'Enter' && setApplied(filters)} /></div></Field>
        <Field label="Status"><Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All</option>{['Draft', 'Pending', 'Approved', 'Received', 'Rejected'].map((status) => <option key={status}>{status}</option>)}</Select></Field>
        <Field label="Date" className="grow"><div className="grid grid-cols-2 gap-2"><Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} placeholder="From" /><Input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} placeholder="To" min={filters.dateFrom || undefined} /></div></Field>
        <Field label="Type"><Select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}><option value="">All</option>{suppliers.map((supplier) => <option key={supplier.id || supplier.code} value={supplier.name}>{supplier.name}</option>)}</Select></Field>
        <div className="flex !basis-auto !grow-0 gap-2"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button></div>
      </FilterBar>

      {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : (
        <div className="grid items-start gap-6 xl:grid-cols-5">
          <section className="min-w-0 xl:col-span-3">
            <div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Purchase Order List</h2><p className="text-xs text-slate-500">Select an order to edit its details.</p></div><Badge tone="slate">{rows.length} orders</Badge></div>
            <DataTable dense rows={rows} onRowClick={selectOrder} empty={{ title: 'No purchase orders found' }} columns={[
              { key: 'code', header: 'PO No', render: (order) => <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold"><span className={`h-2 w-2 rounded-full ${selected?.id === order.id ? 'bg-brand-500' : 'bg-slate-200'}`} />{order.code}</span> },
              { key: 'supplier', header: 'Supplier' },
              { key: 'expectedDelivery', header: 'Expected Date', render: (order) => formatDate(order.expectedDelivery || order.orderDate) },
              { key: 'total', header: 'Total', render: (order) => formatCurrency(order.total) },
              { key: 'status', header: 'Status', render: (order) => <StatusBadge status={order.status} /> },
            ]} />
          </section>
          <Card className="xl:col-span-2"><CardHeader title="Purchase Order Detail" subtitle={selected ? form.code : 'Create a new purchase order'} icon={ClipboardList} /><CardBody className="flex min-h-[22rem] flex-col">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="PO Number"><Input value={form.code || 'Auto'} readOnly /></Field><Field label="Supplier" required><Select value={form.supplier} onChange={(event) => setField('supplier', event.target.value)}><option value="">Select</option>{suppliers.map((supplier) => <option key={supplier.id || supplier.code} value={supplier.name}>{supplier.name}</option>)}</Select></Field><Field label="Product Items" required><Input type="number" min="1" value={form.items} onChange={(event) => setField('items', event.target.value)} /></Field><Field label="Expected Delivery Date" required><Input type="date" value={form.expectedDelivery} onChange={(event) => setField('expectedDelivery', event.target.value)} /></Field><Field label="PO Status"><Select value={form.status} onChange={(event) => setField('status', event.target.value)}>{['Draft', 'Pending', 'Approved', 'Received', 'Rejected'].map((status) => <option key={status}>{status}</option>)}</Select></Field></div>
            <div className="mt-auto flex gap-2 border-t border-slate-100 pt-5"><Button icon={Send} onClick={submit} loading={saving}>Submit</Button><Button variant="secondary" icon={X} onClick={cancelForm}>Cancel</Button></div>
          </CardBody></Card>
        </div>
      )}
      {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.6.1 Manage Purchase Order · supplier and delivery information are retained with each order</div>}
    </div>
  )
}
