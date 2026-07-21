import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatDate, isoDate } from '../../lib/format.js'
import { approvalRequestService, promotionService, toList, withFallback } from '../../services/index.js'
import { BadgePercent, ClipboardCopy, Eye, FileText, RotateCcw, Save, Send } from 'lucide-react'

const DEMO_PROMOTIONS = [
  { id: 'APR-241', code: 'APR-241', name: 'Weekend Dairy Sale', scope: 'Category: Dairy Products', fromDate: '2026-06-15', toDate: '2026-06-30', discount: 10, type: 'percent', status: 'Pending' },
  { id: 'APR-242', code: 'APR-242', name: 'Member Voucher', scope: 'Active loyalty members', fromDate: '2026-06-18', toDate: '2026-06-25', discount: 50000, type: 'amount', status: 'Draft' },
  { id: 'APR-243', code: 'APR-243', name: 'Rice Bundle', scope: 'Rice category', fromDate: '2026-07-01', toDate: '2026-07-15', discount: 12, type: 'percent', status: 'Rejected' },
  { id: 'APR-244', code: 'APR-244', name: 'Back-to-school', scope: 'School supplies', fromDate: '2026-07-20', toDate: '2026-08-10', discount: 8, type: 'percent', status: 'Approved' },
]

const emptyForm = { name: '', scope: '', fromDate: '', toDate: '', type: 'percent', discount: 10, reason: '' }

const statusLabel = (status = '') => {
  const value = status.toUpperCase()
  if (value.includes('APPROVED') || value.includes('ĐÃ DUYỆT')) return 'Approved'
  if (value.includes('REJECT') || value.includes('TỪ CHỐI')) return 'Rejected'
  if (value.includes('DRAFT') || value.includes('NHÁP')) return 'Draft'
  if (value.includes('PENDING') || value.includes('CHỜ')) return 'Pending'
  return status || 'Pending'
}

const statusTone = (status) => {
  const value = statusLabel(status)
  if (value === 'Approved') return 'green'
  if (value === 'Rejected') return 'red'
  if (value === 'Draft') return 'blue'
  return 'amber'
}

const periodLabel = (promotion) => `${formatDate(promotion.fromDate || promotion.from)} – ${formatDate(promotion.toDate || promotion.to)}`

