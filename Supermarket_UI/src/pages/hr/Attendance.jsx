import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, Field, Input, Select, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber, formatDate, isoDate } from '../../lib/format.js'
import { attendanceService, withFallback, toList, mockAttendance } from '../../services/index.js'
import { Clock, AlarmClock, UserX, Hourglass, Download, Plus, Trash2 } from 'lucide-react'

const STATUSES = ['Đúng giờ', 'Đi muộn', 'Vắng']

const emptyForm = { id: null, code: '', employee: '', date: isoDate(), checkIn: '', checkOut: '', hours: '', status: 'Đúng giờ' }

export default function Attendance() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [date, setDate] = useState(isoDate())
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => attendanceService.list(), mockAttendance)
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => rows.filter((r) => !date || r.date === date), [rows, date])

  const onTime = filtered.filter((r) => r.status === 'Đúng giờ').length
  const late = filtered.filter((r) => r.status === 'Đi muộn').length
  const absent = filtered.filter((r) => r.status === 'Vắng').length
  const totalHours = filtered.reduce((s, r) => s + (r.hours || 0), 0)

  const openCreate = () => { setForm({ ...emptyForm, date }); setEditing(true) }
  const openEdit = (r) => {
    setForm({
      id: r.id, code: r.code || r.id || '', employee: r.employee || '', date: r.date || date,
      checkIn: r.checkIn || '', checkOut: r.checkOut || '', hours: r.hours ?? '', status: r.status || 'Đúng giờ',
    })
    setEditing(true)
  }

  const save = async () => {
    const payload = {
      code: form.code || form.id || `AT-${Date.now()}`,
      employee: form.employee,
      date: form.date || null,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      hours: form.hours === '' ? null : Number(form.hours),
      status: form.status,
    }
    try {
      if (form.id) await attendanceService.update(form.id, payload)
      else await attendanceService.create(payload)
      toast.success('Đã lưu chấm công.')
      setEditing(false)
      setForm(emptyForm)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const remove = async (row) => {
    try {
      await attendanceService.remove(row.id)
      toast.success('Đã xóa bản ghi chấm công.')
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const exportCsv = () => {
    if (filtered.length === 0) return toast.error('Không có dữ liệu để xuất.')
    const header = ['Nhân viên', 'Ngày', 'Giờ vào', 'Giờ ra', 'Số giờ', 'Trạng thái']
    const lines = filtered.map((r) => [r.employee, r.date, r.checkIn, r.checkOut, r.hours, r.status])
    const csv = [header, ...lines].map((c) => c.map((x) => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cham-cong_${date || 'tat-ca'}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã xuất báo cáo chấm công (CSV).')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.2"
        title="Chấm công"
        subtitle="Theo dõi giờ vào/ra và trạng thái chấm công theo ngày."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={openCreate}>Thêm chấm công</Button>
            <Button variant="secondary" icon={Download} onClick={exportCsv}>Xuất báo cáo</Button>
          </div>
        }
      />

      <FilterBar>
        <Field label="Ngày làm việc">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </FilterBar>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Đúng giờ" value={formatNumber(onTime)} icon={Clock} tone="green" hint="nhân viên" />
        <StatCard label="Đi muộn" value={formatNumber(late)} icon={AlarmClock} tone="amber" hint="nhân viên" />
        <StatCard label="Vắng" value={formatNumber(absent)} icon={UserX} tone="red" hint="nhân viên" />
        <StatCard label="Tổng giờ công" value={`${formatNumber(totalHours)} h`} icon={Hourglass} tone="brand" hint="trong ngày" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <DataTable
          rows={filtered}
          onRowClick={openEdit}
          empty={{ title: 'Chưa có dữ liệu chấm công', subtitle: 'Chọn ngày khác để xem.' }}
          columns={[
            { key: 'employee', header: 'Nhân viên', render: (r) => <span className="font-medium text-slate-700">{r.employee}</span> },
            { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
            { key: 'checkIn', header: 'Giờ vào', align: 'center', render: (r) => <span className="font-mono text-xs">{r.checkIn || '—'}</span> },
            { key: 'checkOut', header: 'Giờ ra', align: 'center', render: (r) => <span className="font-mono text-xs">{r.checkOut || '—'}</span> },
            { key: 'hours', header: 'Số giờ', align: 'center', render: (r) => <span className="font-semibold">{r.hours} h</span> },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            {
              key: 'actions', header: '', align: 'right', render: (r) => (
                <Button variant="ghost" size="sm" icon={Trash2} onClick={(e) => { e.stopPropagation(); remove(r) }} />
              ),
            },
          ]}
        />
      )}

      {/* Create / edit attendance modal */}
      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title={form.id ? 'Sửa chấm công' : 'Thêm chấm công'}
        subtitle={form.id ? `Cập nhật ${form.code || form.id}` : 'Ghi nhận chấm công mới'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(false)}>Hủy</Button>
            <Button onClick={save}>Lưu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Nhân viên" required>
            <Input value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} placeholder="Nguyễn Văn A" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ngày">
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Trạng thái">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
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
        </div>
      </Modal>
    </div>
  )
}
