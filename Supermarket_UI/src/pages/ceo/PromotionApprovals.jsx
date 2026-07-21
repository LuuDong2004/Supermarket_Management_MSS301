import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, CardHeader, Button, Badge, Field, Input, Spinner, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { promotionService, withFallback, toList } from '../../services/index.js'
import { BadgePercent, CheckCircle2, ClipboardCheck, History, Megaphone, TrendingUp, XCircle } from 'lucide-react'

const DEMO_PROMOTIONS = [
  {
    id: 'APR-241', code: 'APR-241', name: 'Weekend Dairy Sale', requester: 'DongLV - Administrator', scope: 'Category: Dairy Products',
    discount: 10, type: 'percent', fromDate: '2026-06-15', toDate: '2026-06-30', status: 'Pending', createdAt: '2026-06-13T09:20:00',
  },
  {
    id: 'APR-242', code: 'APR-242', name: 'Member Voucher', requester: 'DongLV', scope: 'Active loyalty members',
    discount: 50000, type: 'amount', fromDate: '2026-06-18', toDate: '2026-06-25', status: 'Pending', createdAt: '2026-06-13T10:10:00',
  },
  {
    id: 'APR-243', code: 'APR-243', name: 'Rice Bundle', requester: 'DongLV', scope: 'Rice category',
    discount: 12, type: 'percent', fromDate: '2026-06-20', toDate: '2026-06-30', status: 'Review', createdAt: '2026-06-13T11:05:00',
  },
  {
    id: 'APR-244', code: 'APR-244', name: 'Back-to-school', requester: 'DongLV', scope: 'School supplies',
    discount: 8, type: 'percent', fromDate: '2026-07-01', toDate: '2026-07-15', status: 'Pending', createdAt: '2026-06-13T13:40:00',
  },
]

function statusLabel(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('APPROVED') || value.includes('ĐÃ DUYỆT')) return 'Approved'
  if (value.includes('REJECT') || value.includes('TỪ CHỐI')) return 'Rejected'
  if (value.includes('REVIEW')) return 'Review'
  if (value.includes('PENDING') || value.includes('CHỜ')) return 'Pending'
  return status || 'Pending'
}

function statusTone(status) {
  const value = statusLabel(status)
  if (value === 'Approved') return 'green'
  if (value === 'Rejected') return 'red'
  if (value === 'Review') return 'blue'
  return 'amber'
}

function dateLabel(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB')
}

function timestampLabel(value) {
  if (!value) return 'Not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
}

function discountRule(promotion) {
  if (!promotion) return '—'
  if (promotion.type === 'percent') return `${promotion.discount}% off for member orders`
  return `${Number(promotion.discount || 0).toLocaleString('en-US')} VND campaign discount`
}

