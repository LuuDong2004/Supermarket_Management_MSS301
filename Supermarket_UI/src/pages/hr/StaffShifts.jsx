import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge } from '../../components/ui/primitives.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { isoDate } from '../../lib/format.js'
import { staffShiftService, withFallback, toList } from '../../services/index.js'
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react'

const SHIFT_TYPES = [
  { key: 'Sáng', time: '06:00 - 14:00', tone: 'amber' },
  { key: 'Chiều', time: '14:00 - 22:00', tone: 'blue' },
  { key: 'Đêm', time: '22:00 - 06:00', tone: 'violet' },
]
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const iso = isoDate // local YYYY-MM-DD (no UTC shift)

// Monday of the week containing `base`.
function weekStart(base) {
  const d = new Date(base)
  const day = (d.getDay() + 6) % 7 // Mon=0..Sun=6
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x }

export default function StaffShifts() {
  const toast = useToast()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(() => weekStart(new Date()))
  const [shifts, setShifts] = useState([])
  const [source, setSource] = useState('backend')
  const [selected, setSelected] = useState(null) // existing shift detail

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(anchor, i)), [anchor])
  const from = iso(days[0])
  const to = iso(days[6])

  const load = async () => {
    const rs = await withFallback(() => staffShiftService.list({ from, to }))
    setShifts(toList(rs.data))
    setSource(rs.source)
  }
  useEffect(() => { load() }, [from, to])

  const cell = (date, type) => shifts.filter((s) => s.shiftDate === date && s.shiftType === type)

  const openAssign = (date, type) =>
    navigate(`/app/hr/shifts/new?date=${encodeURIComponent(date)}&type=${encodeURIComponent(type)}`)

  const doComplete = async (s) => {
    try { await staffShiftService.complete(s.id); toast.success('Đã đánh dấu hoàn thành.'); setSelected(null); await load() }
    catch (e) { toast.error(e.message) }
  }
  const doDelete = async (s) => {
    try { await staffShiftService.remove(s.id); toast.success('Đã xóa ca.'); setSelected(null); await load() }
    catch (e) { toast.error(e.message) }
  }

  const label = `${days[0].getDate()}/${days[0].getMonth() + 1} - ${days[6].getDate()}/${days[6].getMonth() + 1}`

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.4"
        title="Phân ca nhân viên"
        subtitle="Xếp lịch làm việc theo ca Sáng / Chiều / Đêm. Mỗi nhân viên tối đa 1 ca/ngày."
        actions={
        }
      />

      <Card>
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={ChevronLeft} onClick={() => setAnchor((a) => addDays(a, -7))}>Tuần trước</Button>
              <Button variant="ghost" size="sm" onClick={() => setAnchor(weekStart(new Date()))}>Tuần này</Button>
              <Button variant="secondary" size="sm" onClick={() => setAnchor((a) => addDays(a, 7))}>Tuần sau <ChevronRight size={15} /></Button>
            </div>
            <span className="text-sm font-semibold text-slate-600">Tuần {label}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-24 p-2 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Ca</th>
                  {days.map((d, i) => {
                    const today = iso(d) === iso(new Date())
                    return (
                      <th key={i} className={`p-2 text-center text-xs font-bold ${today ? 'text-brand-600' : 'text-slate-500'}`}>
                        {WEEKDAYS[i]}<br /><span className="text-[11px] font-medium text-slate-400">{d.getDate()}/{d.getMonth() + 1}</span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {SHIFT_TYPES.map((st) => (
                  <tr key={st.key}>
                    <td className="p-2 align-top">
                      <Badge tone={st.tone}>{st.key}</Badge>
                      <p className="mt-1 text-[10px] text-slate-400">{st.time}</p>
                    </td>
                    {days.map((d, i) => {
                      const date = iso(d)
                      const items = cell(date, st.key)
                      return (
                        <td key={i} className="align-top">
                          <div className="min-h-[72px] rounded-lg border border-slate-100 bg-slate-50/40 p-1.5 space-y-1">
                            {items.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => setSelected(s)}
                                className={`block w-full truncate rounded-md border px-2 py-1 text-left text-[11px] font-medium transition hover:shadow-sm ${s.status === 'Hoàn thành' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-brand-200 bg-brand-50 text-brand-700'}`}
                                title={s.employeeName}
                              >
                                {s.employeeName}
                              </button>
                            ))}
                            <button
                              onClick={() => openAssign(date, st.key)}
                              className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-slate-200 py-1 text-[11px] text-slate-400 hover:border-brand-300 hover:text-brand-600"
                            >
                              <Plus size={12} /> Thêm
                            </button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Shift detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Ca ${selected.shiftType}` : ''}
        subtitle={selected?.employeeName}
        footer={
          selected && (
            <div className="flex w-full justify-between">
              <Button variant="danger" icon={Trash2} onClick={() => doDelete(selected)}>Xóa ca</Button>
              {selected.status !== 'Hoàn thành' && (
                <Button variant="success" icon={CheckCircle2} onClick={() => doComplete(selected)}>Hoàn thành</Button>
              )}
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-2.5 text-sm">
            {[['Nhân viên', selected.employeeName], ['Mã NV', selected.employeeCode || '—'],
              ['Ngày', selected.shiftDate], ['Giờ', `${selected.startTime || ''} - ${selected.endTime || ''}`],
              ['Khu vực', selected.area || '—']].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">{k}</span><span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 flex items-center gap-1"><Clock size={14} /> Trạng thái</span>
              <StatusBadge status={selected.status} />
            </div>
            {selected.note && <div><p className="text-slate-500">Ghi chú</p><p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-slate-700">{selected.note}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
