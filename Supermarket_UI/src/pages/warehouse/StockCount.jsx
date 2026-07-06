import { useMemo, useState, useEffect } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Select, Input, Textarea, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber, formatDate } from '../../lib/format.js'
import { stockCountService, withFallback, toList, mockStockCounts } from '../../services/index.js'
import { ClipboardList, ListChecks, AlertTriangle, Equal, Save, RotateCcw } from 'lucide-react'

const STATUSES = ['Đang kiểm', 'Hoàn tất']
const emptyForm = { id: null, code: '', location: 'Kho A', status: 'Đang kiểm', countDate: '2026-06-15', note: '' }

export default function StockCount() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState(emptyForm)

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

  const editRow = (c) => setForm({ id: c.id, code: c.code || '', location: c.location || 'Kho A', status: c.status || 'Đang kiểm', countDate: c.countDate || '2026-06-15', note: c.note || '' })
  const resetForm = () => setForm(emptyForm)

  const save = async () => {
    const payload = {
      code: form.code,
      location: form.location,
      status: form.status,
      countDate: form.countDate,
      note: form.note,
    }
    try {
      if (form.id) await stockCountService.update(form.id, payload)
      else await stockCountService.create(payload)
      toast.success('Đã lưu phiếu kiểm kê.')
      await load()
      resetForm()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const remove = async (row) => {
    try {
      await stockCountService.remove(row.id)
      toast.success('Đã xóa phiếu kiểm kê.')
      await load()
      if (form.id === row.id) resetForm()
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
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng phiếu" value={formatNumber(rows.length)} icon={ClipboardList} tone="brand" hint="tất cả" />
        <StatCard label="Đang kiểm" value={formatNumber(inProgress)} icon={ListChecks} tone="amber" hint="chưa hoàn tất" />
        <StatCard label="Hoàn tất" value={formatNumber(done)} icon={Equal} tone="green" hint="đã đóng" />
        <StatCard label="Khu vực" value={formatNumber(new Set(rows.map((c) => c.location)).size)} icon={AlertTriangle} tone="blue" hint="đang kiểm kê" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
              onRowClick={editRow}
              empty={{ title: 'Không có phiếu kiểm kê', subtitle: 'Tạo phiếu mới ở biểu mẫu bên phải.' }}
              columns={[
                { key: 'code', header: 'Mã phiếu', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
                { key: 'location', header: 'Khu vực' },
                { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
                { key: 'countDate', header: 'Ngày kiểm', render: (r) => formatDate(r.countDate) },
                { key: 'note', header: 'Ghi chú', render: (r) => <span className="text-slate-500">{r.note}</span> },
                { key: 'actions', header: '', align: 'right', render: (r) => (
                  <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); remove(r) }}>Xóa</Button>
                ) },
              ]}
            />
          )}
        </div>

        <div>
          <Card>
            <CardHeader title="Phiếu kiểm kê" subtitle={form.id ? `Đang sửa: ${form.code}` : 'Tạo phiếu mới'} icon={ClipboardList} />
            <CardBody className="space-y-4">
              <Field label="Mã phiếu" required>
                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="SC-03" />
              </Field>
              <Field label="Khu vực" required>
                <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Kho A" />
              </Field>
              <Field label="Trạng thái">
                <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Ngày kiểm" required>
                <Input type="date" value={form.countDate} onChange={(e) => setForm((f) => ({ ...f, countDate: e.target.value }))} />
              </Field>
              <Field label="Ghi chú">
                <Textarea rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Nhập ghi chú..." />
              </Field>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Button icon={Save} onClick={save}>{form.id ? 'Lưu thay đổi' : 'Tạo phiếu'}</Button>
                {form.id && <Button variant="ghost" icon={RotateCcw} onClick={resetForm}>Mới</Button>}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
