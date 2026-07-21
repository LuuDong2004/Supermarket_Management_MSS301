import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Input,
  Select,
  Spinner,
  StatusBadge,
} from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatDate, isoDate } from '../../lib/format.js'
import { attendanceService, mockAttendance, toList, withFallback } from '../../services/index.js'
import { CalendarCheck, RotateCcw, Search, Send, X } from 'lucide-react'

const emptyForm = {
  employee: '',
  date: isoDate(),
  checkIn: '',
  checkOut: '',
  status: 'ON_TIME',
}

const emptyFilters = {
  search: '',
  status: '',
  type: '',
  dateFrom: '',
  dateTo: '',
}

const statusKey = (status = '') => {
  const value = status.toLowerCase()
  if (value.includes('absent') || value.includes('vắng')) return 'ABSENT'
  if (value.includes('late') || value.includes('muộn')) return 'LATE'
  if (value.includes('pending') || value.includes('chờ')) return 'PENDING'
  if (value.includes('approved') || value.includes('duyệt')) return 'APPROVED'
  return 'ON_TIME'
}

const statusLabel = (status) => ({
  ON_TIME: 'On Time',
  LATE: 'Late',
  ABSENT: 'Absent',
  PENDING: 'Pending',
  APPROVED: 'Approved',
}[statusKey(status)] || status || 'On Time')

const toBackendStatus = (status) => ({
  ON_TIME: 'Đúng giờ',
  LATE: 'Đi muộn',
  ABSENT: 'Vắng',
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
}[status] || status)

const recordType = (record) => {
  if (!record.checkIn && !record.checkOut) return 'ABSENT'
  if (record.checkIn && record.checkOut) return 'COMPLETE'
  return 'OPEN'
}

const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const [inHour, inMinute] = checkIn.split(':').map(Number)
  const [outHour, outMinute] = checkOut.split(':').map(Number)
  if ([inHour, inMinute, outHour, outMinute].some(Number.isNaN)) return 0
  let minutes = (outHour * 60 + outMinute) - (inHour * 60 + inMinute)
  if (minutes < 0) minutes += 24 * 60
  return Math.round(minutes / 60)
}

