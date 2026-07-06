import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Badge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { formatNumber, formatDate } from '../../lib/format.js'
import { inventoryService, productService, withFallback, toList, mockInventory, mockProducts } from '../../services/index.js'
import { AlertTriangle, CalendarClock, PackageX, Boxes, TrendingDown, Clock } from 'lucide-react'

const TODAY = new Date('2026-06-15')
const EXPIRY_THRESHOLD = 45

function daysUntil(dateStr) {
  const d = new Date(dateStr)
  return Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

export default function Monitor() {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const load = async () => {
    setLoading(true)
    const inv = await withFallback(
      () => inventoryService.lowStock(),
      () => mockInventory().filter((p) => Number(p.onHand) <= Number(p.threshold)),
    )
    const prods = await withFallback(() => productService.list(), mockProducts)
    setInventory(toList(inv.data))
    setProducts(toList(prods.data))
    setSource(inv.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const lowStock = inventory.filter((p) => Number(p.onHand) > 0)
  const outOfStock = inventory.filter((p) => Number(p.onHand) <= 0)
  const nearExpiry = products
    .filter((p) => p.expiry)
    .map((p) => ({ ...p, daysLeft: daysUntil(p.expiry) }))
    .filter((p) => p.daysLeft <= EXPIRY_THRESHOLD)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.3"
        title="Giám sát tồn kho"
        subtitle="Cảnh báo hàng tồn thấp, hết hàng và sản phẩm cận hạn sử dụng."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tồn kho thấp" value={formatNumber(lowStock.length)} icon={TrendingDown} tone="amber" hint="≤ ngưỡng" />
        <StatCard label="Cận hạn" value={formatNumber(nearExpiry.length)} icon={CalendarClock} tone="red" hint="≤ 45 ngày" />
        <StatCard label="Hết hàng" value={formatNumber(outOfStock.length)} icon={PackageX} tone="red" hint="cần nhập gấp" />
        <StatCard label="Tổng SKU" value={formatNumber(products.length)} icon={Boxes} tone="brand" hint="đang theo dõi" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
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
                  { key: 'onHand', header: 'Tồn', align: 'right', render: (r) => <Badge tone="red">{r.onHand} {r.unit}</Badge> },
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
      )}
    </div>
  )
}
