import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import {
  Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, StatusBadge, } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { isoDate, roleLabel } from '../../lib/format.js'
import { employeeService, toList, withFallback } from '../../services/index.js'
import { Eye, RotateCcw, Search, Send, UserRound, X } from 'lucide-react'

const POSITIONS = [
  'ROLE_CASHIER',
  'ROLE_WAREHOUSE_MANAGER',
  'ROLE_WAREHOUSE_STAFF',
  'ROLE_STAFF_MANAGER',
]

const emptyForm = {
  code: '',
  name: '',
  role: 'ROLE_CASHIER',
  status: 'ACTIVE',
}

const emptyFilters = {
  search: '',
  status: '',
  role: '',
  dateFrom: '',
  dateTo: '',
}

const normalizeRole = (role) => {
  if (!role) return 'ROLE_CASHIER'
  return role.startsWith('ROLE_') ? role : `ROLE_${role}`
}

const statusKey = (status = '') => {
  const value = status.toLowerCase()
  if (value.includes('inactive') || value.includes('nghỉ việc')) return 'INACTIVE'
  if (value.includes('leave') || value.includes('tạm nghỉ')) return 'ON_LEAVE'
  if (value.includes('pending') || value.includes('chờ')) return 'PENDING'
  return 'ACTIVE'
}

const statusLabel = (status) => ({
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
}[statusKey(status)] || status || 'Active')

const toBackendStatus = (status) => ({
  ACTIVE: 'Đang làm',
  ON_LEAVE: 'Tạm nghỉ',
  INACTIVE: 'Nghỉ việc',
  PENDING: 'Chờ duyệt',
}[status] || status)

const departmentForRole = (role) => ({
  ROLE_CASHIER: 'Sales / POS',
  ROLE_WAREHOUSE_MANAGER: 'Warehouse',
  ROLE_WAREHOUSE_STAFF: 'Warehouse',
  ROLE_STAFF_MANAGER: 'Human Resources',
}[role] || 'Operations')

export default function Employees() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [employees, setEmployees] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => employeeService.list({ size: 200 }))
    setEmployees(toList(result.data))
    setSource(result.source)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return employees.filter((employee) => {
      const employeeDate = employee.joined || ''
      const matchesSearch = !query || [employee.code, employee.id, employee.name, employee.dept]
        .some((value) => String(value || '').toLowerCase().includes(query))
      return matchesSearch
        && (!applied.status || statusKey(employee.status) === applied.status)
        && (!applied.role || normalizeRole(employee.role) === applied.role)
        && (!applied.dateFrom || employeeDate >= applied.dateFrom)
        && (!applied.dateTo || employeeDate <= applied.dateTo)
    })
  }, [applied, employees])

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const selectEmployee = (employee) => {
    setSelected(employee)
    setForm({
      code: employee.code || employee.id || '',
      name: employee.name || '',
      role: normalizeRole(employee.role),
      status: statusKey(employee.status),
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

  const saveEmployee = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error('Employee code and full name are required.')
      return
    }

    const accepted = await confirm({
      title: selected ? 'Update employee profile?' : 'Create employee profile?',
      message: selected
        ? `Save changes to ${form.name}?`
        : `Create a new employee profile for ${form.name}?`,
      confirmLabel: 'Submit',
    })
    if (!accepted) return

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      role: form.role,
      dept: selected?.dept || departmentForRole(form.role),
      joined: selected?.joined || isoDate(),
      phone: selected?.phone || '',
      status: toBackendStatus(form.status),
      salary: selected?.salary ?? null,
    }

    setSaving(true)
    try {
      if (source === 'backend') {
        const saved = selected
          ? await employeeService.update(selected.id, payload)
          : await employeeService.create(payload)
        setEmployees((current) => selected
          ? current.map((employee) => employee.id === selected.id ? saved : employee)
          : [saved, ...current])
        setSelected(saved)
      } else if (selected) {
        const saved = { ...selected, ...payload }
        setEmployees((current) => current.map((employee) => employee.id === selected.id ? saved : employee))
        setSelected(saved)
      } else {
        const saved = { id: form.code.trim(), ...payload }
        setEmployees((current) => [saved, ...current])
        setSelected(saved)
      }
      setForm(emptyForm)
      setSelected(null)
      toast.success(selected ? 'Employee profile updated.' : 'Employee profile created.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Staff Management · 3.5.1"
        title="Manage Employee Profile and Work History"
        subtitle="Maintain employee profiles and review employment records."
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
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </Select>
        </Field>
        <Field label="Date" className="grow">
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} placeholder="From" />
            <Input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} placeholder="To" min={filters.dateFrom || undefined} />
          </div>
        </Field>
        <Field label="Type">
          <Select value={filters.role} onChange={(event) => setFilter('role', event.target.value)}>
            <option value="">All</option>
            {POSITIONS.map((position) => <option key={position} value={position}>{roleLabel(position)}</option>)}
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
                <h2 className="text-base font-bold text-slate-900">Employee List</h2>
                <p className="mt-0.5 text-xs text-slate-500">Select an employee to edit the profile.</p>
              </div>
              <Badge tone="slate">{rows.length} employees</Badge>
            </div>
            <DataTable
              dense
              rows={rows}
              onRowClick={selectEmployee}
              empty={{ title: 'No employees found', subtitle: 'Try changing the filters or create a new profile.' }}
              columns={[
                {
                  key: 'code',
                  header: 'Emp Code',
                  render: (employee) => (
                    <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${selected?.id === employee.id ? 'bg-brand-500' : 'bg-slate-200'}`} />
                      {employee.code || String(employee.id).slice(0, 8)}
                    </span>
                  ),
                },
                { key: 'name', header: 'Full Name', render: (employee) => <span className="font-semibold text-slate-700">{employee.name}</span> },
                { key: 'role', header: 'Position', render: (employee) => roleLabel(normalizeRole(employee.role)) },
                { key: 'status', header: 'Status', render: (employee) => <StatusBadge status={statusLabel(employee.status)} /> },
                {
                  key: 'history',
                  header: 'Work History',
                  render: (employee) => (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Eye}
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/app/hr/employees/${employee.id}`)
                      }}
                    >
                      View
                    </Button>
                  ),
                },
              ]}
            />
          </section>

          <Card className="xl:col-span-2">
            <CardHeader
              title="Employee Profile"
              subtitle={selected ? `Editing ${selected.code || selected.id}` : 'Create a new employee profile'}
              icon={UserRound}
            />
            <CardBody className="flex min-h-[22rem] flex-col">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Field label="Employee Code" required>
                  <Input
                    placeholder="Required"
                    value={form.code}
                    onChange={(event) => setField('code', event.target.value)}
                    disabled={!!selected}
                    maxLength={50}
                  />
                </Field>
                <Field label="Full Name" required>
                  <Input placeholder="Required" value={form.name} onChange={(event) => setField('name', event.target.value)} maxLength={150} />
                </Field>
                <Field label="Position">
                  <Select value={form.role} onChange={(event) => setField('role', event.target.value)}>
                    {POSITIONS.map((position) => <option key={position} value={position}>{roleLabel(position)}</option>)}
                  </Select>
                </Field>
                <Field label="Employment Status">
                  <Select value={form.status} onChange={(event) => setField('status', event.target.value)}>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                  </Select>
                </Field>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <Button icon={Send} onClick={saveEmployee} loading={saving}>Submit</Button>
                <Button variant="secondary" icon={X} onClick={cancelForm} disabled={saving}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {!loading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">
          3.5.1 Employee Profile and Work History · profile changes are retained in the employee record
        </div>
      )}
    </div>
  )
}
