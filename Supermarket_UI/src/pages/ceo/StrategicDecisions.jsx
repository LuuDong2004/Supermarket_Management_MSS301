import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Field, Select, EmptyState } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import { strategicDecisionService, withFallback, toList } from '../../services/index.js'
import { Plus, Pencil, Trash2, Lightbulb, Flag, Rocket, CheckCircle2 } from 'lucide-react'

const CATEGORIES = ['Kinh doanh', 'Nhân sự', 'Khuyến mãi', 'Tài chính', 'Vận hành']

const catTone = (c) => ({ 'Kinh doanh': 'brand', 'Nhân sự': 'violet', 'Khuyến mãi': 'amber', 'Tài chính': 'green', 'Vận hành': 'blue' }[c] || 'slate')
const prioTone = (p) => ({ Cao: 'red', 'Trung bình': 'amber', Thấp: 'slate' }[p] || 'slate')

export default function StrategicDecisions() {
  const toast = useToast()
  const navigate = useNavigate()
  const [decisions, setDecisions] = useState([])
  const [source, setSource] = useState('backend')
  const [category, setCategory] = useState('')

  const load = async () => {
    const res = await withFallback(() => strategicDecisionService.list())
    setDecisions(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(
    () => (category ? decisions.filter((d) => d.category === category) : decisions),
    [category, decisions],
  )

  const counts = useMemo(() => ({
    total: decisions.length,
    active: decisions.filter((d) => d.status === 'Đang thực thi').length,
    issued: decisions.filter((d) => d.status === 'Đã ban hành').length,
    done: decisions.filter((d) => d.status === 'Hoàn thành').length,
  }), [decisions])

  const remove = async (d) => {
    if (source !== 'backend' || !d.id) { toast.error('Không có kết nối backend để xóa.'); return }
    try {
      await strategicDecisionService.remove(d.id)
      toast.success(`Đã xóa quyết định "${d.title}".`)
      await load()
    } catch {
      toast.error('Không thể xóa quyết định.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.7"
        title="Quyết định chiến lược"
        subtitle="Ban hành và theo dõi các chỉ đạo chiến lược của ban điều hành."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={() => navigate('/app/ceo/decisions/new')}>Ban hành quyết định</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng quyết định" value={counts.total} icon={Lightbulb} tone="brand" />
        <StatCard label="Đã ban hành" value={counts.issued} icon={Flag} tone="blue" />
        <StatCard label="Đang thực thi" value={counts.active} icon={Rocket} tone="amber" />
        <StatCard label="Hoàn thành" value={counts.done} icon={CheckCircle2} tone="green" />
      </div>

      <FilterBar>
        <Field label="Lĩnh vực">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tất cả lĩnh vực</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </FilterBar>

      {rows.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState icon={Lightbulb} title="Chưa có quyết định chiến lược" subtitle="Nhấn “Ban hành quyết định” để tạo mới." />
          </CardBody>
        </Card>
      ) : (
        <DataTable
          rows={rows}
          rowKey="code"
          columns={[
            { key: 'code', header: 'Mã', render: (d) => <span className="font-mono text-xs">{d.code}</span> },
            { key: 'title', header: 'Tiêu đề', render: (d) => <span className="font-medium text-slate-700">{d.title}</span> },
            { key: 'category', header: 'Lĩnh vực', render: (d) => <Badge tone={catTone(d.category)}>{d.category}</Badge> },
            { key: 'priority', header: 'Ưu tiên', render: (d) => <Badge tone={prioTone(d.priority)}>{d.priority}</Badge> },
            { key: 'status', header: 'Trạng thái', render: (d) => <StatusBadge status={d.status} /> },
            { key: 'decisionDate', header: 'Ngày', render: (d) => formatDate(d.decisionDate) },
            { key: 'owner', header: 'Phụ trách' },
          ]}
          actions={(d) => (
            <>
              <Button size="sm" variant="secondary" icon={Pencil} onClick={() => navigate(`/app/ceo/decisions/${d.id}/edit`)}>Sửa</Button>
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => remove(d)}>Xóa</Button>
            </>
          )}
        />
      )}
    </div>
  )
}
