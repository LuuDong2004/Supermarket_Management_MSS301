import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { priceListService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const emptyForm = { productName: '', unit: 'thùng', price: '', moq: '', status: 'Đang bán', note: '' }

// Full-page create / edit catalog item (replaces the old modal).
export default function CatalogItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(emptyForm)
  const [source, setSource] = useState('backend')
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const r = await withFallback(() => priceListService.mine())
      setSource(r.source)
      if (!id) { setForm(emptyForm); setLoading(false); return }
      const item = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!item) {
        toast.error('Không tìm thấy mặt hàng.')
        navigate('/app/supplier/catalog')
        return
      }
      setForm({
        productName: item.productName || '', unit: item.unit || '', price: item.price ?? '',
        moq: item.moq ?? '', status: item.status || 'Đang bán', note: item.note || '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    if (!form.productName.trim()) return toast.error('Nhập tên sản phẩm.')
    if (source !== 'backend') return toast.error('Không có kết nối backend.')
    if (!(await confirm({
      title: id ? 'Lưu thay đổi?' : 'Thêm mặt hàng?',
      message: id
        ? `Cập nhật báo giá cho "${form.productName}".`
        : `Thêm "${form.productName}" vào danh mục cung cấp.`,
      confirmLabel: id ? 'Lưu' : 'Thêm',
    }))) return
    const body = {
      productName: form.productName,
      unit: form.unit || null,
      price: form.price === '' ? 0 : Number(form.price),
      moq: form.moq === '' ? 0 : Number(form.moq),
      status: form.status,
      note: form.note || null,
    }
    setSaving(true)
    try {
      if (id) await priceListService.update(id, body)
      else await priceListService.create(body)
      toast.success(id ? `Đã cập nhật ${form.productName}.` : `Đã thêm ${form.productName}.`)
      navigate('/app/supplier/catalog')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhà cung cấp · 3.11.2"
        title={id ? 'Sửa mặt hàng' : 'Thêm mặt hàng'}
        subtitle={id ? 'Cập nhật báo giá' : 'Thêm sản phẩm vào danh mục cung cấp'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/supplier/catalog')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-3xl">
          <CardBody className="space-y-4">
            <Field label="Tên sản phẩm" required>
              <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="VD: Sữa tươi..." />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Đơn vị"><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="thùng, lốc, kg..." /></Field>
              <Field label="Trạng thái">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Đang bán">Đang bán</option>
                  <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                </Select>
              </Field>
              <Field label="Giá (đ)" required><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
              <Field label="SL tối thiểu (MOQ)"><Input type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} /></Field>
            </div>
            <Field label="Ghi chú"><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/supplier/catalog')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : (id ? 'Lưu' : 'Thêm')}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
