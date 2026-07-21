import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import {
  Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatDate, isoDate } from '../../lib/format.js'
import {
  approvalRequestService, reportService, toList, withFallback } from '../../services/index.js'
import { Award, RotateCcw, Search, Send, X } from 'lucide-react'

const firstOfMonth = () => {
  const now = new Date()
  return isoDate(new Date(now.getFullYear(), now.getMonth(), 1))
}

const emptyForm = {
  employee: '',
  periodFrom: firstOfMonth(),
  periodTo: isoDate(),
  criteria: 'COMPREHENSIVE',
  recommendation: 'REWARD',
}

const emptyFilters = {
  search: '',
  status: '',
  type: '',
  dateFrom: '',
  dateTo: '',
}

const normalizeRow = (row) => ({
  ...row,
  name: row.name || row.employee || 'Unknown employee',
  periodFrom: row.periodFrom || firstOfMonth(),
  periodTo: row.periodTo || isoDate(),
  recommendation: row.recommendation || 'Not Evaluated',
  status: row.status || 'Active',
})

const statusKey = (status = '') => {
  const value = status.toLowerCase()
  if (value.includes('approved')) return 'APPROVED'
  if (value.includes('rejected')) return 'REJECTED'
  if (value.includes('pending')) return 'PENDING'
  return 'ACTIVE'
}

const statusTone = (status) => ({
  APPROVED: 'green',
  REJECTED: 'red',
  PENDING: 'amber',
  ACTIVE: 'blue',
}[statusKey(status)] || 'slate')

const scoreTone = (score) => {
  if (Number(score) >= 90) return 'green'
  if (Number(score) >= 80) return 'brand'
  if (Number(score) >= 70) return 'amber'
  return 'red'
}

const recommendationLabel = (value) => ({
  REWARD: 'Reward',
  SALARY_INCREASE: 'Salary Increase',
  MAINTAIN: 'Maintain',
  IMPROVEMENT_PLAN: 'Improvement Plan',
}[value] || value || 'Not Evaluated')

const criteriaLabel = (value) => ({
  COMPREHENSIVE: 'Comprehensive score table',
  SALES_ACCURACY: 'Sales and accuracy score',
  ATTENDANCE_HOURS: 'Attendance and working hours',
}[value] || value)

const periodLabel = (row) => `${formatDate(row.periodFrom)} – ${formatDate(row.periodTo)}`

