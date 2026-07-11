import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatDate } from '../../lib/format.js'
import { stockAdjustmentService, withFallback, toList, mockStockAdjustments } from '../../services/index.js'
import { Plus, Check, X } from 'lucide-react'

const REASON_TONE = { 'Hư hỏng': 'amber', 'Vỡ': 'red', 'Thất thoát': 'violet', 'Hết hạn': 'slate' }
const MANAGER = ['ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN']

export default function Adjustments() {
  const toast = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isManager = MANAGER.includes(user?.role)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [tab, setTab] = useState('all')

  const load = async () => {
    setLoading(true)
    const adj = await withFallback(() => stockAdjustmentService.list(), mockStockAdjustments)
    setList(toList(adj.data))
    setSource(adj.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const counts = useMemo(() => ({
    pending: list.filter((a) => a.status === 'Chờ duyệt').length,
    approved: list.filter((a) => a.status === 'Đã duyệt').length,
    rejected: list.filter((a) => a.status === 'Từ chối').length,
    all: list.length,
  }), [list])

  const rows = useMemo(() => (tab === 'all' ? list : list.filter((a) => a.status === tab)), [list, tab])

  const decide = async (row, approved) => {
    try {
      if (approved) await stockAdjustmentService.approve(row.id)
      else await stockAdjustmentService.reject(row.id)
      toast[approved ? 'success' : 'info'](`${approved ? 'Đã duyệt' : 'Đã từ chối'} yêu cầu ${row.code}.`)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.4"
        title="Điều chỉnh tồn kho"
        subtitle="Tạo và theo dõi các yêu cầu điều chỉnh số lượng tồn kho."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={() => navigate('/app/warehouse/adjustments/new')}>Tạo yêu cầu điều chỉnh</Button>
          </div>
        }
      />

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'all', label: 'Tất cả', count: counts.all },
          { value: 'Chờ duyệt', label: 'Chờ duyệt', count: counts.pending },
          { value: 'Đã duyệt', label: 'Đã duyệt', count: counts.approved },
          { value: 'Từ chối', label: 'Từ chối', count: counts.rejected },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <DataTable
          rows={rows}
          empty={{ title: 'Không có yêu cầu', subtitle: 'Chưa có yêu cầu điều chỉnh nào ở trạng thái này.' }}
          columns={[
            { key: 'code', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
            { key: 'product', header: 'Sản phẩm' },
            { key: 'systemQty', header: 'Hệ thống', align: 'center' },
            { key: 'countedQty', header: 'Thực đếm', align: 'center' },
            { key: 'diff', header: 'Chênh lệch', align: 'center', render: (r) => (
              <Badge tone={r.diff > 0 ? 'green' : r.diff < 0 ? 'red' : 'slate'}>{r.diff > 0 ? `+${r.diff}` : r.diff}</Badge>
            ) },
            { key: 'reason', header: 'Lý do', render: (r) => <Badge tone={REASON_TONE[r.reason] || 'slate'}>{r.reason}</Badge> },
            { key: 'adjDate', header: 'Ngày', render: (r) => formatDate(r.adjDate) },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          actions={(r) =>
            r.status === 'Chờ duyệt' && isManager ? (
              <>
                <Button variant="success" size="sm" icon={Check} onClick={() => decide(r, true)}>Duyệt</Button>
                <Button variant="danger" size="sm" icon={X} onClick={() => decide(r, false)}>Từ chối</Button>
              </>
            ) : (
              <span className="text-xs text-slate-400">—</span>
            )
          }
        />
      )}
    </div>
  )
}