export default function PromotionCampaigns() {
  const toast = useToast()
  const confirm = useConfirm()
  const [promotions, setPromotions] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => promotionService.list(), DEMO_PROMOTIONS)
    const rows = toList(result.data)
    setPromotions(rows)
    setSource(result.source)
    setSelected((current) => rows.find((promotion) => promotion.id === current?.id) || rows[0] || null)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const pendingCount = useMemo(() => promotions.filter((promotion) => statusLabel(promotion.status) === 'Pending').length, [promotions])
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const validate = () => {
    if (!form.name.trim() || !form.scope.trim()) return toast.error('Campaign name and target scope are required.'), false
    if (!form.fromDate || !form.toDate) return toast.error('Start date and end date are required.'), false
    if (form.fromDate > form.toDate) return toast.error('End date must be on or after the start date.'), false
    const discount = Number(form.discount)
    if (!Number.isFinite(discount) || discount < 0 || (form.type === 'percent' && discount > 100)) {
      toast.error(form.type === 'percent' ? 'Percentage discount must be between 0 and 100.' : 'Enter a valid discount value.')
      return false
    }
    if (!form.reason.trim()) return toast.error('Business reason is required.'), false
    return true
  }

  const saveCampaign = async (draft) => {
    if (!validate()) return
    const nextStatus = draft ? 'Draft' : 'Pending'
    const accepted = await confirm({
      title: draft ? 'Save campaign draft?' : 'Submit promotion request?',
      message: draft ? `Save “${form.name}” as a draft?` : `Submit “${form.name}” to the CEO for approval?`,
      confirmLabel: draft ? 'Save Draft' : 'Submit',
    })
    if (!accepted) return

    const code = `PR-${Date.now().toString().slice(-8)}`
    const payload = {
      code,
      name: form.name.trim(),
      scope: form.scope.trim(),
      discount: Number(form.discount),
      type: form.type,
      fromDate: form.fromDate,
      toDate: form.toDate,
      status: nextStatus,
    }

    setSaving(true)
    try {
      if (source === 'backend') {
        const created = await promotionService.create(payload)
        setPromotions((current) => [created, ...current])
        setSelected(created)
        if (!draft) {
          try {
            await approvalRequestService.create({
              code: `APR-${Date.now().toString().slice(-8)}`,
              type: 'Promotion Campaign',
              requester: 'DongLV - Administrator',
              target: `${created.code || code}: ${created.name || form.name.trim()}`,
              reqDate: isoDate(),
              status: 'Pending',
              note: form.reason.trim(),
            })
          } catch {
            toast.info('Campaign was saved, but the general approval notification could not be created.')
          }
        }
      } else {
        const created = { id: code, ...payload, requester: 'DongLV - Administrator', reason: form.reason.trim() }
        setPromotions((current) => [created, ...current])
        setSelected(created)
      }
      setForm(emptyForm)
      toast.success(draft ? 'Promotion campaign draft saved.' : 'Promotion request submitted to the CEO.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const duplicate = () => {
    if (!selected) return toast.error('Select a campaign from the list first.')
    setForm({
      name: `${selected.name || 'Campaign'} Copy`, scope: selected.scope || '',
      fromDate: selected.fromDate || selected.from || '', toDate: selected.toDate || selected.to || '',
      type: selected.type || 'percent', discount: selected.discount ?? 0, reason: '',
    })
    toast.info('Campaign details copied into the request form.')
  }

  const viewStatus = () => {
    if (!selected) return toast.error('Select a campaign from the list first.')
    toast.info(`${selected.code || selected.id}: ${statusLabel(selected.status)}.`)
  }

  return (
    <div>
      <PageHeader breadcrumb="Administration · 3.4.4" title="Promotion Campaign Request" subtitle="Create campaign requests and submit them for CEO approval." />

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card"><Spinner className="h-7 w-7" /></div>
      ) : (
        <>
          <div className="grid items-start gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <section className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div><h2 className="text-base font-bold text-slate-900">Promotion Request Status</h2><p className="mt-0.5 text-xs text-slate-500">Select a campaign to view or duplicate its request.</p></div>
                  <Badge tone="amber">{pendingCount} pending</Badge>
                </div>
                <DataTable
                  dense rows={promotions} onRowClick={setSelected}
                  empty={{ title: 'No promotion requests', subtitle: 'Create the first campaign request using the form.' }}
                  columns={[
                    { key: 'code', header: 'Req ID', render: (promotion) => <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-700"><span className={`h-2 w-2 rounded-full ${selected?.id === promotion.id ? 'bg-brand-500' : 'bg-slate-200'}`} />{promotion.code || promotion.id}</span> },
                    { key: 'name', header: 'Campaign', render: (promotion) => <span className="font-semibold text-slate-700">{promotion.name}</span> },
                    { key: 'period', header: 'Period', render: periodLabel },
                    { key: 'status', header: 'Status', render: (promotion) => <Badge tone={statusTone(promotion.status)} dot>{statusLabel(promotion.status)}</Badge> },
                  ]}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" icon={Eye} onClick={viewStatus}>View Status</Button>
                  <Button variant="secondary" icon={ClipboardCopy} onClick={duplicate}>Duplicate</Button>
                </div>
              </section>

              <Card>
                <CardHeader title="Validation / Approval Notes" icon={FileText} />
                <CardBody>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {['CEO approval is required before campaign activation.', 'Campaign date range must not overlap conflicting active campaigns.', 'Discount value must follow approved promotion policy.', 'Submitted requests will be stored as Pending Approval.'].map((note) => (
                      <li key={note} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" /><span>{note}</span></li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader title="Create Promotion Campaign Request" subtitle="Complete all campaign details before submitting" icon={BadgePercent} />
                <CardBody>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Campaign Name" required><Input value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Weekend Dairy Sale" maxLength={150} /></Field>
                    <Field label="Target Scope" required><Input value={form.scope} onChange={(event) => setField('scope', event.target.value)} placeholder="Category: Dairy Products" maxLength={120} /></Field>
                    <Field label="Start Date" required><Input type="date" value={form.fromDate} onChange={(event) => setField('fromDate', event.target.value)} /></Field>
                    <Field label="End Date" required><Input type="date" value={form.toDate} onChange={(event) => setField('toDate', event.target.value)} min={form.fromDate || undefined} /></Field>
                    <Field label="Discount Type"><Select value={form.type} onChange={(event) => setField('type', event.target.value)}><option value="percent">Percentage Discount</option><option value="amount">Fixed Amount</option></Select></Field>
                    <Field label="Discount Value" required><Input type="number" min="0" max={form.type === 'percent' ? 100 : undefined} value={form.discount} onChange={(event) => setField('discount', event.target.value)} /></Field>
                  </div>
                  <Field label="Business Reason" required className="mt-4"><Textarea rows={4} value={form.reason} onChange={(event) => setField('reason', event.target.value)} placeholder="Increase loyalty member purchase volume during the promotion period." maxLength={512} /></Field>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                    <Button icon={Send} onClick={() => saveCampaign(false)} loading={saving}>Submit Request</Button>
                    <Button variant="secondary" icon={Save} onClick={() => saveCampaign(true)} loading={saving}>Save Draft</Button>
                    <Button variant="secondary" icon={RotateCcw} onClick={() => setForm(emptyForm)} disabled={saving}>Reset</Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Request Summary" icon={FileText} />
                <CardBody className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-800">Requester:</span> DongLV</p>
                  <p><span className="font-semibold text-slate-800">Request Type:</span> Promotion Campaign</p>
                  <p><span className="font-semibold text-slate-800">Approval Target:</span> CEO</p>
                  <p><span className="font-semibold text-slate-800">Expected status after submit:</span> Pending Approval</p>
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.4.4 Promotion Campaign Request · campaigns require CEO approval before activation</div>
        </>
      )}
    </div>
  )
}
