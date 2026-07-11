import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { isoDate } from '../../lib/format.js'
import { staffShiftService, employeeService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const SHIFT_TYPES = [
  { key: 'Sáng', time: '06:00 - 14:00' },
  { key: 'Chiều', time: '14:00 - 22:00' },
  { key: 'Đêm', time: '22:00 - 06:00' },
]

// Full-page shift assignment form (replaces the old assign modal).
// Prefilled via ?date=YYYY-MM-DD&type=Sáng from the weekly grid.
export default function ShiftAssignForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const [params] = useSearchParams()

  const [employees, setEmployees] = useState([])
  const [source, setSource] = useState('backend')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    employeeId: '',
    employeeCode: '',
    employeeName: '',
    shiftDate: params.get('date') || isoDate(),
    shiftType: params.get('type') || 'Sáng',
    area: '',
    note: '',
  })

  useEffect(() => {
    const load = async () => {
      const re = await withFallback(() => employeeService.list({ size: 200 }))
      const list = toList(re.data)
      setEmployees(list)
      setSource(re.source)
      const active = list.filter((e) => !(e.status || '').toLowerCase().includes('nghỉ'))
      const first = active[0]
      if (first) {
        setForm((f) => ({ ...f, employeeId: first.id, employeeCode: first.code || '', employeeName: first.name || '' }))
      }
      setLoading(false)
    }
    load()
  }, [])

  const activeEmployees = useMemo(
    () => employees.filter((e) => !(e.status || '').toLowerCase().includes('nghỉ')),
    [employees])

  const pickEmployee = (id) => {
    const e = employees.find((x) => String(x.id) === String(id))
    setForm((f) => ({ ...f, employeeId: id, employeeCode: e?.code || '', employeeName: e?.name || '' }))
  }

  const save = async () => {
    if (source !== 'backend') return toast.error('Không có kết nối backend.')
    if (!form.employeeName) return toast.error('Chọn nhân viên.')
    if (!(await confirm({ title: 'Phân ca làm việc?', message: `Phân ca ${form.shiftType} ngày ${form.shiftDate} cho ${form.employeeName}?`, confirmLabel: 'Phân ca' }))) return
    setSaving(true)
    try {
      await staffShiftService.create({
        employeeCode: form.employeeCode || null,
        employeeName: form.employeeName,
        shiftDate: form.shiftDate,
        shiftType: form.shiftType,
        area: form.area || null,
        note: form.note || null,
      })
      toast.success(`Đã phân ca ${form.shiftType} cho ${form.employeeName}.`)
      navigate('/app/hr/shifts')
    } catch (e) {
      toast.error(e.message || 'Không phân ca được.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.4"
        title="Phân ca làm việc"
        subtitle={`${form.shiftType} · ${form.shiftDate}`}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/hr/shifts')}>Quay lại lịch ca</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-3xl">
          <CardBody>
            <div className="space-y-4">
              <Field label="Nhân viên" required>
                <Select value={form.employeeId} onChange={(e) => pickEmployee(e.target.value)}>
                  {activeEmployees.length === 0 && <option value="">— Không có nhân viên —</option>}
                  {activeEmployees.map((e) => <option key={e.id} value={e.id}>{e.name} · {e.code}</option>)}
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Loại ca" required>
                  <Select value={form.shiftType} onChange={(e) => setForm({ ...form, shiftType: e.target.value })}>
                    {SHIFT_TYPES.map((s) => <option key={s.key} value={s.key}>{s.key} ({s.time})</option>)}
                  </Select>
                </Field>
                <Field label="Ngày" required>
                  <Input type="date" value={form.shiftDate} onChange={(e) => setForm({ ...form, shiftDate: e.target.value })} />
                </Field>
              </div>
              <Field label="Khu vực làm việc">
                <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="VD: Quầy thu ngân, Kho hàng..." />
              </Field>
              <Field label="Ghi chú">
                <Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/hr/shifts')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu ca'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
