import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, CardHeader, Button, Badge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { approvalRequestService, withFallback, toList } from '../../services/index.js'
import { CheckCircle2, ClipboardCheck, FileSearch, ShieldCheck, XCircle } from 'lucide-react'

const DEMO_REQUESTS = [
  { id: '001', code: '001', type: 'Milk', requester: 'Milk', reqDate: '2026-01-12', status: 'Pending', oldValue: 'Cashier', newValue: 'Warehouse Staff', reason: 'Operational transfer', note: 'Audit snapshot is preserved.' },
  { id: '002', code: '002', type: 'Rice', requester: 'Rice', reqDate: '2026-02-12', status: 'Approved', target: 'Pricing policy update', note: 'Approved by CEO.' },
  { id: '003', code: '003', type: 'Staff A', requester: 'Staff A', reqDate: '2026-03-12', status: 'Active', target: 'Role assignment', note: 'Currently active.' },
  { id: '004', code: '004', type: 'Customer B', requester: 'Customer B', reqDate: '2026-04-12', status: 'Rejected', target: 'Loyalty adjustment', note: 'Rejected after review.' },
  { id: '005', code: '005', type: 'Supplier C', requester: 'Supplier C', reqDate: '2026-05-12', status: 'Pending', target: 'Supplier terms', note: 'Waiting for CEO decision.' },
  { id: '006', code: '006', type: 'Order D', requester: 'Order D', reqDate: '2026-06-12', status: 'Approved', target: 'Order threshold', note: 'Approved by CEO.' },
  { id: '007', code: '007', type: 'Milk', requester: 'Milk', reqDate: '2026-07-12', status: 'Active', target: 'Category policy', note: 'Currently active.' },
  { id: '008', code: '008', type: 'Rice', requester: 'Rice', reqDate: '2026-08-12', status: 'Rejected', target: 'Stock policy', note: 'Rejected after review.' },
]

function statusLabel(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('APPROVED') || value.includes('ĐÃ DUYỆT')) return 'Approved'
  if (value.includes('REJECT') || value.includes('TỪ CHỐI')) return 'Rejected'
  if (value.includes('ACTIVE') || value.includes('ĐANG')) return 'Active'
  if (value.includes('REVIEW')) return 'Review'
  if (value.includes('PENDING') || value.includes('CHỜ')) return 'Pending'
  return status || 'Pending'
}

function statusTone(status) {
  const value = statusLabel(status)
  if (value === 'Approved' || value === 'Active') return 'green'
  if (value === 'Rejected') return 'red'
  if (value === 'Review') return 'blue'
  return 'amber'
}

function shortDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function backendDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10)
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10)
}

