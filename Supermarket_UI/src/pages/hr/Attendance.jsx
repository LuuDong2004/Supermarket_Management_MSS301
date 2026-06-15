import { useState, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Field, Input, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Clock, AlarmClock, UserX, Hourglass, Download } from 'lucide-react'

export default function Attendance() {
  const toast = useToast()
  const [date, setDate] = useState('2026-06-15')

  const rows = useMemo(() => db.attendance, [])

  const onTime = rows.filter((r) => r.status === 'Đúng giờ').length
  const late = rows.filter((r) => r.status === 'Đi muộn').length
  const absent = rows.filter((r) => r.status === 'Vắng').length
  const totalHours = rows.reduce((s, r) => s + (r.hours || 0), 0)

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.2"
        title="Chấm công"
        subtitle="Theo dõi giờ vào/ra và trạng thái chấm công theo ngày."
        actions={<Button variant="secondary" icon={Download} onClick={() => toast.success('Đã xuất báo cáo chấm công.')}>Xuất báo cáo</Button>}
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

      <DataTable
        rows={rows}
        empty={{ title: 'Chưa có dữ liệu chấm công', subtitle: 'Chọn ngày khác để xem.' }}
        columns={[
          { key: 'employee', header: 'Nhân viên', render: (r) => <span className="font-medium text-slate-700">{r.employee}</span> },
          { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
          { key: 'in', header: 'Giờ vào', align: 'center', render: (r) => <span className="font-mono text-xs">{r.in}</span> },
          { key: 'out', header: 'Giờ ra', align: 'center', render: (r) => <span className="font-mono text-xs">{r.out}</span> },
          { key: 'hours', header: 'Số giờ', align: 'center', render: (r) => <span className="font-semibold">{r.hours} h</span> },
          { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  )
}
