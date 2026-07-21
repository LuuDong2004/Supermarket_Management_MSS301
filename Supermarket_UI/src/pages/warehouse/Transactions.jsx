import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatDate } from '../../lib/format.js'
import { toList, warehouseTxnService, withFallback } from '../../services/index.js'
import { ClipboardCheck, RotateCcw, Search } from 'lucide-react'

const emptyFilters = { type: '', status: 'PENDING', dateFrom: '', dateTo: '', requester: '' }
const statusKey = (status = '') => status.toLowerCase().includes('pending') || status.toLowerCase().includes('chờ') ? 'PENDING' : status.toLowerCase().includes('approved') || status.toLowerCase().includes('duyệt') ? 'APPROVED' : status.toLowerCase().includes('rejected') || status.toLowerCase().includes('từ chối') ? 'REJECTED' : 'ACTIVE'
const statusTone = (status) => ({ PENDING: 'amber', APPROVED: 'green', REJECTED: 'red', ACTIVE: 'blue' }[statusKey(status)])
const requesterOf = (row) => row.requester || 'Warehouse Staff'

export default function Transactions() {
  const toast = useToast()
  const confirm = useConfirm()
  const [transactions, setTransactions] = useState([])
  const [selected, setSelected] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [decision, setDecision] = useState('approve')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => warehouseTxnService.list())
    const rows = toList(result.data)
    setTransactions(rows)
    setSource(result.source)
    setSelected((current) => rows.find((row) => row.id === current?.id) || rows.find((row) => statusKey(row.status) === 'PENDING') || rows[0] || null)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const types = useMemo(() => [...new Set(transactions.map((row) => row.type).filter(Boolean))], [transactions])
  const rows = useMemo(() => transactions.filter((row) => {
    const query = applied.requester.trim().toLowerCase()
    return (!applied.type || row.type === applied.type)
      && (!applied.status || statusKey(row.status) === applied.status)
      && (!applied.dateFrom || row.txnDate >= applied.dateFrom)
      && (!applied.dateTo || row.txnDate <= applied.dateTo)
      && (!query || requesterOf(row).toLowerCase().includes(query) || String(row.product || '').toLowerCase().includes(query))
  }), [applied, transactions])

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const resetFilters = () => { setFilters(emptyFilters); setApplied(emptyFilters) }

  const decide = async () => {
    if (!selected) return toast.error('Select a warehouse request first.')
    if (decision === 'reject' && !comment.trim()) return toast.error('A decision comment is required when rejecting.')
    const approved = decision === 'approve'
    const accepted = await confirm({ title: approved ? 'Approve warehouse transaction?' : 'Reject warehouse transaction?', message: `${approved ? 'Approve' : 'Reject'} ${selected.code || selected.id}?`, confirmLabel: 'Confirm', danger: !approved })
    if (!accepted) return
    setSaving(true)
    try {
      if (source === 'backend') {
        if (approved) await warehouseTxnService.approve(selected.id)
        else await warehouseTxnService.reject(selected.id)
        await load()
      } else {
        const updated = { ...selected, status: approved ? 'Approved' : 'Rejected', decisionComment: comment.trim() }
        setTransactions((current) => current.map((row) => row.id === selected.id ? updated : row))
        setSelected(updated)
      }
      setComment('')
      toast.success(`Warehouse transaction ${approved ? 'approved' : 'rejected'}.`)
    } catch (error) { toast.error(error.message) } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader breadcrumb="Warehouse Management · 3.6.2" title="Approve Warehouse Transaction" subtitle="Review inventory movements and record an approval decision." />
      <FilterBar className="mb-6">
        <Field label="Request Type"><Select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}><option value="">All</option>{types.map((type) => <option key={type}>{type}</option>)}</Select></Field>
        <Field label="Status"><Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="ACTIVE">Active</option><option value="REJECTED">Rejected</option></Select></Field>
        <Field label="Date Range" className="grow"><div className="grid grid-cols-2 gap-2"><Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} placeholder="From" /><Input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} placeholder="To" min={filters.dateFrom || undefined} /></div></Field>
        <Field label="Requester" className="grow"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="pl-9" placeholder="Search" value={filters.requester} onChange={(event) => setFilter('requester', event.target.value)} /></div></Field>
        <div className="flex !basis-auto !grow-0 gap-2"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button></div>
      </FilterBar>
      {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : (
        <div className="grid items-start gap-6 xl:grid-cols-5">
          <section className="min-w-0 xl:col-span-3"><div className="mb-3 flex justify-between"><div><h2 className="font-bold text-slate-900">Pending Request List</h2><p className="text-xs text-slate-500">Select a request to review its details.</p></div><Badge tone="slate">{rows.length} requests</Badge></div>
            <DataTable dense rows={rows} onRowClick={(row) => { setSelected(row); setComment('') }} empty={{ title: 'No warehouse requests found' }} columns={[
              { key: 'code', header: 'Req ID', render: (row) => <span className="font-mono text-xs font-semibold">{row.code || row.id}</span> },
              { key: 'type', header: 'Type' }, { key: 'requester', header: 'Requester', render: requesterOf },
              { key: 'txnDate', header: 'Date', render: (row) => formatDate(row.txnDate) },
              { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)} dot>{row.status}</Badge> },
            ]} />
          </section>
          <div className="space-y-6 xl:col-span-2">
            <Card><CardHeader title="Request Detail" subtitle={selected?.code || 'Select a request'} icon={ClipboardCheck} /><CardBody className="min-h-40 space-y-2 text-sm text-slate-600">{selected ? <><p><b className="text-slate-800">Old value:</b> Inventory unchanged</p><p><b className="text-slate-800">New value:</b> {selected.product} ({Number(selected.qty) > 0 ? '+' : ''}{selected.qty})</p><p><b className="text-slate-800">Reason:</b> {selected.type} · reference {selected.ref || 'N/A'}</p><p><b className="text-slate-800">Audit snapshot:</b> Request data is preserved.</p></> : <p>Select a request from the list.</p>}</CardBody></Card>
            <Card><CardHeader title="Decision" /><CardBody><div className="mb-4 flex gap-6 text-sm"><label className="flex items-center gap-2"><input type="radio" name="decision" checked={decision === 'approve'} onChange={() => setDecision('approve')} /> Approve</label><label className="flex items-center gap-2"><input type="radio" name="decision" checked={decision === 'reject'} onChange={() => setDecision('reject')} /> Reject</label></div><Field label="Decision Comment"><Textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Required for rejection" /></Field><Button className="mt-4 w-full" onClick={decide} loading={saving}>Confirm</Button></CardBody></Card>
          </div>
        </div>
      )}
      {!loading && <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.6.2 Approve Warehouse Transaction · decisions update inventory transaction status</div>}
    </div>
  )
}