export default function Approvals() {
  const toast = useToast()
  const confirm = useConfirm()
  const [requests, setRequests] = useState([])
  const [source, setSource] = useState('backend')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [requestType, setRequestType] = useState('all')
  const [status, setStatus] = useState('Pending')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [requester, setRequester] = useState('')
  const [applied, setApplied] = useState({ requestType: 'all', status: '', dateFrom: '', dateTo: '', requester: '' })
  const [decision, setDecision] = useState('approve')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => approvalRequestService.list())
    const rows = result.source === 'backend' ? toList(result.data) : DEMO_REQUESTS
    setRequests(rows)
    setSource(result.source)
    setSelected((current) => rows.find((row) => row.id === current?.id) || rows[0] || null)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const types = useMemo(() => [...new Set(requests.map((request) => request.type).filter(Boolean))], [requests])

  const filteredRequests = useMemo(() => requests.filter((request) => {
    if (applied.requestType !== 'all' && request.type !== applied.requestType) return false
    if (applied.status && statusLabel(request.status) !== applied.status) return false
    if (applied.requester && !String(request.requester || '').toLowerCase().includes(applied.requester.toLowerCase())) return false
    const requestDate = backendDate(request.reqDate || request.date)
    if (applied.dateFrom && requestDate < applied.dateFrom) return false
    if (applied.dateTo && requestDate > applied.dateTo) return false
    return true
  }), [applied, requests])

  useEffect(() => {
    if (!filteredRequests.length) {
      setSelected(null)
      return
    }
    if (!selected || !filteredRequests.some((request) => request.id === selected.id)) {
      setSelected(filteredRequests[0])
    }
  }, [filteredRequests, selected])

  useEffect(() => {
    setDecision('approve')
    setComment('')
  }, [selected?.id])

  const applyFilters = () => setApplied({ requestType, status, dateFrom, dateTo, requester: requester.trim() })

  const resetFilters = () => {
    setRequestType('all')
    setStatus('Pending')
    setDateFrom('')
    setDateTo('')
    setRequester('')
    setApplied({ requestType: 'all', status: '', dateFrom: '', dateTo: '', requester: '' })
  }

  const confirmDecision = async () => {
    if (!selected) return
    const currentStatus = statusLabel(selected.status)
    if (!['Pending', 'Review'].includes(currentStatus)) {
      toast.info(`Request ${selected.code || selected.id} has already been processed.`)
      return
    }
    if (decision === 'reject' && !comment.trim()) {
      toast.error('A decision comment is required for rejection.')
      return
    }

    const approve = decision === 'approve'
    const ok = await confirm({
      title: approve ? 'Approve request?' : 'Reject request?',
      message: `${approve ? 'Approve' : 'Reject'} request ${selected.code || selected.id} from ${selected.requester}?`,
      confirmLabel: 'Confirm',
      danger: !approve,
    })
    if (!ok) return

    setSubmitting(true)
    const nextStatus = approve ? 'Approved' : 'Rejected'

    if (source === 'backend' && selected.id) {
      try {
        if (comment.trim()) {
          await approvalRequestService.update(selected.id, {
            code: selected.code || String(selected.id),
            type: selected.type || 'Approval Request',
            requester: selected.requester || 'System',
            target: selected.target || selected.newValue || 'Requested change',
            reqDate: backendDate(selected.reqDate || selected.date),
            status: selected.status || 'Pending',
            note: [selected.note, `CEO decision comment: ${comment.trim()}`].filter(Boolean).join('\n'),
          })
        }
        if (approve) await approvalRequestService.approve(selected.id)
        else await approvalRequestService.reject(selected.id)
        toast.success(`Request ${selected.code || selected.id} was ${nextStatus.toLowerCase()}.`)
        await load()
        setSubmitting(false)
        return
      } catch (error) {
        toast.error(error.message || 'The request could not be updated.')
        setSubmitting(false)
        return
      }
    }

    setRequests((rows) => rows.map((row) => row.id === selected.id
      ? { ...row, status: nextStatus, note: comment.trim() || row.note }
      : row))
    setSelected((request) => ({ ...request, status: nextStatus, note: comment.trim() || request.note }))
    toast.success(`Request ${selected.code || selected.id} was ${nextStatus.toLowerCase()}.`)
    setSubmitting(false)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Executive · 3.3.2"
        title="Process Approval Request"
        subtitle="Review request details, preserve the audit trail, and record the CEO decision."
      />

      <FilterBar>
        <Field label="Request Type">
          <Select value={requestType} onChange={(event) => setRequestType(event.target.value)}>
            <option value="all">All</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {['Pending', 'Review', 'Approved', 'Active', 'Rejected'].map((value) => <option key={value} value={value}>{value}</option>)}
          </Select>
        </Field>
        <Field label="Date Range" className="sm:min-w-[19rem]">
          <div className="grid grid-cols-2 gap-2">
            <Input aria-label="From date" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            <Input aria-label="To date" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </div>
        </Field>
        <Field label="Requester" className="grow">
          <Input value={requester} onChange={(event) => setRequester(event.target.value)} placeholder="Search requester" />
        </Field>
        <div className="flex gap-2">
          <Button onClick={applyFilters}>Apply</Button>
          <Button variant="secondary" onClick={resetFilters}>Reset</Button>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-5">
          <Card className="min-w-0 xl:col-span-3">
            <CardHeader title="Pending Request List" subtitle={`${filteredRequests.length} requests in the current view`} icon={FileSearch} />
            <CardBody className="p-0">
              <DataTable
                className="rounded-none border-0 shadow-none"
                dense
                rows={filteredRequests}
                rowKey="id"
                onRowClick={setSelected}
                empty={{ title: 'No approval requests found', subtitle: 'Reset the filters to view all requests.' }}
                columns={[
                  { key: 'code', header: 'Req ID', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.code || row.id}</span> },
                  { key: 'type', header: 'Type' },
                  { key: 'requester', header: 'Requester' },
                  { key: 'date', header: 'Date', render: (row) => shortDate(row.reqDate || row.date) },
                  { key: 'status', header: 'Status', render: (row) => <Badge tone={statusTone(row.status)} dot>{statusLabel(row.status)}</Badge> },
                ]}
              />
            </CardBody>
          </Card>

          <div className="space-y-6 xl:col-span-2">
            <Card className="min-h-52">
              <CardHeader title="Request Detail" subtitle={selected ? `Request ${selected.code || selected.id}` : 'Select a request'} icon={ClipboardCheck} />
              <CardBody>
                {selected ? (
                  <div className="space-y-3 text-sm">
                    <DetailRow label="Old value" value={selected.oldValue || 'Current configuration'} />
                    <DetailRow label="New value" value={selected.newValue || selected.target || 'Requested change'} />
                    <DetailRow label="Reason" value={selected.reason || selected.note || 'Operational update'} />
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3 text-xs font-medium text-emerald-700">
                      Audit snapshot is preserved.
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Choose a request from the list to see its details.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Decision" subtitle="Record the executive outcome" icon={ShieldCheck} />
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-700">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input type="radio" name="decision" value="approve" checked={decision === 'approve'} onChange={() => setDecision('approve')} />
                    <CheckCircle2 size={16} className="text-emerald-600" /> Approve
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input type="radio" name="decision" value="reject" checked={decision === 'reject'} onChange={() => setDecision('reject')} />
                    <XCircle size={16} className="text-rose-600" /> Reject
                  </label>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <Field label="Decision Comment" className="flex-1" required={decision === 'reject'}>
                    <Input value={comment} onChange={(event) => setComment(event.target.value)} placeholder={decision === 'reject' ? 'Required for rejection' : 'Optional approval note'} />
                  </Field>
                  <Button loading={submitting} disabled={!selected} onClick={confirmDecision}>Confirm</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-b border-slate-100 pb-2.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
