import { useMemo, useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Input, Select, Textarea, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import {
  stockAdjustmentService, productService,
  withFallback, toList, mockStockAdjustments, mockProducts,
} from '../../services/index.js'
import { Plus, Check, X } from 'lucide-react'

const REASON_TONE = { 'Hư hỏng': 'amber', 'Vỡ': 'red', 'Thất thoát': 'violet', 'Hết hạn': 'slate' }

export default function Adjustments() {
  const toast = useToast()
  const [list, setList] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ product: '', system: 0, counted: 0, reason: 'Hư hỏng', note: '' })

  const load = async () => {
    setLoading(true)
    const [adj, prod] = await Promise.all([
      withFallback(() => stockAdjustmentService.list(), mockStockAdjustments),
      withFallback(() => productService.list(), mockProducts),
    ])
    const prodList = toList(prod.data)
    setList(toList(adj.data))
    setProducts(prodList)
    setSource(adj.source)
    setForm((f) => ({
      ...f,
      product: f.product || prodList[0]?.name || '',
      system: f.product ? f.system : (prodList[0]?.stock ?? 0),
      counted: f.product ? f.counted : (prodList[0]?.stock ?? 0),
    }))
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

  const submit = async () => {
    const diff = Number(form.counted) - Number(form.system)
    const code = `ADJ-${222 + list.length}`
    try {
      await stockAdjustmentService.create({
        code,
        product: form.product,
        systemQty: Number(form.system),
        countedQty: Number(form.counted),
        diff,
        reason: form.reason,
        adjDate: '2026-06-15',
        status: 'Chờ duyệt',
      })
      toast.success(`Đã tạo yêu cầu điều chỉnh ${code}.`)
      setOpen(false)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

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
            <Button icon={Plus} onClick={() => setOpen(true)}>Tạo yêu cầu điều chỉnh</Button>
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
            {
              key: 'actions',
              header: 'Thao tác',
              align: 'right',
              render: (r) =>
                r.status === 'Chờ duyệt' ? (
                  <div className="flex justify-end gap-2">
                    <Button variant="success" size="sm" icon={Check} onClick={() => decide(r, true)}>Duyệt</Button>
                    <Button variant="danger" size="sm" icon={X} onClick={() => decide(r, false)}>Từ chối</Button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                ),
            },
          ]}
        />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tạo yêu cầu điều chỉnh"
        subtitle="Ghi nhận chênh lệch tồn kho cần điều chỉnh."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={submit}>Gửi yêu cầu</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Sản phẩm" required>
            <Select value={form.product} onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}>
              {products.map((p) => (
                <option key={p.id || p.code} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tồn hệ thống" required>
              <Input type="number" value={form.system} onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))} />
            </Field>
            <Field label="Thực đếm" required>
              <Input type="number" value={form.counted} onChange={(e) => setForm((f) => ({ ...f, counted: e.target.value }))} />
            </Field>
          </div>
          <Field label="Lý do" required>
            <Select value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}>
              <option value="Hư hỏng">Hư hỏng</option>
              <option value="Vỡ">Vỡ</option>
              <option value="Thất thoát">Thất thoát</option>
              <option value="Hết hạn">Hết hạn</option>
            </Select>
          </Field>
          <Field label="Ghi chú" hint="Mô tả thêm về nguyên nhân điều chỉnh.">
            <Textarea rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Nhập ghi chú..." />
          </Field>
          <Divider />
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Chênh lệch dự kiến</span>
            <Badge tone={Number(form.counted) - Number(form.system) >= 0 ? 'green' : 'red'}>
              {Number(form.counted) - Number(form.system) > 0 ? '+' : ''}{Number(form.counted) - Number(form.system)}
            </Badge>
          </div>
        </div>
      </Modal>
    </div>
  )
}
