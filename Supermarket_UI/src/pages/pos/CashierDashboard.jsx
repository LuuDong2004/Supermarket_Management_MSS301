import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardBody, CardHeader, Badge, Button, Field, Input, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import {
  customerService,
  mockCustomers,
  mockProducts,
  mockSales,
  mockShifts,
  productService,
  saleService,
  shiftService,
  toList,
  withFallback,
} from '../../services/index.js'
import {
  Banknote,
  Clock3,
  Gift,
  LockKeyhole,
  Search,
  ShoppingCart,
  UserRoundSearch,
  Users,
} from 'lucide-react'

const DEMO_SALES = [
  { id: 'RC-3101', receipt: 'RC-3101', items: 5, payment: 'QR', amount: 428000, status: 'Paid' },
  { id: 'RC-3102', receipt: 'RC-3102', items: 2, payment: 'Cash', amount: 106000, status: 'Paid' },
  { id: 'RC-3103', receipt: 'RC-3103', items: 8, payment: 'QR', amount: 742000, status: 'Paid' },
  { id: 'RC-3104', receipt: 'RC-3104', items: 1, payment: 'Cash', amount: 36000, status: 'Paid' },
  { id: 'RC-3105', receipt: 'RC-3105', items: 4, payment: 'QR', amount: 210000, status: 'Paid' },
]

const DEMO_CART = {
  id: 'P001',
  product: 'Milk 1L',
  qty: 2,
  price: 32000,
  subtotal: 64000,
}

function isClosed(status) {
  const value = String(status || '').toUpperCase()
  return value.includes('CLOSED') || value.includes('ĐÃ ĐÓNG')
}

function paymentLabel(payment) {
  const value = String(payment || '').toUpperCase()
  if (value.includes('QR') || value.includes('VÍ')) return 'QR'
  if (value.includes('CASH') || value.includes('TIỀN')) return 'Cash'
  if (value.includes('CARD') || value.includes('THẺ')) return 'Card'
  return payment || 'Cash'
}

function saleStatus(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('PENDING')) return 'Pending'
  if (value.includes('CANCEL')) return 'Cancelled'
  return 'Paid'
}

function startTime(shift) {
  const value = String(shift?.openAt || shift?.open || '')
  const match = value.match(/\b([01]\d|2[0-3]):[0-5]\d\b/)
  return match?.[0] || '07:45'
}

