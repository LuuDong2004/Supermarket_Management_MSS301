import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import {
  Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, StatusBadge, } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatDate, isoDate } from '../../lib/format.js'
import {
  approvalRequestService, toList, withFallback } from '../../services/index.js'
import { FileCheck2, RotateCcw, Search, Send, X } from 'lucide-react'

const REQUEST_TYPES = [
  'Account Creation',
  'Role Change',
  'Permission Change',
  'Inventory Adjustment',
  'Business Policy',
  'Promotion Campaign',
]

const emptyForm = {
  type: 'Role Change',
  currentValue: '',
  requestedValue: '',
  reason: '',
}

const normalizeStatus = (status = '') => {
  const value = status.toLowerCase()
  if (value.includes('pending') || value.includes('chờ')) return 'PENDING'
  if (value.includes('approved') || value.includes('đã duyệt')) return 'APPROVED'
  if (value.includes('rejected') || value.includes('từ chối')) return 'REJECTED'
  if (value.includes('active')) return 'ACTIVE'
  return status.toUpperCase()
}

const typeTone = (type = '') => {
  const value = type.toLowerCase()
  if (value.includes('account') || value.includes('tài khoản')) return 'blue'
  if (value.includes('role') || value.includes('permission') || value.includes('quyền')) return 'violet'
  if (value.includes('inventory') || value.includes('kho')) return 'amber'
  if (value.includes('promotion')) return 'green'
  return 'brand'
}

const decisionLabel = (request) => {
  if (request.decision) return request.decision
  const status = normalizeStatus(request.status)
  if (status === 'PENDING') return 'Awaiting CEO'
  if (status === 'APPROVED') return 'Approved'
  if (status === 'REJECTED') return 'Rejected'
  return request.status || '—'
}

export default function ApprovalRequests() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [source, setSource] = useState('backend')
  const [form, setForm] = useState(emptyForm)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [applied, setApplied] = useState({ search: '', status: '', type: '', dateFrom: '', dateTo: '' })

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => approvalRequestService.list())
    setRequests(toList(result.data))
    setSource(result.source)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return requests.filter((request) => {
      const requestDate = request.reqDate || request.date || ''
      const matchesSearch = !query || [
        request.code,
        request.id,
        request.type,
        request.requester,
        request.target,
        request.note,
      ].some((value) => String(value || '').toLowerCase().includes(query))

      return matchesSearch
        && (!applied.status || normalizeStatus(request.status) === applied.status)
        && (!applied.type || request.type === applied.type)
        && (!applied.dateFrom || requestDate >= applied.dateFrom)
        && (!applied.dateTo || requestDate <= applied.dateTo)
    })
  }, [applied, requests])

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const applyFilters = () => setApplied({ search, status, type, dateFrom, dateTo })

  const resetFilters = () => {
    setSearch('')
    setStatus('')
    setType('')
    setDateFrom('')
    setDateTo('')
    setApplied({ search: '', status: '', type: '', dateFrom: '', dateTo: '' })
  }

  const cancelForm = () => setForm(emptyForm)

  const submit = async () => {
    if (!form.type || !form.currentValue.trim() || !form.requestedValue.trim() || !form.reason.trim()) {
      toast.error('Complete all request form fields before submitting.')
      return
    }

    const accepted = await confirm({
      title: 'Submit approval request?',
      message: `Send the ${form.type} request to the CEO for review?`,
      confirmLabel: 'Submit',
    })
    if (!accepted) return

    const payload = {
      code: `AR-${Date.now()}`,
      type: form.type,
      requester: 'Administrator',
      target: `${form.currentValue.trim()} → ${form.requestedValue.trim()}`,
      reqDate: isoDate(),
      status: 'Pending',
      note: form.reason.trim(),
    }

    setSubmitting(true)
    try {
      if (source === 'backend') {
        const created = await approvalRequestService.create(payload)
        setRequests((current) => [created, ...current])
      } else {
        setRequests((current) => [{ id: payload.code, ...payload }, ...current])
      }
      setForm(emptyForm)
      toast.success('Approval request submitted to the CEO.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Administration · 3.4.2"
        title="Submit and View Approval Request"
        subtitle="Submit management changes for CEO review and follow their approval status."
      />

      <FilterBar className="mb-6">
        <Field label="Search" className="grow">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Keyword"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
            />
          </div>
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACTIVE">Active</option>
          </Select>
        </Field>
        <Field label="Date" className="grow">
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} placeholder="From" />
            <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} placeholder="To" min={dateFrom || undefined} />
          </div>
        </Field>
        <Field label="Type">
          <Select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">All</option>
            {REQUEST_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
        </Field>
        <div className="flex !basis-auto !grow-0 gap-2">
          <Button onClick={applyFilters}>Apply</Button>
          <Button variant="secondary" icon={RotateCcw} onClick={resetFilters}>Reset</Button>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-5">
          <section className="min-w-0 xl:col-span-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Approval Request List</h2>
                <p className="mt-0.5 text-xs text-slate-500">Select a row to open the complete request detail.</p>
              </div>
              <Badge tone="slate">{rows.length} requests</Badge>
            </div>
            <DataTable
              dense
              rows={rows}
              onRowClick={(request) => navigate(`/app/admin/approval-requests/${request.id || request.code}`)}
              empty={{ title: 'No approval requests found', subtitle: 'Try changing the filters or submit a new request.' }}
              columns={[
                {
                  key: 'code',
                  header: 'Req ID',
                  render: (request) => <span className="font-mono text-xs font-semibold text-slate-700">{request.code || request.id}</span>,
                },
                {
                  key: 'type',
                  header: 'Type',
                  render: (request) => <Badge tone={typeTone(request.type)}>{request.type}</Badge>,
                },
                { key: 'requester', header: 'Requested', render: (request) => request.requester || 'Administrator' },
                { key: 'status', header: 'Status', render: (request) => <StatusBadge status={request.status} /> },
                {
                  key: 'decision',
                  header: 'Decision',
                  render: (request) => <span className="text-xs font-medium text-slate-600">{decisionLabel(request)}</span>,
                },
              ]}
            />
          </section>

          <Card className="xl:col-span-2">
            <CardHeader
              title="Request Form"
              subtitle="The request will be sent to the CEO"
              icon={FileCheck2}
            />
            <CardBody className="flex min-h-[22rem] flex-col">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Field label="Request Type" required>
                  <Select value={form.type} onChange={(event) => setField('type', event.target.value)}>
                    {REQUEST_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </Select>
                </Field>
                <Field label="Current Value" required>
                  <Input
                    maxLength={65}
                    placeholder="Existing"
                    value={form.currentValue}
                    onChange={(event) => setField('currentValue', event.target.value)}
                  />
                </Field>
                <Field label="Requested Value" required>
                  <Input
                    maxLength={65}
                    placeholder="New value"
                    value={form.requestedValue}
                    onChange={(event) => setField('requestedValue', event.target.value)}
                  />
                </Field>
                <Field label="Reason" required>
                  <Input
                    maxLength={250}
                    placeholder="Business reason"
                    value={form.reason}
                    onChange={(event) => setField('reason', event.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <Button icon={Send} onClick={submit} loading={submitting}>Submit</Button>
                <Button variant="secondary" icon={X} onClick={cancelForm} disabled={submitting}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {!loading && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">
          <span>Request decisions are recorded by the CEO with status and audit history.</span>
          <span>{formatDate(isoDate())}</span>
        </div>
      )}
    </div>
  )
}
