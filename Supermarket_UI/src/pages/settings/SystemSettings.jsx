import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { settingService, withFallback, toList } from '../../services/index.js'
import {
  Settings, Store, Plus, Pencil, Save,
} from 'lucide-react'

// Categories map to the tab shell; "Tất cả" shows every setting row.
const TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Chung', label: 'Chung' },
  { value: 'Thuế', label: 'Thuế & Hóa đơn' },
  { value: 'Thông báo', label: 'Thông báo' },
  { value: 'Tích hợp', label: 'Tích hợp' },
  { value: 'Kho', label: 'Kho' },
]

const CATEGORY_TONE = {
  'Chung': 'brand',
  'Thuế': 'amber',
  'Thông báo': 'blue',
  'Tích hợp': 'violet',
  'Kho': 'green',
}

const emptyForm = { id: null, settingKey: '', settingValue: '', label: '', category: 'Chung' }
const emptyFilters = { type: 'all', status: '', effectiveDate: '', approval: '' }

export default function SystemSettings() {
  const toast = useToast()
  const confirm = useConfirm()
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => settingService.list())
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => rows.filter((setting) => {
    const status = String(setting.status || 'PENDING').toUpperCase()
    return (applied.type === 'all' || setting.category === applied.type)
      && (!applied.status || status === applied.status)
      && (!applied.effectiveDate || String(setting.effectiveDate || '').slice(0, 10) === applied.effectiveDate)
      && (!applied.approval || String(setting.approval || setting.approver || '').toUpperCase() === applied.approval)
  }), [applied, rows])

  const openNew = () => {
    setForm({ ...emptyForm, category: applied.type === 'all' ? 'Chung' : applied.type })
    setEditing({})
  }
  const openEdit = (s) => {
    setForm({
      id: s.id,
      settingKey: s.settingKey || '',
      settingValue: s.settingValue || '',
      label: s.label || '',
      category: s.category || 'Chung',
    })
    setEditing(s)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    if (!(await confirm({
      title: form.id ? 'Lưu thay đổi cấu hình?' : 'Thêm cấu hình mới?',
      message: form.id ? `Cập nhật cấu hình "${form.label || form.settingKey}".` : `Tạo cấu hình "${form.label || form.settingKey}".`,
      confirmLabel: form.id ? 'Lưu' : 'Thêm',
    }))) return
    try {
      const payload = {
        settingKey: form.settingKey,
        settingValue: form.settingValue,
        label: form.label,
        category: form.category,
      }
      if (form.id) await settingService.update(form.settingKey, { value: form.settingValue })
      else await settingService.create(payload)
      toast.success('Đã lưu cấu hình hệ thống.')
      setEditing(null)
      setForm(emptyForm)
      await load()
    } catch (e) {
      toast.error(e.message || 'Lưu cấu hình thất bại.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="System Administration · 3.11.1"
        title="Configure System Settings"
        subtitle="Submit VAT, loyalty, role, notification, and integration configuration changes for approval."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={openNew}>Thêm cấu hình</Button>
          </div>
        }
      />

      <FilterBar>
        <Field label="Configuration Type"><Select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>{TABS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></Field>
        <Field label="Status"><Select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}><option value="">All</option><option value="PENDING">Draft/Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></Select></Field>
        <Field label="Effective Date"><Input type="date" value={filters.effectiveDate} onChange={(event) => setFilters((current) => ({ ...current, effectiveDate: event.target.value }))} /></Field>
        <Field label="Approval"><Select value={filters.approval} onChange={(event) => setFilters((current) => ({ ...current, approval: event.target.value }))}><option value="">All</option><option value="CEO">CEO</option><option value="ADMIN">Admin</option></Select></Field>
        <div className="flex gap-3"><Button onClick={() => setApplied(filters)}>Apply</Button><Button variant="secondary" onClick={() => { setFilters(emptyFilters); setApplied(emptyFilters) }}>Reset</Button></div>
      </FilterBar>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,1fr)]">
        <Card>
          <CardHeader title="Configuration Requests" icon={Settings} />
          <CardBody className="p-0">
            {loading ? <div className="flex items-center justify-center py-16"><Spinner className="h-7 w-7" /></div> : (
              <DataTable
                className="rounded-none border-0 shadow-none"
                rows={filtered}
                rowKey="id"
                onRowClick={(r) => setSelected(r)}
                empty={{ title: 'Chưa có cấu hình', subtitle: 'Thêm tham số cấu hình đầu tiên.' }}
                columns={[
                  { key: 'id', header: 'Config ID' },
                  { key: 'category', header: 'Type' },
                  { key: 'settingValue', header: 'Current' },
                  { key: 'label', header: 'New' },
                  { key: 'status', header: 'Status', render: () => 'Pending' },
                ]}
                actions={(r) => <Button size="sm" variant="secondary" icon={Pencil} onClick={() => { setSelected(r); openEdit(r) }}>Edit</Button>}
              />
            )}
          </CardBody>
        </Card>
        <Card className="sms-detail-panel">
          <CardBody>
            <h2 className="mb-5 text-lg font-bold">Configuration Change</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Current Value"><Input value={selected?.settingValue || 'Existing value'} readOnly /></Field>
              <Field label="New Value"><Input placeholder="Requested value" /></Field>
              <Field label="Effective Date"><Input type="date" /></Field>
              <Field label="Approval Status"><Input value="Pending" readOnly /></Field>
            </div>
            <div className="mt-16"><Button onClick={openNew}>Submit Request</Button></div>
          </CardBody>
        </Card>
      </div>

      <Modal
        open={!!editing}
        onClose={() => { setEditing(null); setForm(emptyForm) }}
        title={form.id ? 'Sửa cấu hình' : 'Thêm cấu hình'}
        subtitle={form.label || undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setEditing(null); setForm(emptyForm) }}>Hủy</Button>
            <Button icon={Save} onClick={save}>Lưu cấu hình</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <Field label="Tên cấu hình" hint="Nhãn hiển thị cho người dùng">
              <Input value={form.label} onChange={set('label')} placeholder="Tên cửa hàng" disabled={!!form.id} />
            </Field>
            <Field label="Khóa cấu hình" hint="Định danh key kỹ thuật, ví dụ: store.name">
              <Input value={form.settingKey} onChange={set('settingKey')} placeholder="store.name" className="font-mono" disabled={!!form.id} />
            </Field>
            <Field label="Giá trị">
              <Input value={form.settingValue} onChange={set('settingValue')} placeholder="Siêu thị SMS Central" />
            </Field>
            <Field label="Nhóm">
              <Select value={form.category} onChange={set('category')} disabled={!!form.id}>
                <option value="Chung">Chung</option>
                <option value="Thuế">Thuế & Hóa đơn</option>
                <option value="Thông báo">Thông báo</option>
                <option value="Tích hợp">Tích hợp</option>
                <option value="Kho">Kho</option>
              </Select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
