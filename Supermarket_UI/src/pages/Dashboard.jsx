import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { StatCard } from '../components/ui/StatCard.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge } from '../components/ui/primitives.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { AreaTrend, Donut, Bars } from '../components/ui/Charts.jsx'
import { roleLabel, formatCurrency, formatNumber } from '../lib/format.js'
import * as db from '../mock/db.js'
import {
  DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowRight,
  TrendingUp, Boxes, ClipboardList, Activity,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const role = user?.role

  const lowStock = db.products.filter((p) => p.stock <= 10)

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user?.fullName || user?.username} 👋`}
        subtitle={`Bảng điều khiển ${roleLabel(role)} · ${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}
      />

      {/* KPI row — varies a little by role but shared metrics are fine for a demo */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu hôm nay" value={formatCurrency(28_640_000, { compact: true })} icon={DollarSign} tone="green" delta={12} hint="so với hôm qua" />
        <StatCard label="Đơn hàng" value={formatNumber(184)} icon={ShoppingCart} tone="brand" delta={8} hint="hôm nay" />
        <StatCard label="Sản phẩm" value={formatNumber(db.products.length)} icon={Package} tone="blue" hint="đang kinh doanh" />
        <StatCard label="Tồn kho thấp" value={formatNumber(lowStock.length)} icon={AlertTriangle} tone="red" hint="cần nhập thêm" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Doanh thu 7 ngày" subtitle="Triệu đồng" icon={TrendingUp} />
          <CardBody><AreaTrend data={db.salesTrend} x="day" y="revenue" /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu ngành hàng" icon={Boxes} />
          <CardBody><Donut data={db.categoryShare} /></CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Giao dịch gần đây"
            icon={ShoppingCart}
            action={<Link to="/app/pos/shift"><Button variant="ghost" size="sm" icon={ArrowRight}>Xem ca</Button></Link>}
          />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={db.recentSales}
              columns={[
                { key: 'id', header: 'Hóa đơn', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
                { key: 'time', header: 'Giờ' },
                { key: 'items', header: 'SP', align: 'center' },
                { key: 'payment', header: 'Thanh toán', render: (r) => <Badge tone="slate">{r.payment}</Badge> },
                { key: 'total', header: 'Tổng', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.total)}</span> },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Cảnh báo tồn kho" icon={AlertTriangle} action={<Link to="/app/warehouse/monitor"><Button variant="ghost" size="sm">Tất cả</Button></Link>} />
          <CardBody className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.category}</p>
                </div>
                <Badge tone="red">{p.stock} {p.unit}</Badge>
              </div>
            ))}
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
    <Link to={to} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-card-hover">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="truncate text-xs text-slate-400">{text}</p>
      </div>
      <ArrowRight size={16} className="ml-auto text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
    </Link>
  )
}
