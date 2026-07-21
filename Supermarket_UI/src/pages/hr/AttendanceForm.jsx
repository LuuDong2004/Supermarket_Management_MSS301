import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { isoDate } from '../../lib/format.js'
import { attendanceService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const STATUSES = ['Đúng giờ', 'Đi muộn', 'Vắng']

const emptyForm = { code: '', employee: '', date: isoDate(), checkIn: '', checkOut: '', hours: '', status: 'Đúng giờ' }

// Full-page create / edit attendance record (replaces the old modal).
export default function AttendanceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { setForm(emptyForm); setLoading(false); return }
    const load = async () => {
      const r = await withFallback(() => attendanceService.list())
      const a = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!a) {
        toast.error('Không tìm thấy bản ghi chấm công.')
        navigate('/app/hr/attendance')
        return
      }
      setForm({
        code: a.code || a.id || '', employee: a.employee || '', date: a.date || isoDate(),
        checkIn: a.checkIn || '', checkOut: a.checkOut || '', hours: a.hours ?? '', status: a.status || 'Đúng giờ',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    const ok = await confirm({
      title: id ? 'Cập nhật chấm công?' : 'Thêm chấm công?',
      message: id
        ? `Lưu thay đổi bản ghi chấm công của ${form.employee || 'nhân viên'}?`
        : `Ghi nhận chấm công mới cho ${form.employee || 'nhân viên'}?`,
      confirmLabel: 'Lưu',
    })
    if (!ok) return
    const payload = {
      code: form.code || id || `AT-${Date.now()}`,
      employee: form.employee,
      date: form.date || null,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      hours: form.hours === '' ? null : Number(form.hours),
      status: form.status,
    }
    setSaving(true)
    try {
      if (id) await attendanceService.update(id, payload)
      else await attendanceService.create(payload)
      toast.success('Đã lưu chấm công.')
      navigate('/app/hr/attendance')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.2"
        title={id ? 'Sửa chấm công' : 'Thêm chấm công'}
        subtitle={id ? `Cập nhật ${form.code || id}` : 'Ghi nhận chấm công mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/hr/attendance')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Nhân viên" required>
                <Input value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} placeholder="Nguyễn Văn A" />
              </Field>
              <Field label="Ngày">
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Field>
              <Field label="Trạng thái">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Giờ vào">
                <Input value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} placeholder="07:55" />
              </Field>
              <Field label="Giờ ra">
                <Input value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} placeholder="16:05" />
              </Field>
              <Field label="Số giờ">
                <Input type="number" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="8" />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/hr/attendance')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu chấm công'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
