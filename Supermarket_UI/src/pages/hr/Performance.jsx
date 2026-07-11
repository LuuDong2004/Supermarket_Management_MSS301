import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber } from '../../lib/format.js'
import { reportService, withFallback, toList, mockEmployeePerformance } from '../../services/index.js'
import { Award, Gauge, TrendingUp, Star } from 'lucide-react'

function scoreTone(score) {
  if (score >= 90) return 'green'
  if (score >= 80) return 'brand'
  if (score >= 70) return 'amber'
  return 'red'
}

export default function Performance() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [selected, setSelected] = useState(null)
  const [recommendation, setRecommendation] = useState('Giữ nguyên')
  const [note, setNote] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const r = await withFallback(() => reportService.employeePerformance(), mockEmployeePerformance)
      setRows(toList(r.data))
      setSource(r.source)
      setLoading(false)
    })()
  }, [])

  const avgScore = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0
  const top = rows.length ? [...rows].sort((a, b) => b.score - a.score)[0] : { name: '—', score: 0 }
  const avgAccuracy = rows.length ? (rows.reduce((s, r) => s + r.accuracy, 0) / rows.length).toFixed(1) : '0.0'

  const openReview = (r) => {
    setSelected(r)
    setRecommendation('Giữ nguyên')
    setNote('')
  }

  const submitReview = () => {
    toast.success(`Đã lưu đánh giá cho ${selected.name}: ${recommendation}.`)
    setSelected(null)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.3"
        title="Đánh giá hiệu suất"
        subtitle="Xếp hạng nhân viên theo doanh số, độ chính xác và giờ công."
        actions={
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Điểm trung bình" value={formatNumber(avgScore)} icon={Gauge} tone="brand" hint="toàn nhóm" />
        <StatCard label="Nhân viên xuất sắc" value={top.name.split(' ').slice(-1)[0]} icon={Award} tone="green" hint={`${top.score} điểm`} />
        <StatCard label="Độ chính xác TB" value={`${avgAccuracy}%`} icon={TrendingUp} tone="blue" hint="giao dịch" />
        <StatCard label="Số nhân viên" value={formatNumber(rows.length)} icon={Star} tone="violet" hint="được đánh giá" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
      <Card className="mt-6">
        <CardHeader title="Phân bố điểm hiệu suất" subtitle="Thang điểm 100" icon={Gauge} />
        <CardBody>
          <Bars data={rows} x="name" series={[{ key: 'score', name: 'Điểm', color: '#4f46e5' }]} />
        </CardBody>
      </Card>

      <div className="mt-6">
        <DataTable
          rows={rows}
          rowKey="name"
          onRowClick={openReview}
          empty={{ title: 'Chưa có dữ liệu đánh giá' }}
          columns={[
            { key: 'name', header: 'Nhân viên', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
            { key: 'sales', header: 'Doanh số (đơn)', align: 'right', render: (r) => formatNumber(r.sales) },
            { key: 'accuracy', header: 'Độ chính xác', align: 'right', render: (r) => `${r.accuracy}%` },
            { key: 'hours', header: 'Giờ công', align: 'right', render: (r) => `${r.hours} h` },
            {
              key: 'score', header: 'Điểm', render: (r) => (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${r.score}%` }} />
                  </div>
                  <Badge tone={scoreTone(r.score)}>{r.score}</Badge>
                </div>
              ),
            },
          ]}
        />
      </div>
        </>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Đánh giá & đề xuất"
        subtitle={selected?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>Hủy</Button>
            <Button variant="success" onClick={submitReview}>Lưu đánh giá</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
              <span className="text-sm font-medium text-brand-800">Điểm hiệu suất hiện tại</span>
              <Badge tone={scoreTone(selected.score)}>{selected.score} / 100</Badge>
            </div>
            <Field label="Đề xuất">
              <Select value={recommendation} onChange={(e) => setRecommendation(e.target.value)}>
                <option value="Thưởng">Thưởng</option>
                <option value="Tăng lương">Tăng lương</option>
                <option value="Giữ nguyên">Giữ nguyên</option>
              </Select>
            </Field>
            <Field label="Ghi chú đánh giá">
              <Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhận xét về hiệu suất, điểm mạnh, điểm cần cải thiện..." />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
