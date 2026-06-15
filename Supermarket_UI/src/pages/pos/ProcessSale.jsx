import { useState, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Field, Input, Badge } from '../../components/ui/primitives.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Search, Plus, Minus, Trash2, ScanLine, ShoppingCart, UserPlus, BadgePercent, X } from 'lucide-react'

const VAT_RATE = 0.08

export default function ProcessSale() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([
    { ...db.products[0], qty: 5 },
    { ...db.products[1], qty: 2 },
  ])
  const [customer, setCustomer] = useState(null)
  const [voucher, setVoucher] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [checkout, setCheckout] = useState(false)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return db.products.filter((p) => p.name.toLowerCase().includes(q) || p.barcode.includes(q)).slice(0, 6)
  }, [query])

  const addProduct = (p) => {
    setCart((c) => {
      const found = c.find((x) => x.id === p.id)
      if (found) return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
      return [...c, { ...p, qty: 1 }]
    })
    setQuery('')
  }

  const changeQty = (id, d) =>
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x)))
  const removeItem = (id) => setCart((c) => c.filter((x) => x.id !== id))

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0)
  const memberDiscount = customer ? Math.round(subtotal * 0.02) : 0
  let voucherDiscount = 0
  if (appliedVoucher && subtotal >= appliedVoucher.min) {
    voucherDiscount = appliedVoucher.type === 'percent' ? Math.round((subtotal * appliedVoucher.value) / 100) : appliedVoucher.value
  }
  const discount = memberDiscount + voucherDiscount
  const vat = Math.round((subtotal - discount) * VAT_RATE)
  const grandTotal = subtotal - discount + vat

  const applyVoucher = () => {
    const v = db.vouchers.find((x) => x.code.toLowerCase() === voucher.trim().toLowerCase())
    if (!v) return toast.error('Mã voucher không hợp lệ.')
    if (subtotal < v.min) return toast.error(`Đơn tối thiểu ${formatCurrency(v.min)} để dùng mã này.`)
    setAppliedVoucher(v)
    toast.success(`Đã áp dụng ${v.code}.`)
  }

  const confirmCheckout = () => {
    setCheckout(false)
    setCart([])
    setAppliedVoucher(null)
    setCustomer(null)
    setVoucher('')
    toast.success('Thanh toán thành công! Hóa đơn đã được tạo.')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.1"
        title="Bán hàng"
        subtitle="Quét mã hoặc tìm sản phẩm để thêm vào giỏ và thanh toán."
        actions={<Badge tone="green" dot>Ca đang mở · SH-330</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product entry + cart */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Nhập sản phẩm" icon={ScanLine} subtitle="Barcode / tên sản phẩm" />
            <CardBody>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="Quét mã vạch hoặc nhập tên sản phẩm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && matches[0] && addProduct(matches[0])}
                  autoFocus
                />
                {matches.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card-hover">
                    {matches.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addProduct(p)}
                        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-brand-50"
                      >
                        <span>
                          <span className="font-medium text-slate-700">{p.name}</span>
                          <span className="ml-2 font-mono text-xs text-slate-400">{p.barcode}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{formatCurrency(p.price)}</span>
                          <Plus size={15} className="text-brand-600" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {db.products.slice(0, 5).map((p) => (
                  <button key={p.id} onClick={() => addProduct(p)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:border-brand-300 hover:bg-brand-50">
                    {p.name.split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Giỏ hàng" icon={ShoppingCart} subtitle={`${cart.length} mặt hàng`} />
            <CardBody className="p-0">
              {cart.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-400">Giỏ hàng trống. Thêm sản phẩm để bắt đầu.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                      <th className="px-4 py-2.5">Sản phẩm</th>
                      <th className="px-4 py-2.5 text-center">Số lượng</th>
                      <th className="px-4 py-2.5 text-right">Đơn giá</th>
                      <th className="px-4 py-2.5 text-right">Thành tiền</th>
                      <th className="px-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.map((x) => (
                      <tr key={x.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-700">{x.name}</p>
                          <p className="font-mono text-xs text-slate-400">{x.barcode}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="mx-auto flex w-fit items-center gap-1 rounded-lg border border-slate-200">
                            <button onClick={() => changeQty(x.id, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100"><Minus size={13} /></button>
                            <span className="w-8 text-center font-medium">{x.qty}</span>
                            <button onClick={() => changeQty(x.id, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-100"><Plus size={13} /></button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(x.price)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(x.price * x.qty)}</td>
                        <td className="px-2">
                          <button onClick={() => removeItem(x.id)} className="rounded p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Checkout summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Thông tin thanh toán" icon={BadgePercent} />
            <CardBody className="space-y-4">
              <Field label="Khách hàng thành viên">
                {customer ? (
                  <div className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-brand-800">{customer.name}</p>
                      <p className="text-xs text-brand-600">{customer.tier} · {customer.points} điểm</p>
                    </div>
                    <button onClick={() => setCustomer(null)} className="text-brand-400 hover:text-brand-600"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="SĐT / mã thành viên" className="flex-1" id="memq" />
                    <Button variant="secondary" icon={UserPlus} onClick={() => setCustomer(db.customers[0])}>Tìm</Button>
                  </div>
                )}
              </Field>

              <Field label="Khuyến mãi / Voucher">
                <div className="flex gap-2">
                  <Input placeholder="Nhập mã voucher" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="flex-1" />
                  <Button variant="secondary" onClick={applyVoucher}>Áp dụng</Button>
                </div>
                {appliedVoucher && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
                    <span>✓ {appliedVoucher.label}</span>
                    <button onClick={() => setAppliedVoucher(null)}><X size={14} /></button>
                  </div>
                )}
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Tổng kết" />
            <CardBody className="space-y-2.5 text-sm">
              <Row label="Tạm tính" value={formatCurrency(subtotal)} />
              {memberDiscount > 0 && <Row label="Ưu đãi thành viên (2%)" value={`- ${formatCurrency(memberDiscount)}`} tone="green" />}
              {voucherDiscount > 0 && <Row label={`Voucher ${appliedVoucher.code}`} value={`- ${formatCurrency(voucherDiscount)}`} tone="green" />}
              <Row label={`VAT (${VAT_RATE * 100}%)`} value={formatCurrency(vat)} />
              <div className="my-2 h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Thành tiền</span>
                <span className="text-xl font-bold text-brand-700">{formatCurrency(grandTotal)}</span>
              </div>
              <Button size="lg" className="mt-2 w-full" disabled={cart.length === 0} onClick={() => setCheckout(true)}>
                Thanh toán
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={checkout}
        onClose={() => setCheckout(false)}
        title="Xác nhận thanh toán"
        subtitle={`${cart.length} mặt hàng · ${formatCurrency(grandTotal)}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCheckout(false)}>Hủy</Button>
            <Button variant="success" onClick={confirmCheckout}>Xác nhận & In hóa đơn</Button>
          </>
        }
      >
        <div className="space-y-2 text-sm">
          <Row label="Tạm tính" value={formatCurrency(subtotal)} />
          <Row label="Giảm giá" value={`- ${formatCurrency(discount)}`} tone="green" />
          <Row label="VAT" value={formatCurrency(vat)} />
          <div className="my-2 h-px bg-slate-100" />
          <Row label="Khách phải trả" value={formatCurrency(grandTotal)} bold />
          <p className="pt-2 text-xs text-slate-400">Chọn phương thức thanh toán ở màn hình “Xử lý thanh toán” (3.8.2) khi tích hợp backend sales-service.</p>
        </div>
      </Modal>
    </div>
  )
}

function Row({ label, value, tone, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={
        (tone === 'green' ? 'text-emerald-600 ' : 'text-slate-700 ') + (bold ? 'text-base font-bold' : 'font-medium')
      }>{value}</span>
    </div>
  )
}
