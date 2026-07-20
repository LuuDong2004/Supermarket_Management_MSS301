import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Badge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars, AreaTrend } from '../../components/ui/Charts.jsx'
import { formatCurrency, formatPercent } from '../../lib/format.js'
import { reportService, withFallback, toList } from '../../services/index.js'
import { DollarSign, Wallet, TrendingUp, Percent, BarChart3, LineChart } from 'lucide-react'

// Backend amounts are in millions of VND.
const money = (millions, opts) => formatCurrency((Number(millions) || 0) * 1_000_000, opts)

export default function FinancialReport() {
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')

  const load = async () => {
    const res = await withFallback(() => reportService.financial())
    setRows(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const totals = useMemo(() => {
    const revenue = rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0)
    const cost = rows.reduce((s, r) => s + (Number(r.cost) || 0), 0)
    const gross = rows.reduce((s, r) => s + (Number(r.grossProfit) || 0), 0)
    const net = rows.reduce((s, r) => s + (Number(r.netProfit) || 0), 0)
    const margin = revenue ? (net / revenue) * 100 : 0
    // Growth of net profit: last month vs previous month.
    let growth = null
    if (rows.length >= 2) {
      const prev = Number(rows[rows.length - 2].netProfit) || 0
      const last = Number(rows[rows.length - 1].netProfit) || 0
      if (prev) growth = Math.round(((last - prev) / prev) * 100)
    }
    return { revenue, cost, gross, net, margin, growth }
  }, [rows])

  return (
    <div>
      <PageHeader
        breadcrumb="Điều hành · 3.3.5"
        title="Báo cáo tài chính"
        subtitle="Doanh thu, giá vốn và lợi nhuận theo tháng phục vụ quyết định chiến lược."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={money(totals.revenue, { compact: true })} icon={DollarSign} tone="brand" hint="lũy kế kỳ" />
        <StatCard label="Tổng giá vốn" value={money(totals.cost, { compact: true })} icon={Wallet} tone="amber" hint="lũy kế kỳ" />
        <StatCard label="Lợi nhuận ròng" value={money(totals.net, { compact: true })} icon={TrendingUp} tone="green" delta={totals.growth} hint="so với tháng trước" />
        <StatCard label="Biên LN ròng" value={formatPercent(totals.margin)} icon={Percent} tone="violet" hint="ròng / doanh thu" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Doanh thu · Giá vốn · Lợi nhuận gộp" subtitle="Triệu đồng" icon={BarChart3} />
          <CardBody>
            <Bars
              data={rows}
              x="month"
              series={[
                { key: 'revenue', name: 'Doanh thu', color: '#111111' },
                { key: 'cost', name: 'Giá vốn', color: '#777777' },
                { key: 'grossProfit', name: 'LN gộp', color: '#bbbbbb' },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Xu hướng lợi nhuận ròng" subtitle="Triệu đồng" icon={LineChart} />
          <CardBody>
            <AreaTrend data={rows} x="month" y="netProfit" color="#111111" />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Chi tiết theo tháng" subtitle="Đơn vị: triệu đồng" />
        <CardBody className="p-0">
          <DataTable
            rows={rows}
            rowKey="month"
            empty={{ title: 'Chưa có dữ liệu tài chính' }}
            columns={[
              { key: 'month', header: 'Tháng', render: (r) => <span className="font-semibold text-slate-700">{r.month}</span> },
              { key: 'revenue', header: 'Doanh thu', align: 'right', render: (r) => money(r.revenue) },
              { key: 'cost', header: 'Giá vốn', align: 'right', render: (r) => money(r.cost) },
              { key: 'grossProfit', header: 'LN gộp', align: 'right', render: (r) => money(r.grossProfit) },
              { key: 'netProfit', header: 'LN ròng', align: 'right', render: (r) => <span className="font-semibold text-emerald-600">{money(r.netProfit)}</span> },
              { key: 'margin', header: 'Biên LN', align: 'right', render: (r) => formatPercent(r.revenue ? (r.netProfit / r.revenue) * 100 : 0) },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  )
}
