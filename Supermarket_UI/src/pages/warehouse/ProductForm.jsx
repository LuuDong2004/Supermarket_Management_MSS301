import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { productService, categoryService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const emptyProduct = { code: '', barcode: '', name: '', category: '', price: '', cost: '', stock: '', unit: 'cái', expiry: '' }

// Full-page create / edit product (replaces the old modal).
export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [form, setForm] = useState(emptyProduct)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('backend')

  useEffect(() => {
    const load = async () => {
      const c = await withFallback(() => categoryService.list())
      const cats = toList(c.data).filter((x) => x.active)
      setCategories(cats)
      setSource(c.source)
      if (id) {
        const r = await withFallback(() => productService.get(id))
        const p = r.data
        if (!p) {
          toast.error('Không tìm thấy sản phẩm.')
          navigate('/app/warehouse/products')
          return
        }
        setForm({
          code: p.code || '', barcode: p.barcode || '', name: p.name || '', category: p.category || '',
          price: p.price ?? '', cost: p.cost ?? '', stock: p.stock ?? '', unit: p.unit || '',
          expiry: (p.expiry || '').slice(0, 10),
        })
      } else {
        setForm({ ...emptyProduct, category: cats[0]?.name || '' })
      }
      setLoading(false)
    }
    load()
  }, [id])

  const save = async () => {
    if (!form.name.trim() || !form.code.trim()) { toast.error('Nhập mã và tên sản phẩm.'); return }
    if (source !== 'backend') { toast.error('Không có kết nối backend.'); return }
    if (!(await confirm({
      title: id ? 'Lưu thay đổi?' : 'Thêm sản phẩm?',
      message: id ? `Cập nhật sản phẩm ${form.name} (${form.code}).` : `Thêm sản phẩm mới ${form.name} (${form.code}).`,
      confirmLabel: id ? 'Lưu' : 'Thêm',
    }))) return
    const body = {
      code: form.code, barcode: form.barcode || null, name: form.name, category: form.category,
      price: Number(form.price) || 0, cost: Number(form.cost) || 0, stock: Number(form.stock) || 0,
      unit: form.unit || null, expiry: form.expiry || null,
    }
    setSaving(true)
    try {
      if (id) await productService.update(id, body)
      else await productService.create(body)
      toast.success(id ? `Đã cập nhật ${form.name}.` : `Đã thêm ${form.name}.`)
      navigate('/app/warehouse/products')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.5"
        title={id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        subtitle={id ? `Cập nhật sản phẩm ${form.code}` : 'Tạo sản phẩm mới'}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/products')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Mã sản phẩm" required>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} disabled={!!id} />
              </Field>
              <Field label="Barcode">
                <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              </Field>
              <Field label="Tên sản phẩm" required className="sm:col-span-2 lg:col-span-1">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Danh mục">
                <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.length === 0 && <option value="">—</option>}
                  {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Đơn vị">
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="cái, chai, thùng..." />
              </Field>
              <Field label="Hạn dùng">
                <Input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
              </Field>
              <Field label="Giá bán" required>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </Field>
              <Field label="Giá vốn" required>
                <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              </Field>
              <Field label="Tồn kho" required>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/warehouse/products')}>Hủy</Button>
              <Button icon={Save} onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : id ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
