import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber, formatPercent } from '../../lib/format.js'
import { reportService, withFallback, toList, mockEmployeePerformance } from '../../services/index.js'
import {
  Award, Gauge, Clock, Target, FileSpreadsheet, BarChart3, Users,
} from 'lucide-react'

export default function EmployeeReport() {
  const toast = useToast()
  const [period, setPeriod] = useState('month')
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-15')

  const [source, setSource] = useState('backend')
  const [perf, setPerf] = useState([])

  const load = async () => {
    const res = await withFallback(() => reportService.employeePerformance(), mockEmployeePerformance)
    setPerf(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const topScore = useMemo(() => (perf.length ? Math.max(...perf.map((e) => e.score || 0)) : 0), [perf])
  const topName = useMemo(() => perf.find((e) => e.score === topScore)?.name || '—', [perf, topScore])
  const avgScore = useMemo(() => (perf.length ? Math.round(perf.reduce((s, e) => s + (e.score || 0), 0) / perf.length) : 0), [perf])
  const totalHours = useMemo(() => perf.reduce((s, e) => s + (e.hours || 0), 0), [perf])
  const avgAccuracy = useMemo(() => (perf.length ? perf.reduce((s, e) => s + Number(e.accuracy || 0), 0) / perf.length : 0), [perf])

  const exportReport = () => toast.success('Đã xuất báo cáo hiệu suất nhân viên ra Excel.')

  const scoreBadge = (score) => {
    if (score >= 90) return <Badge tone="green">{score}</Badge>
    if (score >= 80) return <Badge tone="amber">{score}</Badge>
    return <Badge tone="red">{score}</Badge>
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Báo cáo · 3.10.3"
        title="Hiệu suất nhân viên"
        subtitle="Đánh giá doanh số, độ chính xác và giờ làm theo từng nhân viên."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={FileSpreadsheet} onClick={exportReport}>Xuất Excel</Button>
          </div>
        }
      />

      <FilterBar>
        <Field label="Kỳ đánh giá" className="w-44">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
          </Select>
        </Field>
        <Field label="Từ ngày" className="w-40">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Đến ngày" className="w-40">
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <div className="ml-auto">
          <Button variant="secondary" icon={FileSpreadsheet} onClick={exportReport}>Xuất báo cáo</Button>
        </div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="NV xuất sắc" value={topName.split(' ').slice(-2).join(' ')} icon={Award} tone="violet" hint={`${topScore} điểm`} />
        <StatCard label="Điểm trung bình" value={formatNumber(avgScore)} icon={Gauge} tone="brand" delta={4} hint="so với kỳ trước" />
        <StatCard label="Tổng giờ làm" value={`${formatNumber(totalHours)} giờ`} icon={Clock} tone="blue" hint="toàn đội" />
        <StatCard label="Độ chính xác TB" value={formatPercent(avgAccuracy)} icon={Target} tone="green" delta={1} hint="thao tác POS" />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Điểm hiệu suất theo nhân viên" subtitle="Thang điểm 100" icon={BarChart3} />
          <CardBody>
            <Bars data={perf} x="name" series={[{ key: 'score', name: 'Điểm' }]} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Bảng xếp hạng nhân viên" subtitle="Chi tiết chỉ số đánh giá" icon={Users} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={perf}
              rowKey="name"
              columns={[
                { key: 'name', header: 'Nhân viên', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
                { key: 'sales', header: 'Doanh số (đơn)', align: 'center', render: (r) => formatNumber(r.sales) },
                { key: 'accuracy', header: 'Độ chính xác', align: 'center', render: (r) => formatPercent(Number(r.accuracy || 0)) },
                { key: 'hours', header: 'Giờ làm', align: 'center', render: (r) => `${formatNumber(r.hours)} giờ` },
                {
                  key: 'score',
                  header: 'Điểm',
                  align: 'center',
                  render: (r) => (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${r.score}%` }} />
                      </div>
                      {scoreBadge(r.score)}
                    </div>
                  ),
                },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
