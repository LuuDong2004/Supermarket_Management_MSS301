import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, Card, CardBody, CardHeader, Field, Input, Select, Spinner, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { policyService, withFallback, toList } from '../../services/index.js'
import { BookOpenCheck, FilePenLine, History, Plus, Save, Trash2 } from 'lucide-react'

const DEMO_POLICIES = [
  { id: '001', code: '001', name: 'Loyalty redemption', category: 'Milk', effective: 'Milk', updatedDate: '2026-01-12', value: 'Defines loyalty point redemption limits and eligible rewards.', status: 'Pending', currentStatus: 'Active' },
  { id: '002', code: '002', name: 'Rice pricing policy', category: 'Rice', effective: 'Rice', updatedDate: '2026-02-12', value: 'Controls pricing thresholds for the rice category.', status: 'Approved' },
  { id: '003', code: '003', name: 'Staff access policy', category: 'Staff A', effective: 'Staff A', updatedDate: '2026-03-12', value: 'Defines staff access and operational responsibility.', status: 'Active' },
  { id: '004', code: '004', name: 'Customer return policy', category: 'Customer B', effective: 'Customer B', updatedDate: '2026-04-12', value: 'Defines return eligibility for customer purchases.', status: 'Rejected' },
  { id: '005', code: '005', name: 'Supplier payment terms', category: 'Supplier C', effective: 'Supplier C', updatedDate: '2026-05-12', value: 'Defines supplier settlement and review terms.', status: 'Pending' },
  { id: '006', code: '006', name: 'Order approval threshold', category: 'Order D', effective: 'Order D', updatedDate: '2026-06-12', value: 'Defines executive approval thresholds for orders.', status: 'Approved' },
  { id: '007', code: '007', name: 'Dairy handling policy', category: 'Milk', effective: 'Milk', updatedDate: '2026-07-12', value: 'Defines handling requirements for dairy products.', status: 'Active' },
  { id: '008', code: '008', name: 'Dry goods review', category: 'Rice', effective: 'Rice', updatedDate: '2026-08-12', value: 'Defines dry-goods inspection and review criteria.', status: 'Rejected' },
]

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = () => ({
  code: '',
  name: '',
  category: '',
  effectiveDate: today(),
  status: 'Draft',
  description: '',
})

function policyForm(policy) {
  if (!policy) return emptyForm()
  return {
    code: policy.code || '',
    name: policy.name || '',
    category: policy.category || '',
    effectiveDate: policy.updatedDate || today(),
    status: policy.currentStatus || policy.status || 'Active',
    description: policy.value || '',
  }
}

function statusTone(status) {
  if (status === 'Approved' || status === 'Active') return 'green'
  if (status === 'Rejected') return 'red'
  if (status === 'Pending') return 'amber'
  return 'blue'
}

function shortDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Policies() {
  const toast = useToast()
  const confirm = useConfirm()
  const [policies, setPolicies] = useState([])
  const [source, setSource] = useState('backend')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const selectPolicy = (policy) => {
    setSelected(policy)
    setEditingId(policy?.id || null)
    setForm(policyForm(policy))
  }

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => policyService.list())
    const rows = result.source === 'backend'
      ? toList(result.data).map((policy) => ({ ...policy, status: policy.status || 'Active' }))
      : DEMO_POLICIES
    setPolicies(rows)
    setSource(result.source)
    const nextSelected = rows.find((policy) => policy.id === selected?.id) || rows[0] || null
    selectPolicy(nextSelected)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const policyTypes = useMemo(() => {
    const values = new Set(policies.map((policy) => policy.category).filter(Boolean))
    ;['Sales', 'Inventory', 'Loyalty', 'Purchasing'].forEach((value) => values.add(value))
    return [...values]
  }, [policies])

  const startNew = () => {
    setEditingId(null)
    setSelected(null)
    setForm(emptyForm())
  }

  const review = () => {
    if (!form.name.trim() || !form.category || !form.effectiveDate || !form.description.trim()) {
      toast.error('Complete all policy fields before review.')
      return
    }
    toast.info(`${editingId ? 'Update' : 'New policy'} ready for review: ${form.name.trim()} · ${form.status}.`)
  }

  const savePolicy = async () => {
    if (!form.name.trim() || !form.category || !form.effectiveDate || !form.description.trim()) {
      toast.error('Policy name, type, effective date, and description are required.')
      return
    }

    const existing = policies.find((policy) => policy.id === editingId)
    const isNew = !editingId
    const ok = await confirm({
      title: isNew ? 'Create policy?' : 'Update policy?',
      message: `${isNew ? 'Create' : 'Save changes to'} “${form.name.trim()}” with status ${form.status}?`,
      confirmLabel: 'Save',
    })
    if (!ok) return

    setSaving(true)
    const body = {
      code: form.code || `BP-${Date.now().toString().slice(-5)}`,
      name: form.name.trim(),
      value: form.description.trim(),
      category: form.category,
      updatedDate: form.effectiveDate,
    }

    if (source === 'backend') {
      try {
        if (isNew) await policyService.create(body)
        else await policyService.update(editingId, body)
        toast.success(isNew ? `Policy “${form.name.trim()}” was created.` : `Policy “${form.name.trim()}” was updated.`)
        await load()
        setSaving(false)
        return
      } catch (error) {
        toast.error(error.message || 'The policy could not be saved.')
        setSaving(false)
        return
      }
    }

    const localPolicy = {
      ...existing,
      ...body,
      id: existing?.id || body.code,
      status: form.status,
      currentStatus: form.status,
    }
    const nextPolicies = isNew
      ? [localPolicy, ...policies]
      : policies.map((policy) => policy.id === editingId ? localPolicy : policy)
    setPolicies(nextPolicies)
    selectPolicy(localPolicy)
    toast.success(isNew ? `Policy “${form.name.trim()}” was created.` : `Policy “${form.name.trim()}” was updated.`)
    setSaving(false)
  }

  const removePolicy = async () => {
    if (!selected) return
    const ok = await confirm({
      title: 'Delete policy?',
      message: `Policy “${selected.name}” will be permanently deleted.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return

    if (source === 'backend' && selected.id) {
      try {
        await policyService.remove(selected.id)
        toast.success(`Policy “${selected.name}” was deleted.`)
        await load()
        return
      } catch (error) {
        toast.error(error.message || 'The policy could not be deleted.')
        return
      }
    }

    const remaining = policies.filter((policy) => policy.id !== selected.id)
    setPolicies(remaining)
    selectPolicy(remaining[0] || null)
    toast.success(`Policy “${selected.name}” was deleted.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Executive · 3.3.3"
        title="Manage Business Policy"
        subtitle="Review, create, and update business rules used across supermarket operations."
        actions={<Button icon={Plus} onClick={startNew}>New Policy</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-5">
          <Card className="min-w-0 xl:col-span-2">
            <CardHeader title="Policy List" subtitle={`${policies.length} policies`} icon={BookOpenCheck} />
            <CardBody className="p-0">
              <DataTable
                className="rounded-none border-0 shadow-none"
                dense
                rows={policies}
                rowKey="id"
                onRowClick={selectPolicy}
                empty={{ title: 'No business policies', subtitle: 'Create a policy to get started.' }}
                columns={[
                  { key: 'code', header: 'Policy ID', render: (policy) => <span className="font-mono text-xs font-semibold text-slate-700">{policy.code || policy.id}</span> },
                  { key: 'category', header: 'Type' },
                  { key: 'effective', header: 'Effective', render: (policy) => policy.effective || shortDate(policy.updatedDate) },
                  { key: 'status', header: 'Status', render: (policy) => <Badge tone={statusTone(policy.status)} dot>{policy.status}</Badge> },
                ]}
              />
            </CardBody>
          </Card>

          <div className="space-y-6 xl:col-span-3">
            <Card className="min-h-44">
              <CardHeader
                title="Policy Detail"
                subtitle={selected ? selected.code || selected.id : 'New policy draft'}
                icon={History}
                action={selected ? <Button variant="ghost" size="sm" icon={Trash2} onClick={removePolicy}>Delete</Button> : null}
              />
              <CardBody>
                {selected ? (
                  <div className="space-y-3 text-sm">
                    <DetailRow label="Selected policy" value={selected.name} />
                    <DetailRow label="Current status" value={<Badge tone={statusTone(selected.currentStatus || selected.status)}>{selected.currentStatus || selected.status}</Badge>} />
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-600">
                      Version history is visible before update. Last effective date: {shortDate(selected.updatedDate)}.
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Enter the policy information below to create a new version.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Create / Update Policy" subtitle={editingId ? 'Editing selected policy' : 'Creating a new policy'} icon={FilePenLine} />
              <CardBody>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Policy Name" required>
                    <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter policy name" />
                  </Field>
                  <Field label="Policy Type" required>
                    <Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                      <option value="">Select type</option>
                      {policyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </Select>
                  </Field>
                  <Field label="Effective Date" required>
                    <Input type="date" value={form.effectiveDate} onChange={(event) => setForm({ ...form, effectiveDate: event.target.value })} />
                  </Field>
                  <Field label="Status">
                    <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending Review</option>
                    </Select>
                  </Field>
                  <Field label="Policy Description" required className="sm:col-span-2">
                    <Textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the policy rule, scope, and business effect" />
                  </Field>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button icon={BookOpenCheck} onClick={review}>Review</Button>
                  <Button variant="secondary" icon={Save} loading={saving} onClick={savePolicy}>Save</Button>
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
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 border-b border-slate-100 pb-2.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
