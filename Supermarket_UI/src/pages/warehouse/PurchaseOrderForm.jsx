import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Select, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatCurrency } from '../../lib/format.js'
import {
  purchaseOrderService, supplierService, productService,
  withFallback, toList, mockPurchaseOrders, mockSuppliers, mockProducts,
} from '../../services/index.js'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

// Full-page create purchase order (replaces the old modal).
export default function PurchaseOrderForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({ supplier: '', date: '2026-06-15' })
  const [lines, setLines] = useState([])

  useEffect(() => {
    const load = async () => {
      const [po, sup, prod] = await Promise.all([
        withFallback(() => purchaseOrderService.list(), mockPurchaseOrders),
        withFallback(() => supplierService.list(), mockSuppliers),
        withFallback(() => productService.list(), mockProducts),
      ])
      const supList = toList(sup.data)
      const prodList = toList(prod.data)
      setOrders(toList(po.data))
      setSuppliers(supList)
      setProducts(prodList)
      setForm((f) => ({ ...f, supplier: f.supplier || supList[0]?.name || '' }))
      setLines((l) => (l.length ? l : [{ product: prodList[0]?.name || '', qty: 10, price: prodList[0]?.cost || 0 }]))
      setLoading(false)
    }
    load()
  }, [])

  const addLine = () => setLines((l) => [...l, { product: products[0]?.name || '', qty: 1, price: products[0]?.cost || 0 }])
  const removeLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i))
  const setLine = (i, key, val) => setLines((l) => l.map((x, idx) => (idx === i ? { ...x, [key]: val } : x)))
  const draftTotal = lines.reduce((s, x) => s + Number(x.qty) * Number(x.price), 0)

  const createOrder = async () => {
    if (!(await confirm({
      title: 'Tạo đơn mua hàng?',
      message: `Tạo đơn mua từ ${form.supplier} với ${lines.length} mặt hàng, tổng ${formatCurrency(draftTotal)}.`,
      confirmLabel: 'Tạo',
    }))) return
    const code = `PO-2026-0${42 + orders.length}`
    setSaving(true)
    try {
      await purchaseOrderService.create({
        code,
        supplier: form.supplier,
        orderDate: form.date,
        items: lines.length,
        total: draftTotal,
        status: 'Pending',
        approval: 'Chờ duyệt',
      })
      toast.success(`Đã tạo đơn mua ${code}.`)
      navigate('/app/warehouse/purchase-orders')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.1"
        title="Tạo đơn mua hàng"
        subtitle="Chọn nhà cung cấp và thêm các mặt hàng cần đặt."
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/purchase-orders')}>Quay lại danh sách</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nhà cung cấp" required>
                  <Select value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}>
                    {suppliers.map((s) => (
                      <option key={s.id || s.code} value={s.name}>{s.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Ngày đặt" required>
                  <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                </Field>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Danh sách mặt hàng</p>
                <Button variant="secondary" size="sm" icon={Plus} onClick={addLine}>Thêm dòng</Button>
              </div>

              <div className="space-y-2">
                {lines.map((ln, i) => (
                  <div key={i} className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-6">
                      <Select value={ln.product} onChange={(e) => setLine(i, 'product', e.target.value)}>
                        {products.map((p) => (
                          <option key={p.id || p.code} value={p.name}>{p.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input type="number" min={1} value={ln.qty} onChange={(e) => setLine(i, 'qty', e.target.value)} placeholder="SL" />
                    </div>
                    <div className="col-span-3">
                      <Input type="number" min={0} value={ln.price} onChange={(e) => setLine(i, 'price', e.target.value)} placeholder="Đơn giá" />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button onClick={() => removeLine(i)} className="rounded p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-500">Tổng giá trị dự kiến</span>
                <span className="text-lg font-bold text-brand-700">{formatCurrency(draftTotal)}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => navigate('/app/warehouse/purchase-orders')}>Hủy</Button>
              <Button icon={Save} onClick={createOrder} disabled={saving}>{saving ? 'Đang lưu...' : 'Tạo đơn'}</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
