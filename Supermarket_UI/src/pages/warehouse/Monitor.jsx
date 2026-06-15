import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Badge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { AlertTriangle, CalendarClock, PackageX, Boxes, TrendingDown, Clock } from 'lucide-react'

const TODAY = new Date('2026-06-15')
const EXPIRY_THRESHOLD = 45

function daysUntil(dateStr) {
  const d = new Date(dateStr)
  return Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

export default function Monitor() {
  const lowStock = db.products.filter((p) => p.stock <= 10 && p.stock > 0)
  const outOfStock = db.products.filter((p) => p.stock <= 0)
  const nearExpiry = db.products
    .map((p) => ({ ...p, daysLeft: daysUntil(p.expiry) }))
    .filter((p) => p.daysLeft <= EXPIRY_THRESHOLD)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.3"
        title="Giám sát tồn kho"
        subtitle="Cảnh báo hàng tồn thấp, hết hàng và sản phẩm cận hạn sử dụng."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tồn kho thấp" value={formatNumber(lowStock.length)} icon={TrendingDown} tone="amber" hint="≤ 10 đơn vị" />
        <StatCard label="Cận hạn" value={formatNumber(nearExpiry.length)} icon={CalendarClock} tone="red" hint="≤ 45 ngày" />
        <StatCard label="Hết hàng" value={formatNumber(outOfStock.length)} icon={PackageX} tone="red" hint="cần nhập gấp" />
        <StatCard label="Tổng SKU" value={formatNumber(db.products.length)} icon={Boxes} tone="brand" hint="đang theo dõi" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Tồn kho thấp" subtitle="Sản phẩm cần nhập thêm" icon={AlertTriangle} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={lowStock}
              empty={{ title: 'Không có cảnh báo', subtitle: 'Tất cả sản phẩm đều đủ tồn kho.' }}
              columns={[
                { key: 'name', header: 'Sản phẩm', render: (r) => (
                  <div>
                    <p className="font-medium text-slate-700">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.category}</p>
                  </div>
                ) },
                { key: 'stock', header: 'Tồn', align: 'right', render: (r) => <Badge tone="red">{r.stock} {r.unit}</Badge> },
              ]}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Cận hạn sử dụng" subtitle="Tính đến 15/06/2026" icon={Clock} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={nearExpiry}
              empty={{ title: 'Không có cảnh báo', subtitle: 'Không có sản phẩm nào cận hạn.' }}
              columns={[
                { key: 'name', header: 'Sản phẩm', render: (r) => (
                  <div>
                    <p className="font-medium text-slate-700">{r.name}</p>
                    <p className="font-mono text-xs text-slate-400">{r.barcode}</p>
                  </div>
                ) },
                { key: 'expiry', header: 'Hạn dùng', render: (r) => formatDate(r.expiry) },
                { key: 'daysLeft', header: 'Còn lại', align: 'right', render: (r) => (
                  <Badge tone={r.daysLeft <= 14 ? 'red' : 'amber'}>{r.daysLeft} ngày</Badge>
                ) },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
