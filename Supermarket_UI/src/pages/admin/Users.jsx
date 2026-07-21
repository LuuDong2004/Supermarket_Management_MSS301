import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import {
  Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner, StatusBadge, } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { isoDate, roleLabel } from '../../lib/format.js'
import {
  approvalRequestService, toList, userService, withFallback } from '../../services/index.js'
import { Edit3, Info, Lock, RotateCcw, Search, Unlock, UserPlus } from 'lucide-react'

const ROLES = [
  'ROLE_CASHIER',
  'ROLE_WAREHOUSE_MANAGER',
  'ROLE_WAREHOUSE_STAFF',
  'ROLE_STAFF_MANAGER',
  'ROLE_ADMIN',
  'ROLE_CEO',
]

const emptyForm = {
  fullName: '',
  role: 'ROLE_CASHIER',
  status: 'ACTIVE',
  approval: 'PENDING',
}

const normalizeRole = (role) => {
  if (!role) return 'ROLE_CASHIER'
  return role.startsWith('ROLE_') ? role : `ROLE_${role}`
}

const toBackendRole = (role) => (role || '').replace(/^ROLE_/, '')

const normalizeUser = (user) => ({
  ...user,
  role: normalizeRole(user.role),
  status: user.status || 'ACTIVE',
  approval: user.approval || 'APPROVED',
})

const approvalTone = (status) => {
  if (status === 'APPROVED') return 'green'
  if (status === 'REJECTED') return 'red'
  return 'amber'
}

