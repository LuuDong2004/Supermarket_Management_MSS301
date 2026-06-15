import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Donut, Bars } from '../../components/ui/Charts.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Boxes, ArrowDownToLine, ArrowUpFromLine, Warehouse, BarChart3 } from 'lucide-react'

const flowData = [
  { day: 'T2', inbound: 120, outbound: 90 },
  { day: 'T3', inbound: 80, outbound: 110 },
  { day: 'T4', inbound: 200, outbound: 140 },
  { day: 'T5', inbound: 60, outbound: 130 },
  { day: 'T6', inbound: 180, outbound: 160 },
  { day: 'T7', inbound: 100, outbound: 220 },
  { day: 'CN', inbound: 50, outbound: 180 },
]

export default function Reports() {
  const inventoryValue = db.products.reduce((s, p) => s + p.cost * p.stock, 0)
  const inboundCount = db.warehouseTxns.filter((t) => t.type === 'Nhập kho').length
  const outboundCount = db.warehouseTxns.filter((t) => t.type === 'Xuất kho').length

  const topValue = db.products
    .map((p) => ({ ...p, value: p.cost * p.stock }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.4"
        title="Báo cáo kho"
        subtitle="Tổng quan giá trị tồn kho, cơ cấu ngành hàng và lưu lượng nhập xuất."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Giá trị tồn kho" value={formatCurrency(inventoryValue, { compact: true })} icon={Warehouse} tone="brand" hint="theo giá vốn" />
        <StatCard label="Lượt nhập" value={formatNumber(inboundCount)} icon={ArrowDownToLine} tone="green" hint="giao dịch" />
        <StatCard label="Lượt xuất" value={formatNumber(outboundCount)} icon={ArrowUpFromLine} tone="blue" hint="giao dịch" />
        <StatCard label="Tổng SKU" value={formatNumber(db.products.length)} icon={Boxes} tone="violet" hint="đang quản lý" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Lưu lượng nhập / xuất 7 ngày" subtitle="Đơn vị" icon={BarChart3} />
          <CardBody>
            <Bars
              data={flowData}
              x="day"
              series={[
                { key: 'inbound', name: 'Nhập kho', color: '#10b981' },
                { key: 'outbound', name: 'Xuất kho', color: '#0ea5e9' },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Cơ cấu tồn theo ngành" icon={Boxes} />
          <CardBody><Donut data={db.categoryShare} /></CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Sản phẩm giá trị tồn cao nhất" subtitle="Tính theo giá vốn × số lượng tồn" icon={Warehouse} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={topValue}
              rowKey="id"
              columns={[
                { key: 'name', header: 'Sản phẩm' },
                { key: 'category', header: 'Ngành hàng' },
                { key: 'stock', header: 'Tồn', align: 'right', render: (r) => `${formatNumber(r.stock)} ${r.unit}` },
                { key: 'cost', header: 'Giá vốn', align: 'right', render: (r) => formatCurrency(r.cost) },
                { key: 'value', header: 'Giá trị tồn', align: 'right', render: (r) => <span className="font-semibold text-slate-800">{formatCurrency(r.value)}</span> },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
