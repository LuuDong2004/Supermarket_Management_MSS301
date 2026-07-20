import { useEffect, useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import { reportService, toList, withFallback } from '../../services/index.js'
import { BarChart3, Download, FileText, ShoppingCart, TrendingUp, Wallet } from 'lucide-react'

const DEMO_TREND = [
  { label: 'T2', revenue: 128 }, { label: 'T3', revenue: 154 }, { label: 'T4', revenue: 146 },
  { label: 'T5', revenue: 181 }, { label: 'T6', revenue: 172 }, { label: 'T7', revenue: 214 }, { label: 'CN', revenue: 198 },
]

const DEMO_ROWS = [
  { id: 'HD-260719-0012', date: '19/07/2026', cashier: 'Nguyễn Minh Anh', channel: 'Tại quầy', transactions: 182, sales: 48600000, profit: 10400000, status: 'Đã chốt' },
  { id: 'HD-260718-0048', date: '18/07/2026', cashier: 'Trần Gia Hân', channel: 'Tại quầy', transactions: 167, sales: 43200000, profit: 9200000, status: 'Đã chốt' },
  { id: 'HD-260717-0037', date: '17/07/2026', cashier: 'Lê Hoàng Nam', channel: 'Online', transactions: 149, sales: 39700000, profit: 8100000, status: 'Đã chốt' },
  { id: 'HD-260716-0051', date: '16/07/2026', cashier: 'Phạm Khánh Linh', channel: 'Tại quầy', transactions: 138, sales: 35400000, profit: 7600000, status: 'Đã chốt' },
  { id: 'HD-260715-0028', date: '15/07/2026', cashier: 'Đỗ Đức Minh', channel: 'Online', transactions: 121, sales: 31800000, profit: 6500000, status: 'Đã chốt' },
]

function normalizeRows(data) {
  return toList(data).map((row, index) => ({
    id: row.id || row.code || row.invoiceNo || `REPORT-${index + 1}`,
    date: row.date || row.createdAt || row.day || '—',
    cashier: row.cashier || row.employeeName || row.userName || '—',
    channel: row.channel || row.paymentMethod || 'Tại quầy',
    transactions: Number(row.transactions ?? row.orders ?? row.quantity ?? 0),
    sales: Number(row.sales ?? row.revenue ?? row.total ?? 0),
    profit: Number(row.profit ?? row.grossProfit ?? 0),
    status: row.status || 'Đã chốt',
  }))
}

export default function SalesReport() {
  const toast = useToast()
  const [reportType, setReportType] = useState('daily')
  const [from, setFrom] = useState('2026-07-01')
  const [to, setTo] = useState('2026-07-19')
  const [branch, setBranch] = useState('all')
  const [trend, setTrend] = useState(DEMO_TREND)
  const [rows, setRows] = useState(DEMO_ROWS)

  useEffect(() => {
    let active = true
    Promise.all([
      withFallback(() => reportService.salesTrend()),
      withFallback(() => reportService.monthlyRevenue()),
    ]).then(([trendResult, revenueResult]) => {
      if (!active) return
      const trendRows = toList(trendResult.data)
      const revenueRows = normalizeRows(revenueResult.data)
      if (trendRows.length) setTrend(trendRows.map((item) => ({ label: item.label || item.month || item.date, revenue: Number(item.revenue || item.sales || 0) })))
      if (revenueRows.length) setRows(revenueRows)
    })
    return () => { active = false }
  }, [])

  const totals = useMemo(() => rows.reduce((acc, row) => ({
    transactions: acc.transactions + row.transactions,
    sales: acc.sales + row.sales,
    profit: acc.profit + row.profit,
  }), { transactions: 0, sales: 0, profit: 0 }), [rows])

  const applyFilter = () => toast.success(`Đã áp dụng bộ lọc ${from} → ${to}.`)
  const exportReport = () => toast.success('Đã xuất báo cáo doanh thu và hiệu suất.')

  return (
    <div>
      <PageHeader
        breadcrumb="Báo cáo · 3.10.1"
        title="Báo cáo doanh thu & hiệu suất kinh doanh"
        subtitle="Theo dõi doanh thu, số giao dịch và lợi nhuận theo khoảng thời gian."
        actions={<Button icon={Download} onClick={exportReport}>Xuất báo cáo</Button>}
      />

      <FilterBar>
        <Field label="Loại báo cáo">
          <Select value={reportType} onChange={(event) => setReportType(event.target.value)}>
            <option value="daily">Theo ngày</option>
            <option value="monthly">Theo tháng</option>
            <option value="cashier">Theo thu ngân</option>
          </Select>
        </Field>
        <Field label="Từ ngày"><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></Field>
        <Field label="Đến ngày"><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></Field>
        <Field label="Chi nhánh">
          <Select value={branch} onChange={(event) => setBranch(event.target.value)}>
            <option value="all">Tất cả chi nhánh</option>
            <option value="main">Cửa hàng trung tâm</option>
            <option value="online">Kênh Online</option>
          </Select>
        </Field>
        <div className="flex items-end gap-2">
          <Button onClick={applyFilter}>Áp dụng</Button>
          <Button variant="secondary" onClick={() => { setFrom('2026-07-01'); setTo('2026-07-19'); setBranch('all') }}>Đặt lại</Button>
        </div>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng doanh thu" value={formatCurrency(totals.sales, { compact: true })} icon={Wallet} tone="green" hint="trong kỳ báo cáo" />
        <StatCard label="Số giao dịch" value={formatNumber(totals.transactions)} icon={ShoppingCart} tone="blue" hint="hóa đơn hợp lệ" />
        <StatCard label="Lợi nhuận gộp" value={formatCurrency(totals.profit, { compact: true })} icon={TrendingUp} tone="brand" hint="sau giá vốn" />
        <StatCard label="Tỷ suất lợi nhuận" value={`${totals.sales ? Math.round((totals.profit / totals.sales) * 100) : 0}%`} icon={BarChart3} tone="violet" hint="gross margin" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader title="Xu hướng doanh thu" subtitle="Triệu đồng theo ngày" icon={BarChart3} />
          <CardBody><Bars data={trend} x="label" series={[{ key: 'revenue', name: 'Doanh thu', color: '#111111' }]} /></CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Tóm tắt báo cáo" subtitle="Kỳ đã chọn" icon={FileText} />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span className="text-sm text-slate-500">Loại báo cáo</span><Badge tone="brand">{reportType === 'daily' ? 'Theo ngày' : reportType === 'monthly' ? 'Theo tháng' : 'Theo thu ngân'}</Badge></div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3"><span className="text-sm text-slate-500">Khoảng thời gian</span><span className="text-sm font-semibold text-slate-700">{from} → {to}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Trạng thái dữ liệu</span><Badge tone="green" dot>Đã cập nhật</Badge></div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader title="Chi tiết doanh thu và hiệu suất" subtitle="Danh sách giao dịch đã tổng hợp" icon={FileText} action={<Button size="sm" variant="secondary" icon={Download} onClick={exportReport}>Xuất Excel</Button>} />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={rows}
              rowKey="id"
              columns={[
                { key: 'id', header: 'Mã báo cáo', render: (row) => <span className="font-mono text-xs text-slate-600">{row.id}</span> },
                { key: 'date', header: 'Ngày', align: 'center' },
                { key: 'cashier', header: 'Thu ngân' },
                { key: 'channel', header: 'Kênh bán', render: (row) => <Badge tone="slate">{row.channel}</Badge> },
                { key: 'transactions', header: 'Giao dịch', align: 'right', render: (row) => formatNumber(row.transactions) },
                { key: 'sales', header: 'Doanh thu', align: 'right', render: (row) => <span className="font-semibold">{formatCurrency(row.sales)}</span> },
                { key: 'profit', header: 'Lợi nhuận', align: 'right', render: (row) => formatCurrency(row.profit) },
                { key: 'status', header: 'Trạng thái', align: 'center', render: (row) => <Badge tone="green" dot>{row.status}</Badge> },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
