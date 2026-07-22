import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { supplierService, toList, withFallback } from '../../services/index.js'
import { Info, RotateCcw, Search, Truck } from 'lucide-react'

const emptyForm = { code: '', name: '', phone: '', email: '', address: '', status: 'ACTIVE' }

export default function Suppliers() {
  const toast = useToast(); const confirm = useConfirm()
  const [suppliers, setSuppliers] = useState([]); const [selected, setSelected] = useState(null); const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [applied, setApplied] = useState({ search: '', status: '' }); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [source, setSource] = useState('backend')
  const load = async () => { setLoading(true); const result = await withFallback(() => supplierService.list({ page: 0, size: 100 })); setSuppliers(toList(result.data)); setSource(result.source); setLoading(false) }
  useEffect(() => { load() }, [])
  const rows = useMemo(() => { const query = applied.search.trim().toLowerCase(); return suppliers.filter((row) => (!query || [row.code, row.name, row.phone, row.email].some((value) => String(value || '').toLowerCase().includes(query))) && (!applied.status || row.status === applied.status)) }, [applied, suppliers])
  const selectSupplier = (row) => { setSelected(row); setForm({ code: row.code || '', name: row.name || '', phone: row.phone || '', email: row.email || '', address: row.address || row.terms || '', status: row.status || 'ACTIVE' }) }
  const resetForm = () => { setSelected(null); setForm(emptyForm) }
  const body = (nextStatus = form.status) => ({ code: form.code.trim(), name: form.name.trim(), contact: selected?.contact || '', phone: form.phone.trim(), email: form.email.trim() || null, address: form.address.trim() || null, rating: selected?.rating ?? null, status: nextStatus, terms: selected?.terms || '' })
  const save = async () => {
    if (!form.code.trim() || !form.name.trim()) return toast.error('Supplier code and name are required.')
    if (suppliers.some((row) => row.id !== selected?.id && row.code === form.code.trim())) return toast.error('Supplier code must be unique.')
    const accepted = await confirm({ title: selected ? 'Update supplier?' : 'Create supplier?', message: `${selected ? 'Update' : 'Create'} ${form.name}?`, confirmLabel: 'Create/Update' }); if (!accepted) return
    setSaving(true)
    try { const saved = selected ? await supplierService.update(selected.id, body()) : await supplierService.create(body()); setSuppliers((current) => selected ? current.map((row) => row.id === selected.id ? saved : row) : [saved, ...current]); resetForm(); toast.success(selected ? 'Supplier updated.' : 'Supplier created.') } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }
  const deactivate = async () => { if (!selected) return toast.error('Select a supplier first.'); const accepted = await confirm({ title: 'Deactivate supplier?', message: `${selected.name} cannot be selected for new purchase orders.`, confirmLabel: 'Deactivate', danger: true }); if (!accepted) return; try { const saved = await supplierService.update(selected.id, body('INACTIVE')); setSuppliers((current) => current.map((row) => row.id === selected.id ? { ...row, ...saved } : row)); resetForm(); toast.success('Supplier deactivated.') } catch (error) { toast.error(error.message) } }
  return <div>
    <PageHeader breadcrumb="Warehouse Management · 3.6.7" title="Supplier Management" subtitle="Maintain supplier master data for purchase orders and goods receiving." />
    <FilterBar className="mb-6"><Field label="Supplier Search" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Code, name, phone, email" value={search} onChange={(event) => setSearch(event.target.value)} /></div></Field><Field label="Status"><Select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option></Select></Field><div className="flex !basis-auto !grow-0 gap-2"><Button variant="secondary" onClick={() => setApplied({ search, status })}>Apply</Button><Button onClick={resetForm}>New Supplier</Button></div></FilterBar>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-5">
      <section className="min-w-0 xl:col-span-3"><div className="mb-3 flex justify-between"><h2 className="font-bold text-slate-900">Supplier List</h2><Badge tone="slate">{rows.length} suppliers</Badge></div><DataTable dense rows={rows} onRowClick={selectSupplier} empty={{ title: 'No suppliers found' }} columns={[
        { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs font-semibold">{row.code}</span> }, { key: 'name', header: 'Supplier Name' }, { key: 'phone', header: 'Phone' }, { key: 'email', header: 'Email', render: (row) => row.email || '—' }, { key: 'status', header: 'Status', render: (row) => <Badge tone={row.status === 'ACTIVE' ? 'green' : 'red'}>{row.status}</Badge> },
      ]} /><Card className="mt-6"><CardHeader title="Validation / Business Rule Area" icon={Info} /><CardBody className="text-sm text-slate-600">Supplier code must be unique. Inactive suppliers cannot be selected for new purchase orders. Suppliers with open purchase orders cannot be deactivated until those orders are closed.</CardBody></Card></section>
      <Card className="xl:col-span-2"><CardHeader title="Create / Update Supplier" subtitle={selected?.code || 'New supplier'} icon={Truck} /><CardBody><div className="grid gap-4 sm:grid-cols-2"><Field label="Supplier Code" required><Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} disabled={!!selected} /></Field><Field label="Status"><Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option></Select></Field><Field label="Supplier Name" required className="sm:col-span-2"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Phone"><Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field><Field label="Email"><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field><Field label="Address" className="sm:col-span-2"><Textarea rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></Field></div><div className="mt-5 flex gap-2 border-t pt-5"><Button onClick={save} loading={saving}>Create/Update</Button><Button variant="secondary" onClick={deactivate}>Deactivate</Button><Button variant="secondary" icon={RotateCcw} onClick={resetForm}>Reset</Button></div></CardBody></Card>
    </div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.6.7 Supplier Management · supplier status controls purchase-order availability</div>}
  </div>
}