export default function PromotionApprovals() {
  const toast = useToast()
  const confirm = useConfirm()
  const [promotions, setPromotions] = useState([])
  const [source, setSource] = useState('backend')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => promotionService.list())
    const rows = result.source === 'backend'
      ? toList(result.data).map((promotion) => ({ ...promotion, requester: promotion.requester || 'Administrator' }))
      : DEMO_PROMOTIONS
    setPromotions(rows)
    setSource(result.source)
    setSelected((current) => rows.find((promotion) => promotion.id === current?.id) || rows.find((promotion) => ['Pending', 'Review'].includes(statusLabel(promotion.status))) || rows[0] || null)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const pendingPromotions = useMemo(() => {
    const pending = promotions.filter((promotion) => ['Pending', 'Review'].includes(statusLabel(promotion.status)))
    return pending.length ? pending : promotions.slice(0, 4)
  }, [promotions])

  useEffect(() => { setComment('') }, [selected?.id])

  const decide = async (approve) => {
    if (!selected) return
    if (!['Pending', 'Review'].includes(statusLabel(selected.status))) {
      toast.info(`Campaign ${selected.code} has already been processed.`)
      return
    }
    if (!approve && !comment.trim()) {
      toast.error('A decision comment is required when rejecting a campaign.')
      return
    }

    const ok = await confirm({
      title: approve ? 'Approve campaign?' : 'Reject campaign?',
      message: `${approve ? 'Approve' : 'Reject'} “${selected.name}” (${selected.code})?`,
      confirmLabel: approve ? 'Approve' : 'Reject',
      danger: !approve,
    })
    if (!ok) return

    setSubmitting(true)
    const nextStatus = approve ? 'Approved' : 'Rejected'
    if (source === 'backend' && selected.id) {
      try {
        if (approve) await promotionService.approve(selected.id)
        else await promotionService.reject(selected.id)
        toast.success(`Campaign ${selected.code} was ${nextStatus.toLowerCase()}.`)
        await load()
        setSubmitting(false)
        return
      } catch (error) {
        toast.error(error.message || 'The promotion campaign could not be updated.')
        setSubmitting(false)
        return
      }
    }

    const localUpdate = { ...selected, status: nextStatus, decisionComment: comment.trim() }
    setPromotions((rows) => rows.map((promotion) => promotion.id === selected.id ? localUpdate : promotion))
    setSelected(localUpdate)
    toast.success(`Campaign ${selected.code} was ${nextStatus.toLowerCase()}.`)
    setSubmitting(false)
  }

  const impact = selected ? [
    'Estimated revenue uplift: 8–12%',
    'Target customer group: active loyalty members',
    `Affected products: ${selected.scope || 'selected campaign products'}`,
    `Budget impact: ${selected.type === 'amount' ? Number(selected.discount || 0).toLocaleString('en-US') : '18,000,000'} VND maximum discount`,
    'Conflict check: no overlapping active campaign found',
  ] : []

  return (
    <div>
      <PageHeader
        breadcrumb="Executive · 3.3.4"
        title="Promotion Campaign Approval Detail"
        subtitle="Review campaign summary, business impact, and approval decision."
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="min-w-0">
              <CardHeader title="Pending Promotion Requests" subtitle={`${pendingPromotions.length} campaigns awaiting review`} icon={Megaphone} />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={pendingPromotions}
                  rowKey="id"
                  onRowClick={setSelected}
                  empty={{ title: 'No pending promotion requests', subtitle: 'All campaigns have been processed.' }}
                  columns={[
                    { key: 'code', header: 'Req ID', render: (promotion) => <span className="font-mono text-xs font-semibold text-slate-700">{promotion.code}</span> },
                    { key: 'name', header: 'Campaign', render: (promotion) => <span className="font-semibold text-slate-700">{promotion.name}</span> },
                    { key: 'requester', header: 'Requester' },
                    { key: 'status', header: 'Status', render: (promotion) => <Badge tone={statusTone(promotion.status)} dot>{statusLabel(promotion.status)}</Badge> },
                  ]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Campaign Summary" subtitle={selected ? selected.code : 'Select a campaign'} icon={BadgePercent} />
              <CardBody>
                {selected ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SummaryField label="Campaign Name" value={selected.name} />
                    <SummaryField label="Requester" value={selected.requester || 'Administrator'} />
                    <SummaryField label="Date Range" value={`${dateLabel(selected.fromDate)} – ${dateLabel(selected.toDate)}`} />
                    <SummaryField label="Target Scope" value={selected.scope} />
                    <SummaryField label="Discount Rule" value={discountRule(selected)} />
                    <SummaryField label="Approval Status" value={statusLabel(selected.status)} />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Choose a promotion request to view its campaign summary.</p>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader title="Expected Impact" subtitle="Projected campaign outcomes" icon={TrendingUp} />
              <CardBody>
                {selected ? (
                  <ul className="space-y-3 text-sm text-slate-700">
                    {impact.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-slate-500">Select a campaign to review its expected impact.</p>}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Decision" subtitle="CEO approval outcome" icon={ClipboardCheck} />
              <CardBody>
                <Field label="Decision Comment" required={false}>
                  <Textarea
                    rows={4}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Required when rejecting; optional note when approving"
                  />
                </Field>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="success" icon={CheckCircle2} loading={submitting} disabled={!selected} onClick={() => decide(true)}>Approve</Button>
                  <Button variant="danger" icon={XCircle} loading={submitting} disabled={!selected} onClick={() => decide(false)}>Reject</Button>
                  <Button variant="secondary" onClick={() => setSelected(null)}>Back to List</Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader title="Audit Snapshot" subtitle="Immutable approval context" icon={History} />
            <CardBody>
              {selected ? (
                <p className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs leading-5 text-slate-600">
                  Request created: {timestampLabel(selected.createdAt)} | Old value: none | New value: campaign draft | Approval decision will be stored with CEO and timestamp; the comment is captured in the current review context.
                </p>
              ) : (
                <p className="text-sm text-slate-500">Select a request to view its audit snapshot.</p>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}

function SummaryField({ label, value }) {
  return (
    <Field label={label}>
      <Input value={value || '—'} readOnly />
    </Field>
  )
}
