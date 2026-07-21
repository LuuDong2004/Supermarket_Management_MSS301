import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatCurrency } from '../../lib/format.js'
import { categoryService, productService, supplierService, toList, withFallback } from '../../services/index.js'
import { Info, PackagePlus, RotateCcw, Search } from 'lucide-react'

const emptyForm = { code: '', barcode: '', name: '', category: '', supplier: '', price: '', vat: '8', threshold: '10', status: 'ACTIVE' }

export default function Products() {
  const toast = useToast(); const confirm = useConfirm()
  const [products, setProducts] = useState([]); const [categories, setCategories] = useState([]); const [suppliers, setSuppliers] = useState([])
  const [selected, setSelected] = useState(null); const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState(''); const [category, setCategory] = useState(''); const [status, setStatus] = useState(''); const [applied, setApplied] = useState({ search: '', category: '', status: '' })
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const [productResult, categoryResult, supplierResult] = await Promise.all([
      withFallback(() => productService.list()), withFallback(() => categoryService.list()), withFallback(() => supplierService.list()),
    ])
    setProducts(toList(productResult.data).map((row) => ({ status: 'ACTIVE', ...row }))); setCategories(toList(categoryResult.data)); setSuppliers(toList(supplierResult.data)); setSource(productResult.source); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(() => { const query = applied.search.trim().toLowerCase(); return products.filter((row) => (!query || [row.code, row.barcode, row.name].some((value) => String(value || '').toLowerCase().includes(query))) && (!applied.category || row.category === applied.category) && (!applied.status || row.status === applied.status)) }, [applied, products])
  const selectProduct = (row) => { setSelected(row); setForm({ code: row.code || '', barcode: row.barcode || '', name: row.name || '', category: row.category || '', supplier: row.supplier || '', price: row.price ?? '', vat: row.vat ?? '8', threshold: row.threshold ?? '10', status: row.status || 'ACTIVE' }) }
  const resetForm = () => { setSelected(null); setForm(emptyForm) }
  const resetFilter = () => { setSearch(''); setCategory(''); setStatus(''); setApplied({ search: '', category: '', status: '' }) }

  const save = async () => {
    if (!form.code.trim() || !form.name.trim() || !form.category || form.price === '') return toast.error('SKU, product name, category, and price are required.')
    if (products.some((row) => row.id !== selected?.id && row.code === form.code.trim())) return toast.error('SKU must be unique.')
    const accepted = await confirm({ title: selected ? 'Update product?' : 'Create product?', message: `${selected ? 'Update' : 'Create'} ${form.name}?`, confirmLabel: 'Create/Update' }); if (!accepted) return
    const payload = { code: form.code.trim(), barcode: form.barcode.trim(), name: form.name.trim(), category: form.category, price: Number(form.price), cost: Number(selected?.cost ?? Number(form.price) * 0.8), stock: Number(selected?.stock ?? 0), unit: selected?.unit || 'unit', expiry: selected?.expiry || null, supplier: form.supplier || null, vat: Number(form.vat || 0), threshold: Number(form.threshold || 0), status: form.status }
    setSaving(true)
    try {
      const saved = selected ? await productService.update(selected.id, payload) : await productService.create(payload)
      setProducts((current) => selected ? current.map((row) => row.id === selected.id ? saved : row) : [saved, ...current]); resetForm(); toast.success(selected ? 'Product updated.' : 'Product created.')
    } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }
  const deactivate = async () => { if (!selected) return toast.error('Select a product first.'); const accepted = await confirm({ title: 'Deactivate product?', message: `${selected.name} will no longer be active for new transactions.`, confirmLabel: 'Deactivate', danger: true }); if (!accepted) return; try { const updated = await productService.update(selected.id, { ...selected, status: 'INACTIVE' }); setProducts((current) => current.map((row) => row.id === selected.id ? updated : row)); setSelected(updated); setForm((current) => ({ ...current, status: 'INACTIVE' })); toast.success('Product deactivated.') } catch (error) { toast.error(error.message) } }

  return <div>
    <PageHeader breadcrumb="Warehouse Management · 3.6.5" title="Product Management" subtitle="Maintain product master data for sales, inventory, and purchase orders." />
    <FilterBar className="mb-6"><Field label="Product Search" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="SKU, barcode, product name" value={search} onChange={(event) => setSearch(event.target.value)} /></div></Field><Field label="Category"><Select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((row) => <option key={row.id || row.name} value={row.name}>{row.name}</option>)}</Select></Field><Field label="Status"><Select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select></Field><div className="flex !basis-auto !grow-0 gap-2"><Button variant="secondary" onClick={() => setApplied({ search, category, status })}>Filter</Button><Button onClick={resetForm}>New Product</Button><Button variant="ghost" icon={RotateCcw} onClick={resetFilter}>Reset</Button></div></FilterBar>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-5">
      <section className="min-w-0 xl:col-span-3"><div className="mb-3 flex justify-between"><h2 className="font-bold text-slate-900">Product List</h2><Badge tone="slate">{rows.length} products</Badge></div><DataTable dense rows={rows} onRowClick={selectProduct} empty={{ title: 'No products found' }} columns={[
        { key: 'code', header: 'SKU', render: (row) => <span className="font-mono text-xs font-semibold">{row.code}</span> }, { key: 'barcode', header: 'Barcode' }, { key: 'name', header: 'Product' }, { key: 'category', header: 'Category' }, { key: 'price', header: 'Price', render: (row) => formatCurrency(row.price) }, { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'INACTIVE' ? 'red' : 'green'}>{row.status || 'ACTIVE'}</Badge> },
      ]} />
      <Card className="mt-6"><CardHeader title="Validation / Business Rule Area" icon={Info} /><CardBody className="text-sm text-slate-600">SKU and barcode must be unique. Product must belong to an active category. Inactive products cannot be sold or added to new purchase orders.</CardBody></Card></section>
      <Card className="xl:col-span-2"><CardHeader title="Create / Update Product" subtitle={selected ? selected.code : 'New product'} icon={PackagePlus} /><CardBody><div className="grid gap-4 sm:grid-cols-2"><Field label="SKU" required><Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} disabled={!!selected} /></Field><Field label="Barcode"><Input value={form.barcode} onChange={(event) => setForm({ ...form, barcode: event.target.value })} /></Field><Field label="Product Name" required className="sm:col-span-2"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Category"><Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="">Select</option>{categories.map((row) => <option key={row.id || row.name} value={row.name}>{row.name}</option>)}</Select></Field><Field label="Supplier"><Select value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })}><option value="">Select</option>{suppliers.map((row) => <option key={row.id || row.code} value={row.name}>{row.name}</option>)}</Select></Field><Field label="Unit Price"><Input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></Field><Field label="VAT"><Input type="number" min="0" max="100" value={form.vat} onChange={(event) => setForm({ ...form, vat: event.target.value })} /></Field><Field label="Reorder Threshold"><Input type="number" min="0" value={form.threshold} onChange={(event) => setForm({ ...form, threshold: event.target.value })} /></Field><Field label="Status"><Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select></Field></div><div className="mt-5 flex flex-wrap gap-2 border-t pt-5"><Button onClick={save} loading={saving}>Create/Update</Button><Button variant="secondary" onClick={deactivate}>Deactivate</Button><Button variant="secondary" icon={RotateCcw} onClick={resetForm}>Reset</Button></div></CardBody></Card>
    </div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.6.5 Product Management · master data changes are validated before saving</div>}
  </div>
}
