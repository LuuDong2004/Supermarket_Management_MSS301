import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber, isoDate } from '../../lib/format.js'
import { attendanceService, withFallback, toList } from '../../services/index.js'
import { Clock, CheckCircle2, AlertTriangle, XCircle, Download, CalendarRange } from 'lucide-react'

const firstOfMonth = () => { const d = new Date(); return isoDate(new Date(d.getFullYear(), d.getMonth(), 1)) }
const today = () => isoDate()
const initialRange = { from: firstOfMonth(), to: today() }

function exportCsv(rows, from, to) {
  const header = ['Nhân viên', 'Ngày công', 'Tổng giờ', 'Đúng giờ', 'Đi muộn', 'Vắng', 'Ca xếp', 'Ca hoàn thành']
  const lines = rows.map((r) => [r.employee, r.days, r.totalHours, r.onTime, r.late, r.absent, r.shiftsScheduled, r.shiftsCompleted])
  const csv = [header, ...lines].map((cols) => cols.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bao-cao-cham-cong_${from}_${to}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Timesheet() {
  const toast = useToast()
  const [from, setFrom] = useState(initialRange.from)
  const [to, setTo] = useState(initialRange.to)
  const [appliedRange, setAppliedRange] = useState(initialRange)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => attendanceService.timesheet(appliedRange))
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [appliedRange])

  const totals = useMemo(() => rows.reduce((acc, r) => ({
    hours: acc.hours + (r.totalHours || 0),
    onTime: acc.onTime + (r.onTime || 0),
    late: acc.late + (r.late || 0),
    absent: acc.absent + (r.absent || 0),
  }), { hours: 0, onTime: 0, late: 0, absent: 0 }), [rows])

  const doExport = () => {
    if (rows.length === 0) return toast.error('Không có dữ liệu để xuất.')
    exportCsv(rows, appliedRange.from, appliedRange.to)
    toast.success('Đã xuất báo cáo chấm công (CSV).')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.5"
        title="Báo cáo chấm công"
        subtitle="Tổng hợp giờ công, đúng giờ / đi muộn / vắng và mức độ hoàn thành ca theo nhân viên."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Download} onClick={doExport}>Xuất báo cáo</Button>
          </div>
        }
      />

      <FilterBar>
        <Field label="Từ ngày"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="Đến ngày"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        <div className="flex !basis-auto !grow-0 gap-2">
          <Button onClick={() => setAppliedRange({ from, to })}>Apply</Button>
          <Button variant="secondary" onClick={() => { setFrom(initialRange.from); setTo(initialRange.to); setAppliedRange(initialRange) }}>Reset</Button>
        </div>
      </FilterBar>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng giờ công" value={formatNumber(totals.hours)} icon={Clock} tone="brand" hint={`${rows.length} nhân viên`} />
        <StatCard label="Lượt đúng giờ" value={formatNumber(totals.onTime)} icon={CheckCircle2} tone="green" />
        <StatCard label="Lượt đi muộn" value={formatNumber(totals.late)} icon={AlertTriangle} tone="amber" />
        <StatCard label="Lượt vắng" value={formatNumber(totals.absent)} icon={XCircle} tone="red" />
      </div>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Spinner className="h-7 w-7" /></div>
          ) : (
            <DataTable
              rows={rows}
              rowKey="employee"
              empty={{ title: 'Không có dữ liệu chấm công', subtitle: 'Chọn khoảng ngày khác hoặc thêm bản ghi chấm công.' }}
              columns={[
                { key: 'employee', header: 'Nhân viên', render: (r) => <span className="font-medium text-slate-700">{r.employee}</span> },
                { key: 'days', header: 'Ngày công', align: 'center' },
                { key: 'totalHours', header: 'Tổng giờ', align: 'center', render: (r) => <span className="font-semibold">{formatNumber(r.totalHours)}</span> },
                { key: 'onTime', header: 'Đúng giờ', align: 'center', render: (r) => <Badge tone="green">{r.onTime}</Badge> },
                { key: 'late', header: 'Đi muộn', align: 'center', render: (r) => <Badge tone={r.late > 0 ? 'amber' : 'slate'}>{r.late}</Badge> },
                { key: 'absent', header: 'Vắng', align: 'center', render: (r) => <Badge tone={r.absent > 0 ? 'red' : 'slate'}>{r.absent}</Badge> },
                { key: 'shifts', header: 'Ca (HT / Xếp)', align: 'center', render: (r) => (
                  <span className="flex items-center justify-center gap-1 text-xs">
                    <CalendarRange size={13} className="text-slate-400" />
                    <span className={r.shiftsCompleted >= r.shiftsScheduled && r.shiftsScheduled > 0 ? 'font-semibold text-emerald-600' : 'text-slate-600'}>
                      {r.shiftsCompleted}/{r.shiftsScheduled}
                    </span>
                  </span>
                ) },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
