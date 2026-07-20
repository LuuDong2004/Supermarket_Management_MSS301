import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { settingService, withFallback, toList, mockSettings } from '../../services/index.js'
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

export default function SystemSettings() {
  const toast = useToast()
  const confirm = useConfirm()
  const [tab, setTab] = useState('all')

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => settingService.list(), mockSettings)
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(
    () => (tab === 'all' ? rows : rows.filter((s) => s.category === tab)),
    [rows, tab],
  )

  const openNew = () => {
    setForm({ ...emptyForm, category: tab === 'all' ? 'Chung' : tab })
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
        breadcrumb="Hệ thống · 3.11.1"
        title="Cấu hình hệ thống"
        subtitle="Thiết lập thông tin cửa hàng, thuế, thông báo và tích hợp."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={openNew}>Thêm cấu hình</Button>
          </div>
        }
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      <Card>
        <CardHeader
          title="Danh sách cấu hình"
          subtitle="Các tham số key/value điều khiển hệ thống"
          icon={tab === 'all' ? Settings : Store}
        />
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-7 w-7" />
            </div>
          ) : (
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={filtered}
              rowKey="id"
              empty={{ title: 'Chưa có cấu hình', subtitle: 'Thêm tham số cấu hình đầu tiên.' }}
              columns={[
                { key: 'label', header: 'Tên cấu hình', render: (r) => <span className="font-medium text-slate-700">{r.label}</span> },
                { key: 'settingKey', header: 'Khóa', render: (r) => <span className="font-mono text-xs text-slate-500">{r.settingKey}</span> },
                { key: 'settingValue', header: 'Giá trị', render: (r) => <span className="font-mono text-sm text-slate-700">{r.settingValue}</span> },
                { key: 'category', header: 'Nhóm', render: (r) => <Badge tone={CATEGORY_TONE[r.category] || 'slate'}>{r.category}</Badge> },
              ]}
              actions={(r) => (
                <>
                  <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEdit(r)}>Sửa</Button>
                </>
              )}
            />
          )}
        </CardBody>
      </Card>

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