export default function Performance() {
  const toast = useToast()
  const confirm = useConfirm()

  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await withFallback(() => reportService.employeePerformance())
      setReports(toList(result.data).map(normalizeRow))
      setSource(result.source)
      setLoading(false)
    }
    load()
  }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return reports.filter((report) => {
      const matchesSearch = !query || [report.name, report.recommendation, report.score]
        .some((value) => String(value || '').toLowerCase().includes(query))
      return matchesSearch
        && (!applied.status || statusKey(report.status) === applied.status)
        && (!applied.type || report.recommendation === recommendationLabel(applied.type))
        && (!applied.dateFrom || report.periodTo >= applied.dateFrom)
        && (!applied.dateTo || report.periodFrom <= applied.dateTo)
    })
  }, [applied, reports])

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const selectReport = (report) => {
    setSelected(report)
    const recommendation = Object.entries({
      REWARD: 'Reward',
      SALARY_INCREASE: 'Salary Increase',
      MAINTAIN: 'Maintain',
      IMPROVEMENT_PLAN: 'Improvement Plan',
    }).find(([, label]) => label === report.recommendation)?.[0] || 'REWARD'
    setForm({
      employee: report.name,
      periodFrom: report.periodFrom,
      periodTo: report.periodTo,
      criteria: report.criteria || 'COMPREHENSIVE',
      recommendation,
    })
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
    setApplied(emptyFilters)
  }

  const cancelForm = () => {
    setSelected(null)
    setForm(emptyForm)
  }

  const submitEvaluation = async () => {
    if (!form.employee.trim() || !form.periodFrom || !form.periodTo) {
      toast.error('Employee and evaluation period are required.')
      return
    }
    if (form.periodFrom > form.periodTo) {
      toast.error('Evaluation period end must be on or after the start date.')
      return
    }

    const report = selected || reports.find((item) => item.name.toLowerCase() === form.employee.trim().toLowerCase())
    if (!report) {
      toast.error('Select an employee from the performance report list.')
      return
    }

    const recommendation = recommendationLabel(form.recommendation)
    const requiresApproval = ['REWARD', 'SALARY_INCREASE'].includes(form.recommendation)
    const accepted = await confirm({
      title: 'Submit performance evaluation?',
      message: requiresApproval
        ? `Submit the ${recommendation} recommendation for ${report.name} for approval?`
        : `Save the ${recommendation} evaluation for ${report.name}?`,
      confirmLabel: 'Submit',
    })
    if (!accepted) return

    setSaving(true)
    try {
      if (requiresApproval && source === 'backend') {
        await approvalRequestService.create({
          code: `PERF-${Date.now().toString().slice(-8)}`,
          type: 'Performance Recommendation',
          requester: 'Staff Manager',
          target: `${report.name}: ${recommendation}`,
          reqDate: isoDate(),
          status: 'Pending',
          note: `${criteriaLabel(form.criteria)}; score ${report.score ?? 0}/100; period ${form.periodFrom} to ${form.periodTo}.`,
        })
      }

      const updated = {
        ...report,
        periodFrom: form.periodFrom,
        periodTo: form.periodTo,
        criteria: form.criteria,
        recommendation,
        status: requiresApproval ? 'Pending' : 'Active',
      }
      setReports((current) => current.map((item) => item.name === report.name ? updated : item))
      setSelected(null)
      setForm(emptyForm)
      toast.success(requiresApproval ? 'Evaluation submitted for approval.' : 'Performance evaluation saved.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Staff Management · 3.5.3"
        title="Evaluate Performance and Recommend Reward or Salary"
        subtitle="Review employee scores and submit performance recommendations."
      />

      <FilterBar className="mb-6">
        <Field label="Search" className="grow">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Keyword"
              value={filters.search}
              onChange={(event) => setFilter('search', event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && setApplied(filters)}
            />
          </div>
        </Field>
        <Field label="Status">
          <Select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        </Field>
        <Field label="Date" className="grow">
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} placeholder="From" />
            <Input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} placeholder="To" min={filters.dateFrom || undefined} />
          </div>
        </Field>
        <Field label="Type">
          <Select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}>
            <option value="">All</option>
            <option value="REWARD">Reward</option>
            <option value="SALARY_INCREASE">Salary Increase</option>
            <option value="MAINTAIN">Maintain</option>
            <option value="IMPROVEMENT_PLAN">Improvement Plan</option>
          </Select>
        </Field>
        <div className="flex !basis-auto !grow-0 gap-2">
          <Button onClick={() => setApplied(filters)}>Apply</Button>
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
                <h2 className="text-base font-bold text-slate-900">Performance Report List</h2>
                <p className="mt-0.5 text-xs text-slate-500">Select an employee to prepare an evaluation.</p>
              </div>
              <Badge tone="slate">{rows.length} reports</Badge>
            </div>
            <DataTable
              dense
              rows={rows}
              rowKey="name"
              onRowClick={selectReport}
              empty={{ title: 'No performance reports found', subtitle: 'Try changing the filters.' }}
              columns={[
                {
                  key: 'name',
                  header: 'Employee',
                  render: (report) => (
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${selected?.name === report.name ? 'bg-brand-500' : 'bg-slate-200'}`} />
                      {report.name}
                    </span>
                  ),
                },
                { key: 'period', header: 'Period', render: periodLabel },
                { key: 'score', header: 'Score', render: (report) => <Badge tone={scoreTone(report.score)}>{report.score ?? 0} / 100</Badge> },
                { key: 'recommendation', header: 'Recommendation' },
                { key: 'status', header: 'Status', render: (report) => <Badge tone={statusTone(report.status)} dot>{report.status}</Badge> },
              ]}
            />
          </section>

          <Card className="xl:col-span-2">
            <CardHeader
              title="Evaluation Form"
              subtitle={selected ? `Current score: ${selected.score ?? 0}/100` : 'Select an employee report'}
              icon={Award}
            />
            <CardBody className="flex min-h-[22rem] flex-col">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Field label="Employee" required>
                  <Input placeholder="Search" value={form.employee} onChange={(event) => setField('employee', event.target.value)} />
                </Field>
                <Field label="Evaluation Period" required>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" value={form.periodFrom} onChange={(event) => setField('periodFrom', event.target.value)} placeholder="From" />
                    <Input type="date" value={form.periodTo} onChange={(event) => setField('periodTo', event.target.value)} placeholder="To" min={form.periodFrom || undefined} />
                  </div>
                </Field>
                <Field label="Performance Criteria">
                  <Select value={form.criteria} onChange={(event) => setField('criteria', event.target.value)}>
                    <option value="COMPREHENSIVE">Comprehensive Score Table</option>
                    <option value="SALES_ACCURACY">Sales & Accuracy</option>
                    <option value="ATTENDANCE_HOURS">Attendance & Hours</option>
                  </Select>
                </Field>
                <Field label="Recommendation Type">
                  <Select value={form.recommendation} onChange={(event) => setField('recommendation', event.target.value)}>
                    <option value="REWARD">Reward</option>
                    <option value="SALARY_INCREASE">Salary Increase</option>
                    <option value="MAINTAIN">Maintain</option>
                    <option value="IMPROVEMENT_PLAN">Improvement Plan</option>
                  </Select>
                </Field>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <Button icon={Send} onClick={submitEvaluation} loading={saving}>Submit</Button>
                <Button variant="secondary" icon={X} onClick={cancelForm} disabled={saving}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {!loading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">
          3.5.3 Performance Evaluation · reward and salary recommendations are submitted for approval
        </div>
      )}
    </div>
  )
}