export default function Users() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [approval, setApproval] = useState('')
  const [applied, setApplied] = useState({ search: '', role: '', status: '', approval: '' })

  const selectUser = (user) => {
    setSelected(user)
    setForm({
      fullName: user.fullName || '',
      role: normalizeRole(user.role),
      status: user.status || 'ACTIVE',
      approval: user.approval || 'APPROVED',
    })
  }

  const load = async () => {
    setLoading(true)
    const result = await withFallback(() => userService.list({ page: 0, size: 50 }))
    const nextUsers = toList(result.data).map(normalizeUser)
    setUsers(nextUsers)
    setSource(result.source)
    if (nextUsers.length) selectUser(nextUsers[0])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const query = applied.search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch = !query
        || (user.username || '').toLowerCase().includes(query)
        || (user.fullName || '').toLowerCase().includes(query)
        || String(user.id || '').toLowerCase().includes(query)
      return matchesSearch
        && (!applied.role || normalizeRole(user.role) === applied.role)
        && (!applied.status || user.status === applied.status)
        && (!applied.approval || user.approval === applied.approval)
    })
  }, [applied, users])

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const applyFilters = () => setApplied({ search, role, status, approval })

  const resetFilters = () => {
    setSearch('')
    setRole('')
    setStatus('')
    setApproval('')
    setApplied({ search: '', role: '', status: '', approval: '' })
  }

  const updateLocalUser = (id, changes) => {
    setUsers((current) => current.map((user) => (
      String(user.id) === String(id) ? { ...user, ...changes } : user
    )))
    setSelected((current) => (current && String(current.id) === String(id)
      ? { ...current, ...changes }
      : current))
  }

  const submitRoleApproval = async () => {
    const code = `AR-${Date.now().toString().slice(-10)}`
    await approvalRequestService.create({
      code,
      type: 'Role Change',
      requester: 'Administrator',
      target: `${selected.username || selected.fullName}: ${roleLabel(selected.role)} → ${roleLabel(form.role)}`,
      reqDate: isoDate(),
      status: 'Pending',
      note: 'Role/permission change submitted from Manage User Accounts.',
    })
  }

  const editAccount = async () => {
    if (!selected) {
      toast.error('Select an account from the list first.')
      return
    }
    if (!form.fullName.trim()) {
      toast.error('Full name is required.')
      return
    }

    const roleChanged = normalizeRole(selected.role) !== form.role
    const accepted = await confirm({
      title: roleChanged ? 'Submit account changes?' : 'Update account?',
      message: roleChanged
        ? `The role change for ${selected.username} will be sent to the CEO for approval.`
        : `Save the account information for ${selected.username}?`,
      confirmLabel: roleChanged ? 'Submit' : 'Save',
    })
    if (!accepted) return

    setSaving(true)
    try {
      if (source === 'backend') {
        await userService.update(selected.id, {
          fullName: form.fullName.trim(),
          phone: selected.phone || '',
          role: toBackendRole(roleChanged ? selected.role : form.role),
          status: form.status,
        })
        if (roleChanged) await submitRoleApproval()
      }

      const changes = {
        fullName: form.fullName.trim(),
        status: form.status,
        approval: roleChanged ? 'PENDING' : form.approval,
        ...(roleChanged ? {} : { role: form.role }),
      }
      updateLocalUser(selected.id, changes)
      setForm((current) => ({ ...current, ...changes }))
      toast.success(roleChanged
        ? 'Account updated and the role change was sent to the CEO.'
        : 'Account information updated successfully.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleLock = async () => {
    if (!selected) {
      toast.error('Select an account from the list first.')
      return
    }
    const isLocked = selected.status === 'LOCKED'
    const accepted = await confirm({
      title: isLocked ? 'Unlock account?' : 'Lock account?',
      message: `${selected.fullName || selected.username} will be ${isLocked ? 'allowed to sign in again' : 'blocked from signing in'}.`,
      confirmLabel: isLocked ? 'Unlock' : 'Lock',
      danger: !isLocked,
    })
    if (!accepted) return

    setSaving(true)
    try {
      if (source === 'backend') {
        await (isLocked ? userService.unlock(selected.id) : userService.lock(selected.id))
      }
      const nextStatus = isLocked ? 'ACTIVE' : 'LOCKED'
      updateLocalUser(selected.id, { status: nextStatus })
      setForm((current) => ({ ...current, status: nextStatus }))
      toast.success(`Account ${isLocked ? 'unlocked' : 'locked'} successfully.`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Administration · 3.4.1"
        title="Manage User Accounts"
        subtitle="Search accounts, maintain account status, and submit role changes for CEO approval."
      />

      <FilterBar className="mb-6">
        <Field label="Search User" className="grow">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Name / username"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
            />
          </div>
        </Field>
        <Field label="Role">
          <Select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="">Select</option>
            {ROLES.map((item) => <option key={item} value={item}>{roleLabel(item)}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="LOCKED">Locked</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </Select>
        </Field>
        <Field label="Approval">
          <Select value={approval} onChange={(event) => setApproval(event.target.value)}>
            <option value="">Required?</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
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
                <h2 className="text-base font-bold text-slate-900">User Account List</h2>
                <p className="mt-0.5 text-xs text-slate-500">Select a row to load it into the account form.</p>
              </div>
              <Badge tone="slate">{rows.length} accounts</Badge>
            </div>
            <DataTable
              dense
              rows={rows}
              onRowClick={selectUser}
              empty={{ title: 'No accounts found', subtitle: 'Try changing the filters above.' }}
              columns={[
                {
                  key: 'id',
                  header: 'User ID',
                  render: (user, index) => (
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${String(selected?.id) === String(user.id) ? 'bg-brand-500' : 'bg-slate-200'}`} />
                      {String(user.id || index + 1).slice(0, 8)}
                    </span>
                  ),
                },
                { key: 'fullName', header: 'Full Name' },
                { key: 'role', header: 'Role', render: (user) => roleLabel(normalizeRole(user.role)) },
                { key: 'status', header: 'Status', render: (user) => <StatusBadge status={user.status} /> },
                {
                  key: 'approval',
                  header: 'Approval',
                  render: (user) => <Badge tone={approvalTone(user.approval)}>{user.approval}</Badge>,
                },
              ]}
            />
          </section>

          <Card className="xl:col-span-2">
            <CardHeader
              title="Account Form"
              subtitle={selected ? `Selected: ${selected.username || selected.id}` : 'Select an account to edit'}
              icon={Edit3}
            />
            <CardBody className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Field label="Full Name" required>
                  <Input
                    placeholder="Employee name"
                    value={form.fullName}
                    onChange={(event) => setField('fullName', event.target.value)}
                    disabled={!selected}
                  />
                </Field>
                <Field label="Role">
                  <Select value={form.role} onChange={(event) => setField('role', event.target.value)} disabled={!selected}>
                    {ROLES.map((item) => <option key={item} value={item}>{roleLabel(item)}</option>)}
                  </Select>
                </Field>
                <Field label="Account Status">
                  <Select value={form.status} onChange={(event) => setField('status', event.target.value)} disabled={!selected}>
                    <option value="ACTIVE">Active</option>
                    <option value="LOCKED">Locked</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                  </Select>
                </Field>
                <Field label="Approval Status">
                  <Select value={form.approval} onChange={(event) => setField('approval', event.target.value)} disabled={!selected}>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </Select>
                </Field>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-bold text-slate-800">CEO Approval Notice</h3>
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Info size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Role/permission changes require approval</p>
                    <p className="mt-1 text-xs leading-5 text-amber-700">Changes are submitted to the CEO and only take effect after approval.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                <Button icon={UserPlus} onClick={() => navigate('/app/admin/users/new')}>Create</Button>
                <Button variant="secondary" icon={Edit3} onClick={editAccount} loading={saving} disabled={!selected}>Edit</Button>
                <Button
                  variant={selected?.status === 'LOCKED' ? 'success' : 'secondary'}
                  icon={selected?.status === 'LOCKED' ? Unlock : Lock}
                  onClick={toggleLock}
                  loading={saving}
                  disabled={!selected}
                >
                  {selected?.status === 'LOCKED' ? 'Unlock' : 'Lock/Unlock'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  )
}
