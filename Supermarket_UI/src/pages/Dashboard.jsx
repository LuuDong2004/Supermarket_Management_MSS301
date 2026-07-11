import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { StatCard } from '../components/ui/StatCard.jsx'
import { Card, CardHeader, CardBody, Button, Badge } from '../components/ui/primitives.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { AreaTrend, Donut } from '../components/ui/Charts.jsx'
import { roleLabel, formatCurrency, formatNumber } from '../lib/format.js'
import {
  reportService, productService, saleService, withFallback, toList,
} from '../services/index.js'
import {
  DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowRight,
  TrendingUp, Boxes, ClipboardList, Activity,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role
  const canViewReports = ['ROLE_ADMIN', 'ROLE_CEO'].includes(role)

  const [salesTrend, setSalesTrend] = useState([])
  const [categoryShare, setCategoryShare] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [kpi, setKpi] = useState({ revenue: 0, orders: 0 })
  const [source, setSource] = useState('backend')

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [prod, trend, share, low, sales] = await Promise.all([
        withFallback(() => productService.list({ size: 1 })),
        canViewReports ? withFallback(() => reportService.salesTrend()) : Promise.resolve({ data: [], source: 'backend' }),
        canViewReports ? withFallback(() => reportService.categoryShare()) : Promise.resolve({ data: [], source: 'backend' }),
        withFallback(() => productService.lowStock()),
        withFallback(() => saleService.list()),
      ])
      if (!alive) return
      setProductCount(prod.data?.totalElements ?? toList(prod.data).length)
      setSalesTrend(toList(trend.data))
      setCategoryShare(toList(share.data))
      setLowStock(toList(low.data))
      const saleRows = toList(sales.data)
      setRecentSales(saleRows.slice(0, 8))
      setKpi({
        revenue: saleRows.reduce((s, x) => s + Number(x.total || 0), 0),
        orders: saleRows.length,
      })
      setSource([prod, trend, share, low, sales].some((r) => r.source !== 'backend') ? 'error' : 'backend')
    })()
    return () => { alive = false }
  }, [canViewReports])

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.fullName || user?.username} 👋`}
        subtitle={`Bảng điều khiển ${roleLabel(role)} · ${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Lỗi tải dữ liệu'}
          </Badge>
        }
      />

      {/* KPI row — varies a little by role but shared metrics are fine for a demo */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu gần đây" value={formatCurrency(kpi.revenue, { compact: true })} icon={DollarSign} tone="green" hint="từ giao dịch gần đây" />
        <StatCard label="Đơn hàng" value={formatNumber(kpi.orders)} icon={ShoppingCart} tone="brand" hint="giao dịch gần đây" />
        <StatCard label="Sản phẩm" value={formatNumber(productCount)} icon={Package} tone="blue" hint="đang kinh doanh" />
        <StatCard label="Tồn kho thấp" value={formatNumber(lowStock.length)} icon={AlertTriangle} tone="red" hint="cần nhập thêm" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" hoverEffect>
          <CardHeader title="Doanh thu 7 ngày" subtitle="Triệu đồng" icon={TrendingUp} />
          <CardBody><AreaTrend data={salesTrend} x="label" y="revenue" /></CardBody>
        </Card>
        <Card hoverEffect>
          <CardHeader title="Cơ cấu ngành hàng" icon={Boxes} />
          <CardBody><Donut data={categoryShare} /></CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" hoverEffect>
          <CardHeader
            title="Giao dịch gần đây"
            icon={ShoppingCart}
            action={<Link to="/app/pos/shift"><Button variant="ghost" size="sm" icon={ArrowRight}>Xem ca</Button></Link>}
          />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={recentSales}
              empty={{ title: 'Chưa có giao dịch', subtitle: 'Chưa có hóa đơn nào gần đây.' }}
              columns={[
                { key: 'code', header: 'Hóa đơn', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
                { key: 'saleTime', header: 'Giờ', render: (r) => r.saleTime },
                { key: 'items', header: 'SP', align: 'center' },
                { key: 'payment', header: 'Thanh toán', render: (r) => <Badge tone="slate">{r.payment}</Badge> },
                { key: 'total', header: 'Tổng', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.total)}</span> },
              ]}
            />
          </CardBody>
        </Card>

        <Card hoverEffect>
          <CardHeader title="Cảnh báo tồn kho" icon={AlertTriangle} action={<Link to="/app/warehouse/monitor"><Button variant="ghost" size="sm">Tất cả</Button></Link>} />
          <CardBody className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.id || p.code} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/40 px-3.5 py-2.5 transition-colors hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">{p.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{p.category}</p>
                </div>
                <Badge tone="red">{p.stock ?? p.onHand} {p.unit}</Badge>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="rounded-xl border border-slate-100 bg-slate-50/40 px-3.5 py-2.5 text-sm text-slate-400">Không có sản phẩm dưới ngưỡng tồn kho.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickLink to="/app/pos/sale" icon={ShoppingCart} title="Bán hàng" text="Mở màn hình POS" />
        <QuickLink to="/app/warehouse/inventory" icon={Boxes} title="Tồn kho" text="Tra cứu hàng hóa" />
        <QuickLink to="/app/warehouse/purchase-orders" icon={ClipboardList} title="Đơn mua" text="Quản lý PO" />
        <QuickLink to="/app/reports/sales" icon={Activity} title="Báo cáo" text="Hiệu quả kinh doanh" />
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, text }) {
  return (
    <Link to={to} className="group flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-premium transition-all duration-300 hover:shadow-premium-hover hover:border-brand-200 hover:-translate-y-0.5 backdrop-blur-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-100/50 text-brand-600 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-brand-500 group-hover:text-white group-hover:shadow-md">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="font-bold text-slate-800 font-display text-sm tracking-wide">{title}</p>
        <p className="truncate text-xs text-slate-400 mt-0.5">{text}</p>
      </div>
      <ArrowRight size={16} className="ml-auto text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500" />
    </Link>
  )
}
