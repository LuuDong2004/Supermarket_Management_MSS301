import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatNumber, formatDate } from '../../lib/format.js'
import { stockCountService, withFallback, toList, mockStockCounts } from '../../services/index.js'
import { ClipboardList, ListChecks, AlertTriangle, Equal, Plus, Pencil, Trash2 } from 'lucide-react'

const STATUSES = ['Đang kiểm', 'Hoàn tất']

export default function StockCount() {
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => stockCountService.list(), mockStockCounts)
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(
    () => rows.filter((c) => statusFilter === 'all' || c.status === statusFilter),
    [rows, statusFilter],
  )

  const inProgress = rows.filter((c) => c.status === 'Đang kiểm').length
  const done = rows.filter((c) => c.status === 'Hoàn tất').length

  const remove = async (row) => {
    if (!(await confirm({ title: 'Xóa phiếu kiểm kê?', message: `Phiếu ${row.code || row.id} sẽ bị xóa vĩnh viễn.`, confirmLabel: 'Xóa', danger: true }))) return
    try {
      await stockCountService.remove(row.id)
      toast.success('Đã xóa phiếu kiểm kê.')
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.3"
        title="Kiểm kê"
        subtitle="Tạo và theo dõi các phiếu kiểm kê tồn kho theo khu vực."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={() => navigate('/app/warehouse/stock-count/new')}>Tạo phiếu</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng phiếu" value={formatNumber(rows.length)} icon={ClipboardList} tone="brand" hint="tất cả" />
        <StatCard label="Đang kiểm" value={formatNumber(inProgress)} icon={ListChecks} tone="amber" hint="chưa hoàn tất" />
        <StatCard label="Hoàn tất" value={formatNumber(done)} icon={Equal} tone="green" hint="đã đóng" />
        <StatCard label="Khu vực" value={formatNumber(new Set(rows.map((c) => c.location)).size)} icon={AlertTriangle} tone="blue" hint="đang kiểm kê" />
      </div>

      <div className="mt-6">
        <FilterBar>
          <Field label="Trạng thái">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </FilterBar>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner className="h-7 w-7" />
          </div>
        ) : (
          <DataTable
            rows={filtered}
            onRowClick={(r) => navigate(`/app/warehouse/stock-count/${r.id}/edit`)}
            empty={{ title: 'Không có phiếu kiểm kê', subtitle: 'Nhấn "Tạo phiếu" để tạo phiếu kiểm kê mới.' }}
            columns={[
              { key: 'code', header: 'Mã phiếu', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
              { key: 'location', header: 'Khu vực' },
              { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'countDate', header: 'Ngày kiểm', render: (r) => formatDate(r.countDate) },
              { key: 'note', header: 'Ghi chú', render: (r) => <span className="text-slate-500">{r.note}</span> },
            ]}
            actions={(r) => (
              <>
                <Button size="sm" variant="secondary" icon={Pencil} onClick={() => navigate(`/app/warehouse/stock-count/${r.id}/edit`)}>Sửa</Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => remove(r)}>Xóa</Button>
              </>
            )}
          />
        )}
      </div>
    </div>
  )
}
