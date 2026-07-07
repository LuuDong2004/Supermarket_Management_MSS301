import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Field, Input, Badge } from '../../components/ui/primitives.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { DEFAULT_SEPAY_CONFIG, buildVietQrUrl, normalizeSePayConfig } from '../../config/sepay.js'
import {
  productService, saleService, customerService, voucherService,
  withFallback, toList, mockProducts, mockCustomers, mockVouchers,
} from '../../services/index.js'
import {
  Search, Plus, Minus, Trash2, ScanLine, ShoppingCart, UserPlus, BadgePercent, X,
  Banknote, QrCode, CheckCircle2, Printer
} from 'lucide-react'

const TIER_STYLES = {
  Platinum: 'bg-violet-50 text-violet-700 border-violet-200',
  Gold: 'bg-amber-50 text-amber-700 border-amber-200',
  Silver: 'bg-slate-100 text-slate-700 border-slate-200',
  Member: 'bg-blue-50 text-blue-700 border-blue-200',
}

const METHODS = [
  { key: 'cash', label: 'Tiền mặt', icon: Banknote },
  { key: 'qr', label: 'QR Code', icon: QrCode },
]

const QUICK_CASH = [500000, 200000, 100000, 50000]

const getProductImage = (name, category) => {
  const n = (name || '').toLowerCase()
  const c = (category || '').toLowerCase()
  if (n.includes('sữa')) return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=60'
  if (n.includes('gạo')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=60'
  if (n.includes('dầu')) return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&auto=format&fit=crop&q=60'
  if (n.includes('mì')) return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&auto=format&fit=crop&q=60'
  if (n.includes('nước ngọt') || n.includes('coca')) return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=60'
  if (n.includes('trứng')) return 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=100&auto=format&fit=crop&q=60'
  if (n.includes('giặt') || n.includes('omo')) return 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=100&auto=format&fit=crop&q=60'
  if (n.includes('nước mắm')) return 'https://images.unsplash.com/photo-1589135799982-f54924748db8?w=100&auto=format&fit=crop&q=60'
  if (n.includes('cà phê')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&auto=format&fit=crop&q=60'
  if (n.includes('khăn')) return 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=100&auto=format&fit=crop&q=60'
  
  if (c.includes('đồ uống')) return 'https://images.unsplash.com/photo-1527960656366-ee2a999e32e6?w=100&auto=format&fit=crop&q=60'
  if (c.includes('khô')) return 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=100&auto=format&fit=crop&q=60'
  if (c.includes('tươi')) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=60'
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60'
}

export default function ProcessSale() {
  const toast = useToast()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [source, setSource] = useState('backend')
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState(null)
  const [voucher, setVoucher] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  
  // Keyboard Navigation State
  const [activeIndex, setActiveIndex] = useState(-1)

  // Checkout Modal State
  const [checkout, setCheckout] = useState(false)
  const [method, setMethod] = useState('cash')
  const [given, setGiven] = useState('')
  
  // Receipt Modal State
  const [receipt, setReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  // SePay Integration States
  const [sepayConfig, setSepayConfig] = useState(DEFAULT_SEPAY_CONFIG)
  const [pendingSale, setPendingSale] = useState(null)

  useEffect(() => {
    ;(async () => {
      const [rp, rc, rv] = await Promise.all([
        withFallback(() => productService.list(), mockProducts),
        withFallback(() => customerService.list(), mockCustomers),
        withFallback(() => voucherService.list(), mockVouchers),
      ])
      setProducts(toList(rp.data))
      setCustomers(toList(rc.data))
      setVouchers(toList(rv.data))
      setSource(rp.source)

      try {
        const conf = await saleService.getSePayConfig()
        if (conf) {
          setSepayConfig(normalizeSePayConfig(conf))
        }
      } catch (err) {
        console.warn('Cannot fetch SePay config, using default values', err)
      }
    })()
  }, [])

  // Poll pending transaction status
  useEffect(() => {
    if (!pendingSale) return

    let active = true
    const timer = setInterval(async () => {
      try {
        const resp = await saleService.get(pendingSale.id)
        if (!active) return

        if (resp?.status === 'COMPLETED') {
          clearInterval(timer)
          toast.success('Thanh toán SePay thành công!')
          setLastOrder({
            code: pendingSale.code,
            methodLabel: 'QR Code (SePay)',
            total: pendingSale.total,
            givenNum: 0,
            change: 0,
          })
          setReceipt(true)
          setCheckout(false)
          setCart([])
          setAppliedVoucher(null)
          setCustomer(null)
          setVoucher('')
          setGiven('')
          setMethod('cash')
          setPendingSale(null)
        }
      } catch (e) {
        console.error('Polling error', e)
      }
    }, 2000)

    return () => {
      active = false
      clearInterval(timer)
    }
  }, [pendingSale])

  const handleCancelPending = async () => {
    if (!pendingSale) return
    try {
      await saleService.updateStatus(pendingSale.id, 'CANCELLED')
      toast.info('Đã hủy giao dịch chuyển khoản.')
      setPendingSale(null)
      setCheckout(false)
    } catch (e) {
      toast.error('Lỗi khi hủy giao dịch: ' + e.message)
    }
  }

  const handleCompleteCash = async () => {
    if (!pendingSale) return
    try {
      await saleService.completeCash(pendingSale.id)
      toast.success('Đã chuyển đổi sang thanh toán tiền mặt thành công!')
      setLastOrder({
        code: pendingSale.code,
        methodLabel: 'Tiền mặt',
        total: pendingSale.total,
        givenNum: pendingSale.total,
        change: 0,
      })
      setReceipt(true)
      setCheckout(false)
      setCart([])
      setAppliedVoucher(null)
      setCustomer(null)
      setVoucher('')
      setGiven('')
      setMethod('cash')
      setPendingSale(null)
    } catch (e) {
      toast.error('Lỗi chuyển phương thức: ' + e.message)
    }
  }

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.barcode || '').includes(q)).slice(0, 6)
  }, [query, products])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  const addProduct = (p) => {
    if (p.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng trong kho.')
      return
    }
    setCart((c) => {
      const found = c.find((x) => x.id === p.id)
      if (found) {
        if (found.qty >= p.stock) {
          toast.error(`Không thể thêm. Tồn kho tối đa: ${p.stock}`)
          return c
        }
        return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
      }
      return [...c, { ...p, qty: 1 }]
    })
    setQuery('')
    setActiveIndex(-1)
  }

  const changeQty = (id, d) => {
    const prod = products.find((p) => p.id === id)
    setCart((c) => c.map((x) => {
      if (x.id === id) {
        const nextQty = x.qty + d
        if (nextQty > (prod?.stock ?? 999)) {
          toast.error(`Vượt quá số lượng tồn kho (${prod?.stock})`)
          return x
        }
        return { ...x, qty: Math.max(1, nextQty) }
      }
      return x
    }))
  }

  const removeItem = (id) => setCart((c) => c.filter((x) => x.id !== id))

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < matches.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : matches.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < matches.length) {
        addProduct(matches[activeIndex])
      } else if (matches[0]) {
        addProduct(matches[0])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setQuery('')
      setActiveIndex(-1)
    }
  }

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0)
  const memberDiscount = customer ? Math.round(subtotal * 0.02) : 0
  const voucherMin = (v) => v?.minSpend ?? v?.min ?? 0
  let voucherDiscount = 0
  if (appliedVoucher && subtotal >= voucherMin(appliedVoucher)) {
    voucherDiscount = appliedVoucher.type === 'percent' ? Math.round((subtotal * appliedVoucher.value) / 100) : appliedVoucher.value
  }
  const discount = memberDiscount + voucherDiscount
  const grandTotal = subtotal - discount

  const givenNum = Number(given) || 0
  const change = useMemo(() => Math.max(0, givenNum - grandTotal), [givenNum, grandTotal])
  const enoughCash = method !== 'cash' || givenNum >= grandTotal

  const applyVoucher = () => {
    const v = vouchers.find((x) => (x.code || '').toLowerCase() === voucher.trim().toLowerCase())
    if (!v) return toast.error('Mã voucher không hợp lệ.')
    if (subtotal < voucherMin(v)) return toast.error(`Đơn tối thiểu ${formatCurrency(voucherMin(v))} để dùng mã này.`)
    setAppliedVoucher(v)
    toast.success(`Đã áp dụng ${v.code}.`)
  }

  const confirmCheckout = async () => {
    if (method === 'cash' && !enoughCash) return toast.error('Số tiền khách đưa chưa đủ.')
    const now = new Date()
    const methodLabel = METHODS.find((m) => m.key === method)?.label
    const orderCode = `INV-${now.getTime()}`
    
    const payload = {
      code: orderCode,
      saleTime: now.toTimeString().slice(0, 5),
      cashier: user?.fullName || user?.username || 'Thu ngân',
      items: cart.length,
      total: grandTotal,
      payment: methodLabel,
      status: method === 'qr' ? 'PENDING' : 'COMPLETED'
    }
    
    try {
      const resp = await saleService.create(payload)
      const createdSale = resp
      
      if (method === 'qr') {
        setPendingSale(createdSale)
        toast.info('Đã tạo đơn hàng chờ thanh toán QR.')
      } else {
        toast.success('Thanh toán thành công! Hóa đơn đã được tạo.')
        setLastOrder({
          code: orderCode,
          methodLabel,
          total: grandTotal,
          givenNum: method === 'cash' ? givenNum : 0,
          change: method === 'cash' ? change : 0,
        })
        setReceipt(true)
        setCheckout(false)
        setCart([])
        setAppliedVoucher(null)
        setCustomer(null)
        setVoucher('')
        setGiven('')
        setMethod('cash')
      }
    } catch (e) {
      toast.error(`Không tạo được hóa đơn: ${e.message}`)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.1"
        title="Bán hàng & Thanh toán"
        subtitle="Quét mã hoặc tìm sản phẩm để thêm vào giỏ. Hoàn tất quy trình trên cùng một màn hình."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Products & Cart (col-span-2) */}
        <div className="space-y-6 lg:col-span-2">
          <Card hoverEffect>
            <CardHeader title="Nhập sản phẩm" icon={ScanLine} subtitle="Barcode / tên sản phẩm" />
            <CardBody>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-10"
                  placeholder="Quét mã vạch hoặc nhập tên sản phẩm... (Mũi tên Lên/Xuống để duyệt, Enter chọn)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                {matches.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-premium-hover">
                    {matches.map((p, index) => {
                      const active = index === activeIndex
                      return (
                        <button
                          key={p.id}
                          onClick={() => addProduct(p)}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition-colors ${active ? 'bg-brand-50 border-l-4 border-brand-600' : 'hover:bg-slate-50'}`}
                        >
                          <span className="flex items-center gap-3.5">
                            <img src={getProductImage(p.name, p.category)} alt={p.name} className="h-9 w-9 rounded-xl border border-slate-100 object-cover flex-shrink-0 bg-slate-50 shadow-sm" />
                            <span className="flex flex-col">
                              <span className="font-semibold text-slate-700">{p.name}</span>
                              <span className="font-mono text-xs text-slate-400 mt-0.5">
                                {p.barcode} · <span className="text-brand-600 font-bold uppercase text-[10px]">{p.category}</span> · Tồn: <span className={p.stock > 0 ? "text-slate-600 font-medium" : "text-rose-500 font-semibold"}>{p.stock > 0 ? `${p.stock} ${p.unit || 'đv'}` : 'Hết hàng'}</span>
                              </span>
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800">{formatCurrency(p.price)}</span>
                            <Plus size={15} className="text-brand-600" />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">Sản phẩm phổ biến (Chọn nhanh)</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
                  {products.slice(0, 8).map((p) => {
                    const outOfStock = p.stock <= 0
                    return (
                      <button
                        key={p.id}
                        onClick={() => addProduct(p)}
                        disabled={outOfStock}
                        className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-center transition-all duration-300 hover:bg-brand-50/50 hover:border-brand-200 hover:shadow-premium-hover disabled:opacity-50 disabled:hover:bg-slate-50/50 disabled:hover:border-slate-100 disabled:hover:shadow-none"
                      >
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                          <img
                            src={getProductImage(p.name, p.category)}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {outOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold text-white uppercase">Hết hàng</div>
                          )}
                        </div>
                        <span className="mt-2 block truncate text-xs font-bold text-slate-700 w-full group-hover:text-brand-900">{p.name}</span>
                        <span className="mt-0.5 block text-xs font-extrabold text-brand-600">{formatCurrency(p.price)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hoverEffect>
            <CardHeader title="Giỏ hàng hiện tại" icon={ShoppingCart} subtitle={`${cart.length} mặt hàng`} />
            <CardBody className="p-0">
              {cart.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-400">Giỏ hàng trống. Thêm sản phẩm để bắt đầu.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-5 py-3.5">Sản phẩm</th>
                        <th className="px-4 py-3.5 text-center">Số lượng</th>
                        <th className="px-4 py-3.5 text-right">Đơn giá</th>
                        <th className="px-4 py-3.5 text-right">Thành tiền</th>
                        <th className="px-4 py-3.5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cart.map((x) => (
                        <tr key={x.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 last:border-b-0">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img src={getProductImage(x.name, x.category)} alt={x.name} className="h-10 w-10 rounded-xl border border-slate-100 object-cover flex-shrink-0 bg-slate-50 shadow-sm" />
                              <div>
                                <p className="font-semibold text-slate-700">{x.name}</p>
                                <p className="font-mono text-[10px] text-slate-400 mt-0.5">{x.barcode} · <span className="text-brand-600 font-bold uppercase text-[9px]">{x.category}</span></p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="mx-auto flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                              <button onClick={() => changeQty(x.id, -1)} className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors"><Minus size={12} /></button>
                              <span className="w-8 text-center text-sm font-bold text-slate-700">{x.qty}</span>
                              <button onClick={() => changeQty(x.id, 1)} className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors"><Plus size={12} /></button>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right text-slate-600 font-medium">{formatCurrency(x.price)}</td>
                          <td className="px-4 py-3.5 text-right font-bold text-slate-800">{formatCurrency(x.price * x.qty)}</td>
                          <td className="px-4 py-3.5 text-center">
                            <button onClick={() => removeItem(x.id)} className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"><Trash2 size={15} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Checkout Summary (col-span-1) */}
        <div className="space-y-6">
          <Card hoverEffect>
            <CardHeader title="Khách hàng & Khuyến mãi" icon={UserPlus} />
            <CardBody className="space-y-4">
              <Field label="Khách hàng thành viên">
                {customer ? (
                  <div className={`flex items-center justify-between rounded-xl border px-4 py-3 shadow-sm transition-all ${TIER_STYLES[customer.tier] || TIER_STYLES.Member}`}>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{customer.name}</p>
                      <p className="text-[10px] uppercase font-bold opacity-80 mt-0.5">{customer.tier} · {customer.points} điểm</p>
                    </div>
                    <button onClick={() => setCustomer(null)} className="opacity-60 hover:opacity-100 transition-opacity"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="SĐT / mã thành viên" className="flex-1" id="memq" />
                    <Button variant="secondary" icon={UserPlus} onClick={() => customers[0] ? setCustomer(customers[0]) : toast.error('Chưa có dữ liệu khách hàng.')}>Tìm</Button>
                  </div>
                )}
              </Field>

              <Field label="Khuyến mãi / Voucher">
                <div className="flex gap-2">
                  <Input placeholder="Nhập mã voucher" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="flex-1" />
                  <Button variant="secondary" onClick={applyVoucher}>Áp dụng</Button>
                </div>
                {appliedVoucher && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-4.5 py-2.5 text-xs text-emerald-700 border border-emerald-200 shadow-sm">
                    <span className="font-semibold">✓ {appliedVoucher.label}</span>
                    <button onClick={() => setAppliedVoucher(null)} className="hover:text-emerald-950 transition-colors"><X size={14} /></button>
                  </div>
                )}
              </Field>
            </CardBody>
          </Card>

          <Card hoverEffect>
            <CardHeader title="Tổng kết thanh toán" icon={BadgePercent} />
            <CardBody className="space-y-3.5">
              <Row label="Tạm tính" value={formatCurrency(subtotal)} />
              
              {customer && (
                <div className={`flex items-center justify-between rounded-xl border px-3.5 py-2 text-xs font-bold shadow-sm ${TIER_STYLES[customer.tier] || TIER_STYLES.Member}`}>
                  <span>Ưu đãi hạng {customer.tier} (2%)</span>
                  <span>- {formatCurrency(memberDiscount)}</span>
                </div>
              )}

              {appliedVoucher && (
                <div className="flex flex-col gap-0.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-2 text-xs font-bold shadow-sm">
                  <div className="flex items-center justify-between">
                    <span>Voucher: {appliedVoucher.code}</span>
                    <span>- {formatCurrency(voucherDiscount)}</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-medium">{appliedVoucher.label}</span>
                </div>
              )}

              {customer && (
                <div className="flex items-center justify-between text-xs text-brand-600 font-bold pt-1">
                  <span>Điểm tích lũy dự kiến:</span>
                  <span className="font-bold text-brand-700">+{formatNumber(Math.floor(grandTotal / 10000))} điểm</span>
                </div>
              )}
              
              <div className="my-4 h-px bg-slate-100" />
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Khách phải trả</span>
                <span className="text-xl font-extrabold text-brand-600 font-display">{formatCurrency(grandTotal)}</span>
              </div>
              
              <Button 
                size="lg"
                className="mt-5 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold"
                disabled={cart.length === 0} 
                onClick={() => setCheckout(true)}
              >
                Tiến hành thanh toán
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Unified Checkout Modal */}
      <Modal
        open={checkout}
        onClose={() => {
          if (pendingSale) {
            toast.warning('Vui lòng hủy hoặc xác nhận thanh toán tiền mặt trước khi đóng.')
            return
          }
          setCheckout(false)
        }}
        title={pendingSale ? 'Chờ quét mã thanh toán' : 'Thanh toán đơn hàng'}
        subtitle={pendingSale ? `Mã hóa đơn: ${pendingSale.code} · Số tiền: ${formatCurrency(pendingSale.total)}` : `${cart.length} mặt hàng · Khách phải trả: ${formatCurrency(grandTotal)}`}
        size="lg"
        footer={
          pendingSale ? (
            <div className="w-full flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 bg-white" 
                onClick={handleCancelPending}
              >
                Hủy giao dịch
              </Button>
              <Button 
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold" 
                onClick={handleCompleteCash}
              >
                Thanh toán Tiền mặt
              </Button>
            </div>
          ) : (
            <div className="w-full flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setCheckout(false)}>Quay lại</Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                onClick={confirmCheckout}
              >
                Xác nhận tạo đơn
              </Button>
            </div>
          )
        }
      >
        {pendingSale ? (
          <div className="flex flex-col items-center justify-center gap-4 py-3">
            <div className="relative group p-4 bg-white border border-slate-100 rounded-3xl shadow-premium max-w-sm w-full flex flex-col items-center">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl" />
              <div className="text-center mb-2 mt-1">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">VietQR · Xác nhận tự động</span>
              </div>
              <div className="relative overflow-hidden rounded-2xl border-4 border-slate-50 bg-white p-2">
                <img 
                  src={buildVietQrUrl(sepayConfig, { amount: pendingSale.total, addInfo: pendingSale.code })}
                  alt="VietQR Code" 
                  className="w-56 h-56 object-contain"
                />
                <div className="absolute inset-0 border border-slate-100/50 rounded-lg pointer-events-none" />
              </div>
              
              <div className="mt-4 w-full space-y-2 border-t border-slate-50 pt-4 text-xs">
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Số tiền:</span><span className="font-extrabold text-brand-600">{formatCurrency(pendingSale.total)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Nội dung chuyển khoản:</span><span className="font-mono font-black text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded">{pendingSale.code}</span></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold animate-pulse mt-1 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Đang chờ giao dịch từ SePay...
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {METHODS.map((m) => {
                const active = m.key === method
                return (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={
                      'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-bold transition-all duration-200 ' +
                      (active
                        ? 'border-brand-500 bg-brand-50/70 text-brand-700 shadow-sm ring-4 ring-brand-500/10'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50')
                    }
                  >
                    <m.icon size={22} className={active ? 'text-brand-600' : 'text-slate-400'} />
                    {m.label}
                  </button>
                )
              })}
            </div>

            {method === 'cash' && (
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <Field label="Số tiền khách đưa">
                  <div className="relative">
                    <Input
                      type="number"
                      className="pl-8 text-lg font-bold font-display"
                      placeholder="0"
                      value={given}
                      onChange={(e) => setGiven(e.target.value)}
                      autoFocus
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                  </div>
                </Field>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CASH.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setGiven(String(amt))}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition shadow-sm active:scale-95 duration-200"
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                  <button
                    onClick={() => setGiven(String(grandTotal))}
                    className="flex-1 rounded-xl border border-brand-200 bg-brand-100 px-3 py-2.5 text-sm font-black text-brand-700 hover:bg-brand-200 transition shadow-sm active:scale-95 duration-200"
                  >
                    Vừa đủ
                  </button>
                </div>
                
                <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-100 bg-white px-4.5 py-3 shadow-premium">
                  <span className="text-sm font-bold text-slate-500">Tiền thối lại</span>
                  <span className="text-xl font-extrabold text-emerald-600 font-display">{formatCurrency(change)}</span>
                </div>
              </div>
            )}

            {method !== 'cash' && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-8 text-center">
                <div className="rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                  <QrCode size={48} className="text-slate-800" />
                </div>
                <p className="text-sm text-slate-600 mt-2 font-medium">Bấm "Xác nhận tạo đơn" để hiển thị mã chuyển khoản động từ SePay.</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Success Receipt Modal */}
      <Modal
        open={receipt}
        onClose={() => setReceipt(false)}
        title="Hóa đơn thanh toán"
        subtitle={lastOrder?.code}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReceipt(false)}>Đóng</Button>
            <Button icon={Printer} onClick={() => toast.info('Đang gửi hóa đơn tới máy in...')}>In hóa đơn</Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={20} />
            <div>
              <p className="font-bold text-sm">Thanh toán thành công</p>
              <p className="text-xs text-emerald-600">Đơn hàng đã được ghi nhận.</p>
            </div>
          </div>
          
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-3">
            <Row label="Phương thức" value={lastOrder?.methodLabel} />
            <Row label="Tổng thanh toán" value={formatCurrency(lastOrder?.total || 0)} bold />
            {customer && (
              <Row label="Điểm tích lũy nhận được" value={`+${formatNumber(Math.floor((lastOrder?.total || 0) / 10000))} điểm`} tone="green" bold />
            )}
            {lastOrder?.givenNum > 0 && (
              <>
                <div className="my-2 h-px bg-slate-200" />
                <Row label="Tiền khách đưa" value={formatCurrency(lastOrder.givenNum)} />
                <Row label="Tiền thối lại" value={formatCurrency(lastOrder.change)} tone="green" bold />
              </>
            )}
          </div>
          <p className="pt-2 text-center text-xs text-slate-400">Cảm ơn quý khách. Hẹn gặp lại!</p>
        </div>
      </Modal>
    </div>
  )
}

function Row({ label, value, tone, bold }) {
  let color = 'text-slate-500'
  let valColor = 'text-slate-700'
  if (tone === 'green') {
    color = 'text-emerald-600'
    valColor = 'text-emerald-600'
  }
  
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`${color} font-medium`}>{label}</span>
      <span className={`${valColor} ${bold ? 'font-bold' : 'font-semibold'}`}>
        {value}
      </span>
    </div>
  )
}
