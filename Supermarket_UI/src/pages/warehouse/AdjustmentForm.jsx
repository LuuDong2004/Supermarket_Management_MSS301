import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, Select, Textarea, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import {
  stockAdjustmentService, productService,
  withFallback, toList, mockStockAdjustments, mockProducts,
} from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

// Full-page create stock adjustment request (replaces the old modal).
export default function AdjustmentForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const [list, setList] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ product: '', system: 0, counted: 0, reason: 'Hư hỏng', note: '' })

  useEffect(() => {
    const load = async () => {
      const [adj, prod] = await Promise.all([
        withFallback(() => stockAdjustmentService.list(), mockStockAdjustments),
        withFallback(() => productService.list(), mockProducts),
      ])
      const prodList = toList(prod.data)
      setList(toList(adj.data))
      setProducts(prodList)
      setForm((f) => ({
        ...f,
        product: f.product || prodList[0]?.name || '',
        system: f.product ? f.system : (prodList[0]?.stock ?? 0),
        counted: f.product ? f.counted : (prodList[0]?.stock ?? 0),
      }))
      setLoading(false)
    }
    load()
  }, [])

  const submit = async () => {
    const diff = Number(form.counted) - Number(form.system)
    if (!(await confirm({
      title: 'Gửi yêu cầu điều chỉnh?',
      message: `Tạo yêu cầu điều chỉnh cho ${form.product} với chênh lệch ${diff > 0 ? '+' : ''}${diff} (lý do: ${form.reason}).`,
      confirmLabel: 'Tạo',
    }))) return
    const code = `ADJ-${222 + list.length}`
    setSaving(true)
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
      navigate('/app/warehouse/adjustments')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.4"
        title="Tạo yêu cầu điều chỉnh"
        subtitle="Ghi nhận chênh lệch tồn kho cần điều chỉnh."
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/adjustments')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
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
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/warehouse/adjustments')}>Hủy</Button>
              <Button icon={Save} onClick={submit} disabled={saving}>{saving ? 'Đang gửi...' : 'Gửi yêu cầu'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