export default function Attendance() {
  const toast = useToast()
  const confirm = useConfirm()

  const [records, setRecords] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => attendanceService.list(), mockAttendance)
    setRecords(toList(result.data))
    setSource(result.source)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return records.filter((record) => {
      const matchesSearch = !query || [record.code, record.id, record.employee]
        .some((value) => String(value || '').toLowerCase().includes(query))
      return matchesSearch
        && (!applied.status || statusKey(record.status) === applied.status)
        && (!applied.type || recordType(record) === applied.type)
        && (!applied.dateFrom || record.date >= applied.dateFrom)
        && (!applied.dateTo || record.date <= applied.dateTo)
    })
  }, [applied, records])

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))

  const selectRecord = (record) => {
    setSelected(record)
    setForm({
      employee: record.employee || '',
      date: record.date || isoDate(),
      checkIn: record.checkIn || '',
      checkOut: record.checkOut || '',
      status: statusKey(record.status),
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

  const saveRecord = async () => {
    if (!form.employee.trim() || !form.date) {
      toast.error('Employee and attendance date are required.')
      return
    }
    if (form.status !== 'ABSENT' && !form.checkIn) {
      toast.error('Check-in time is required unless the employee is absent.')
      return
    }

    const accepted = await confirm({
      title: selected ? 'Update attendance record?' : 'Create attendance record?',
      message: selected
        ? `Save attendance changes for ${form.employee}?`
        : `Record attendance for ${form.employee} on ${formatDate(form.date)}?`,
      confirmLabel: 'Submit',
    })
    if (!accepted) return

    const payload = {
      code: selected?.code || (selected?.id ? String(selected.id) : `AT-${Date.now()}`),
      employee: form.employee.trim(),
      date: form.date,
      checkIn: form.status === 'ABSENT' ? '' : form.checkIn,
      checkOut: form.status === 'ABSENT' ? '' : form.checkOut,
      hours: form.status === 'ABSENT' ? 0 : calculateHours(form.checkIn, form.checkOut),
      status: toBackendStatus(form.status),
    }

    setSaving(true)
    try {
      let saved
      if (source === 'backend') {
        saved = selected
          ? await attendanceService.update(selected.id, payload)
          : await attendanceService.create(payload)
      } else {
        saved = { id: selected?.id || payload.code, ...payload }
      }

      setRecords((current) => selected
        ? current.map((record) => record.id === selected.id ? saved : record)
        : [saved, ...current])
      setSelected(null)
      setForm(emptyForm)
      toast.success(selected ? 'Attendance record updated.' : 'Attendance record created.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Staff Management · 3.5.2"
        title="Manage Attendance Records and Reports"
        subtitle="Maintain daily check-in records and prepare attendance reports."
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
            <option value="ON_TIME">On Time</option>
            <option value="LATE">Late</option>
            <option value="ABSENT">Absent</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
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
            <option value="COMPLETE">Complete Shift</option>
            <option value="OPEN">Open Shift</option>
            <option value="ABSENT">Absent Record</option>
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
                <h2 className="text-base font-bold text-slate-900">Attendance Records</h2>
                <p className="mt-0.5 text-xs text-slate-500">Select a row to edit its attendance details.</p>
              </div>
              <Badge tone="slate">{rows.length} records</Badge>
            </div>
            <DataTable
              dense
              rows={rows}
              onRowClick={selectRecord}
              empty={{ title: 'No attendance records found', subtitle: 'Try changing the filters or create a new record.' }}
              columns={[
                {
                  key: 'employee',
                  header: 'Employee',
                  render: (record) => (
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${selected?.id === record.id ? 'bg-brand-500' : 'bg-slate-200'}`} />
                      {record.employee}
                    </span>
                  ),
                },
                { key: 'date', header: 'Date', render: (record) => formatDate(record.date) },
                { key: 'checkIn', header: 'Check-in', render: (record) => <span className="font-mono text-xs">{record.checkIn || '—'}</span> },
                { key: 'checkOut', header: 'Check-out', render: (record) => <span className="font-mono text-xs">{record.checkOut || '—'}</span> },
                { key: 'status', header: 'Status', render: (record) => <StatusBadge status={statusLabel(record.status)} /> },
              ]}
            />
          </section>

          <Card className="xl:col-span-2">
            <CardHeader
              title="Attendance Detail"
              subtitle={selected ? `Editing ${selected.code || selected.id}` : 'Create a new attendance record'}
              icon={CalendarCheck}
            />
            <CardBody className="flex min-h-[22rem] flex-col">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Field label="Employee" required>
                  <Input placeholder="Search" value={form.employee} onChange={(event) => setField('employee', event.target.value)} maxLength={150} />
                </Field>
                <Field label="Date" required>
                  <Input type="date" value={form.date} onChange={(event) => setField('date', event.target.value)} />
                </Field>
                <Field label="Check-in Time">
                  <Input type="time" value={form.checkIn} onChange={(event) => setField('checkIn', event.target.value)} disabled={form.status === 'ABSENT'} />
                </Field>
                <Field label="Check-out Time">
                  <Input type="time" value={form.checkOut} onChange={(event) => setField('checkOut', event.target.value)} disabled={form.status === 'ABSENT'} />
                </Field>
                <Field label="Attendance Status">
                  <Select value={form.status} onChange={(event) => setField('status', event.target.value)}>
                    <option value="ON_TIME">On Time</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                  </Select>
                </Field>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <Button icon={Send} onClick={saveRecord} loading={saving}>Submit</Button>
                <Button variant="secondary" icon={X} onClick={cancelForm} disabled={saving}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {!loading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">
          3.5.2 Attendance Records and Reports · work hours are calculated from check-in and check-out times
        </div>
      )}
    </div>
  )
}
