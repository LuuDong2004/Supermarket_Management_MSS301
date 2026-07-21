import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { customerService, mockCustomers, toList, withFallback } from '../../services/index.js'
import { RotateCcw, Save, Search, Star } from 'lucide-react'

const emptyFilters = { phone: '', name: '', status: '', email: '' }
const emptyForm = { id: '', code: '', phone: '', name: '', email: '', tier: 'Member', points: 0, joined: '', spent: 0 }
const tierTone = { Platinum: 'violet', Gold: 'amber', Silver: 'slate', Member: 'blue' }

export default function Members() {
  const toast = useToast()
  const [members, setMembers] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  useEffect(() => {
    const load = async () => { const result = await withFallback(() => customerService.list(), mockCustomers); const rows = toList(result.data); setMembers(rows); setSource(result.source); setForm(rows[0] ? { ...emptyForm, ...rows[0] } : emptyForm); setLoading(false) }
    load()
  }, [])
  const rows = useMemo(() => members.filter((member) => (!applied.phone || String(member.phone || '').includes(applied.phone)) && (!applied.name || String(member.name || '').toLowerCase().includes(applied.name.toLowerCase())) && (!applied.status || member.tier === applied.status)), [applied, members])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const selectMember = (member) => setForm({ ...emptyForm, ...member })
  const reset = () => { setFilters(emptyFilters); setApplied(emptyFilters) }
  const newMember = () => setForm({ ...emptyForm, joined: new Date().toISOString().slice(0, 10) })

  const save = async () => {
    if (!form.phone.trim() || !form.name.trim()) return toast.error('Phone number and customer name are required.')
    const payload = { code: form.code || `C${Date.now().toString().slice(-6)}`, name: form.name.trim(), phone: form.phone.trim(), tier: form.tier, points: Number(form.points || 0), joined: form.joined || new Date().toISOString().slice(0, 10), spent: Number(form.spent || 0) }
    setSaving(true)
    try {
      const response = source === 'backend' ? (form.id ? await customerService.update(form.id, payload) : await customerService.create(payload)) : { id: form.id || payload.code, ...payload }
      const saved = { ...response, email: form.email }
      setMembers((current) => form.id ? current.map((member) => member.id === form.id ? saved : member) : [saved, ...current])
      setForm(saved); toast.success(form.id ? 'Customer profile updated.' : 'Customer member registered.')
    } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }

  return <div>
    <PageHeader breadcrumb="Customer Membership · 3.9.1" title="Search or Register Customer Member" subtitle="Find an existing member or create a new customer profile." actions={<Button variant="secondary" onClick={newMember}>New Member</Button>} />
    <FilterBar className="mb-6"><Field label="Phone Number"><Input placeholder="Customer phone" value={filters.phone} onChange={(event) => setFilter('phone', event.target.value)} /></Field><Field label="Customer Name"><Input placeholder="Name" value={filters.name} onChange={(event) => setFilter('name', event.target.value)} /></Field><Field label="Status"><Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">Active / New</option><option>Member</option><option>Silver</option><option>Gold</option><option>Platinum</option></Select></Field><Field label="Email"><Input placeholder="Optional" value={filters.email} onChange={(event) => setFilter('email', event.target.value)} /></Field><div className="flex !basis-auto !grow-0 gap-2"><Button icon={Search} onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={reset}>Reset</Button></div></FilterBar>
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 xl:grid-cols-5"><section className="min-w-0 xl:col-span-3"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Customer Search Result</h2><p className="text-xs text-slate-500">Select a customer to view or edit the profile.</p></div><Badge tone="slate">{rows.length} customers</Badge></div><DataTable dense rows={rows} onRowClick={selectMember} empty={{ title: 'No customer members found' }} columns={[
      { key: 'code', header: 'Customer ID', render: (row) => <span className="font-mono text-xs font-semibold">{row.code || row.id}</span> }, { key: 'phone', header: 'Phone' }, { key: 'name', header: 'Name' }, { key: 'points', header: 'Points' }, { key: 'tier', header: 'Status', render: (row) => <Badge tone={tierTone[row.tier] || 'slate'}>{row.tier || 'Active'}</Badge> },
    ]} /></section><Card className="xl:col-span-2"><CardHeader title="Customer Profile / Registration" subtitle={form.id ? form.code || form.id : 'New customer member'} /><CardBody className="flex min-h-[22rem] flex-col"><div className="grid gap-4 sm:grid-cols-2"><Field label="Phone Number" required><Input value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="Required" /></Field><Field label="Customer Name" required><Input value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Required for new" /></Field><Field label="Email"><Input type="email" value={form.email || ''} onChange={(event) => setField('email', event.target.value)} placeholder="Optional" /></Field><Field label="Membership Status"><Select value={form.tier} onChange={(event) => setField('tier', event.target.value)}><option>Member</option><option>Silver</option><option>Gold</option><option>Platinum</option></Select></Field></div><div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-4"><h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><Star size={16} />Loyalty Summary</h3><p className="text-sm text-slate-600">Available points: <b>{Number(form.points || 0).toLocaleString()}</b></p><p className="text-sm text-slate-600">Last purchase: {form.joined || 'No activity'}</p></div><div className="mt-auto flex gap-2 border-t border-slate-100 pt-5"><Button icon={Save} onClick={save} loading={saving}>Save Member</Button><Button variant="secondary" onClick={() => form.id && (window.location.href = `/app/pos/loyalty?member=${form.id}`)}>View Points</Button></div></CardBody></Card></div>}
    {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.9.1 Search or Register Customer Member · email is retained in the interface profile while the customer service stores membership fields</div>}
  </div>
}