function compactMoney(value, withCurrency = false) {
  const number = Number(value || 0)
  let formatted
  if (Math.abs(number) >= 1_000_000) formatted = `${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  else if (Math.abs(number) >= 1_000) formatted = `${Math.round(number / 1_000)}K`
  else formatted = String(number)
  return withCurrency ? `${formatted} VND` : formatted
}

export default function CashierDashboard() {
  const navigate = useNavigate()
  const [sales, setSales] = useState([])
  const [shifts, setShifts] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [sources, setSources] = useState({})
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [cartPreview, setCartPreview] = useState([DEMO_CART])

  useEffect(() => {
    let alive = true

    ;(async () => {
      const [saleResult, shiftResult, customerResult, productResult] = await Promise.all([
        withFallback(() => saleService.list(), mockSales),
        withFallback(() => shiftService.list(), mockShifts),
        withFallback(() => customerService.list({ size: 200 }), mockCustomers),
        withFallback(() => productService.list({ size: 200 }), mockProducts),
      ])

      if (!alive) return
      const productRows = toList(productResult.data)
      setSales(toList(saleResult.data))
      setShifts(toList(shiftResult.data))
      setCustomers(toList(customerResult.data))
      setProducts(productRows)
      setSources({
        sales: saleResult.source,
        shifts: shiftResult.source,
        customers: customerResult.source,
        products: productResult.source,
      })

      if (productResult.source === 'backend' && productRows.length > 0) {
        const product = productRows[0]
        setCartPreview([{
          id: product.id || product.code,
          product: product.name,
          qty: 1,
          price: Number(product.price || 0),
          subtotal: Number(product.price || 0),
        }])
      }
      setLoading(false)
    })()

    return () => { alive = false }
  }, [])

  const currentShift = shifts.find((shift) => !isClosed(shift.status)) || shifts[0]

  const recentSales = useMemo(() => {
    if (sources.sales !== 'backend') return DEMO_SALES
    return sales.slice(0, 5).map((sale, index) => ({
      ...sale,
      id: sale.id || sale.code || `RC-${3101 + index}`,
      receipt: sale.code || sale.id || `RC-${3101 + index}`,
      items: Number(sale.items ?? sale.itemCount ?? sale.lineItems?.length ?? 0),
      payment: paymentLabel(sale.payment || sale.paymentMethod),
      amount: Number(sale.total ?? sale.amount ?? 0),
      status: saleStatus(sale.status),
    }))
  }, [sales, sources.sales])

  const matchingProduct = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return null
    return products.find((product) =>
      String(product.barcode || product.code || '').toLowerCase() === value ||
      String(product.name || '').toLowerCase().includes(value))
  }, [products, query])

  const addItem = () => {
    const product = matchingProduct || products[0]
    if (!product) return
    const qty = Math.max(1, Number(quantity) || 1)
    setCartPreview([{
      id: product.id || product.code,
      product: product.name,
      qty,
      price: Number(product.price || 0),
      subtotal: Number(product.price || 0) * qty,
    }])
    setQuery('')
  }

  const shiftIsOpen = currentShift ? !isClosed(currentShift.status) : false
  const transactions = sources.sales === 'backend' ? sales.length : 38
  const shiftRevenue = sources.sales === 'backend'
    ? sales.reduce((sum, sale) => sum + Number(sale.total || sale.amount || 0), 0)
    : 12_800_000
  const loyaltyLookups = sources.customers === 'backend' ? customers.length : 21

  return (
    <div>
      <PageHeader
        breadcrumb="Point of Sale · 3.2.2"
        title="Cashier Dashboard"
        subtitle="Role-based dashboard after successful login."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Shift Status" value={shiftIsOpen ? 'Open' : 'Closed'} icon={Clock3} tone={shiftIsOpen ? 'green' : 'red'} hint={`started ${startTime(currentShift)}`} />
        <StatCard label="Transactions" value={`${transactions} sales`} icon={ShoppingCart} tone="brand" hint="current shift" />
        <StatCard label="Shift Revenue" value={compactMoney(shiftRevenue, true)} icon={Banknote} tone="green" hint="cash + QR banking" />
        <StatCard label="Loyalty Lookups" value={`${loyaltyLookups} customers`} icon={Users} tone="violet" hint="points updated" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-2">
              <CardHeader title="Current Sale Entry" subtitle="Scan or search for the next product" icon={ShoppingCart} />
              <CardBody className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6rem]">
                  <Field label="Barcode / Product Search">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        className="pl-9"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') addItem() }}
                        placeholder="Scan barcode or type product"
                      />
                    </div>
                  </Field>
                  <Field label="Qty">
                    <Input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                  </Field>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <Button onClick={addItem}>Add Item</Button>
                  <Button variant="secondary" onClick={() => navigate('/app/pos/members')}>Find Member</Button>
                  <Button variant="secondary" onClick={() => navigate('/app/pos/sale')}>Checkout</Button>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">Open Cart Preview</p>
                  <DataTable
                    className="rounded-xl shadow-none"
                    dense
                    rows={cartPreview}
                    rowKey="id"
                    empty={{ title: 'Cart is empty' }}
                    columns={[
                      { key: 'product', header: 'Product', render: (row) => <span className="font-semibold text-slate-700">{row.product}</span> },
                      { key: 'qty', header: 'Qty', align: 'center' },
                      { key: 'subtotal', header: 'Subtotal', align: 'right', render: (row) => <span className="font-semibold">{compactMoney(row.subtotal)}</span> },
                    ]}
                  />
                </div>
              </CardBody>
            </Card>

            <Card className="min-w-0 xl:col-span-3">
              <CardHeader
                title="Recent Sales"
                subtitle="Latest completed receipts in this shift"
                icon={Banknote}
                action={
                  <Link to="/app/pos/shift">
                    <Button variant="ghost" size="sm">View shift</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={recentSales}
                  rowKey="id"
                  onRowClick={() => navigate('/app/pos/shift')}
                  empty={{ title: 'No recent sales', subtitle: 'Completed receipts will appear here.' }}
                  columns={[
                    { key: 'receipt', header: 'Receipt', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.receipt}</span> },
                    { key: 'items', header: 'Items', align: 'center' },
                    { key: 'payment', header: 'Payment', render: (row) => <Badge tone={row.payment === 'QR' ? 'violet' : 'slate'}>{row.payment}</Badge> },
                    { key: 'amount', header: 'Amount', align: 'right', render: (row) => <span className="font-semibold">{compactMoney(row.amount)}</span> },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => <Badge tone={row.status === 'Paid' ? 'green' : row.status === 'Cancelled' ? 'red' : 'amber'} dot>{row.status}</Badge>,
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-2">
              <CardHeader title="Cashier Shortcuts" subtitle="Frequently used counter actions" icon={ShoppingCart} />
              <CardBody className="grid gap-3 sm:grid-cols-2">
                <CashierShortcut to="/app/pos/sale" icon={ShoppingCart} label="New Sale" />
                <CashierShortcut to="/app/pos/members" icon={UserRoundSearch} label="Customer Member" />
                <CashierShortcut to="/app/pos/loyalty" icon={Gift} label="Redeem Points" />
                <CashierShortcut to="/app/pos/shift" icon={LockKeyhole} label="Close Shift" />
              </CardBody>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader title="Shift Reminders" subtitle="Before completing the current shift" icon={Clock3} />
              <CardBody>
                <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-600">
                    <Banknote size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">Cash drawer check</p>
                    <p className="mt-1 text-xs text-slate-500">Closing cash must match shift summary</p>
                  </div>
                  <Link to="/app/pos/shift">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">View</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function CashierShortcut({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="group flex min-h-16 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-center transition hover:border-brand-200 hover:bg-brand-50/50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={17} />
      </span>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">{label}</span>
    </Link>
  )
}
