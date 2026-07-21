import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import {
  approvalRequestService,
  mockApprovalRequests,
  mockPolicies,
  mockProducts,
  mockSalesTrend,
  policyService,
  productService,
  reportService,
  toList,
  withFallback,
} from '../../services/index.js'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  Download,
  FileChartColumn,
  PackageSearch,
  WalletCards,
} from 'lucide-react'

const DEMO_APPROVALS = [
  { id: 'APR-101', requester: 'Admin', type: 'Role Change', priority: 'High', status: 'Pending' },
  { id: 'APR-102', requester: 'Admin', type: 'VAT Config', priority: 'High', status: 'Pending' },
  { id: 'APR-103', requester: 'Admin', type: 'Promotion', priority: 'Normal', status: 'Pending' },
  { id: 'APR-104', requester: 'Admin', type: 'Permission', priority: 'High', status: 'Review' },
  { id: 'APR-105', requester: 'Warehouse', type: 'Policy', priority: 'Normal', status: 'Pending' },
]

const TYPE_LABELS = {
  'Tạo tài khoản': 'Account',
  'Thay đổi quyền': 'Role Change',
  'Điều chỉnh kho': 'Inventory',
  'Chính sách giá': 'Policy',
}

function isPending(status) {
  const value = String(status || '').toUpperCase()
  return value.includes('PENDING') || value.includes('CHỜ')
}

function requestType(type) {
  return TYPE_LABELS[type] || type || 'Approval'
}

function requestPriority(request) {
  if (request.priority) return request.priority
  return ['Role Change', 'Permission', 'VAT Config'].includes(requestType(request.type)) ? 'High' : 'Normal'
}

function requestStatus(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('REVIEW')) return 'Review'
  if (isPending(value)) return 'Pending'
  return status || 'Pending'
}

function requesterLabel(requester) {
  const value = String(requester || '')
  if (/warehouse/i.test(value)) return 'Warehouse'
  if (/admin/i.test(value)) return 'Admin'
  return value.split('(')[0].trim() || 'Admin'
}

function toApprovalRow(request, index) {
  return {
    ...request,
    id: request.code || request.id || `APR-${101 + index}`,
    requester: requesterLabel(request.requester),
    type: requestType(request.type),
    priority: requestPriority(request),
    status: requestStatus(request.status),
  }
}

function metricFromDashboard(dashboard, keys, fallback) {
  for (const key of keys) {
    const value = Number(dashboard?.[key])
    if (Number.isFinite(value)) return value
  }
  return fallback
}

function formatMillions(value) {
  return `${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 1 })}M VND`
}

export default function CEODashboard() {
  const navigate = useNavigate()
  const [trend, setTrend] = useState([])
  const [approvals, setApprovals] = useState([])
  const [policies, setPolicies] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [sources, setSources] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    ;(async () => {
      const [trendResult, approvalResult, policyResult, stockResult, dashboardResult] = await Promise.all([
        withFallback(() => reportService.salesTrend(), mockSalesTrend),
        withFallback(() => approvalRequestService.list(), mockApprovalRequests),
        withFallback(() => policyService.list(), mockPolicies),
        withFallback(() => productService.lowStock(), mockProducts),
        withFallback(() => reportService.dashboard()),
      ])

      if (!alive) return
      setTrend(toList(trendResult.data))
      setApprovals(toList(approvalResult.data))
      setPolicies(toList(policyResult.data))
      setLowStock(toList(stockResult.data))
      setDashboard(dashboardResult.data && !Array.isArray(dashboardResult.data) ? dashboardResult.data : {})
      setSources({
        trend: trendResult.source,
        approvals: approvalResult.source,
        policies: policyResult.source,
        stock: stockResult.source,
        dashboard: dashboardResult.source,
      })
      setLoading(false)
    })()

    return () => { alive = false }
  }, [])

  const trendRows = useMemo(() => {
    const rows = trend.length ? trend.slice(-7) : []
    return rows.map((row) => {
      const sales = Number(row.sales ?? row.revenue ?? row.value ?? 0)
      return {
        ...row,
        label: row.label || row.day || row.date,
        sales,
        profit: Number(row.profit ?? (sales * 0.223).toFixed(1)),
      }
    })
  }, [trend])

  const approvalRows = useMemo(() => {
    if (sources.approvals !== 'backend') return DEMO_APPROVALS
    return approvals.slice(0, 5).map(toApprovalRow)
  }, [approvals, sources.approvals])

  const pendingCount = useMemo(
    () => approvals.filter((request) => isPending(request.status)).length,
    [approvals],
  )

  const latestSales = trendRows[trendRows.length - 1]?.sales
  const todaySales = sources.dashboard === 'backend'
    ? metricFromDashboard(dashboard, ['todaySales', 'salesToday', 'revenue'], latestSales || 0)
    : 128.4
  const grossProfit = sources.dashboard === 'backend'
    ? metricFromDashboard(dashboard, ['grossProfit', 'profitToday', 'profit'], todaySales * 0.223)
    : 28.6
  const inventoryRisk = sources.stock === 'backend' ? lowStock.length : 42
  const approvalsWaiting = sources.approvals === 'backend' ? pendingCount : 11

  const policyAlert = useMemo(() => {
    if (sources.policies !== 'backend' || policies.length === 0) {
      return {
        title: 'Loyalty redemption policy update',
        detail: 'Effective date pending CEO confirmation',
      }
    }
    const policy = policies[0]
    return {
      title: `${policy.name || 'Business policy'} update`,
      detail: 'Effective date pending CEO confirmation',
    }
  }, [policies, sources.policies])

  const exportKpis = () => {
    const csv = [
      ['Metric', 'Value'],
      ['Today Sales', formatMillions(todaySales)],
      ['Gross Profit', formatMillions(grossProfit)],
      ['Inventory Risk', `${inventoryRisk} items`],
      ['Pending Approvals', `${approvalsWaiting} requests`],
    ].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ceo-kpi-pack.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Executive · 3.2.2"
        title="CEO Dashboard"
        subtitle="Role-based dashboard after successful login."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today Sales" value={formatMillions(todaySales)} icon={WalletCards} tone="green" delta={8.2} hint="vs yesterday" />
        <StatCard label="Gross Profit" value={formatMillions(grossProfit)} icon={BarChart3} tone="brand" hint="margin 22.3%" />
        <StatCard label="Inventory Risk" value={`${inventoryRisk} items`} icon={PackageSearch} tone="red" hint="low stock or expiring" />
        <StatCard label="Pending Approvals" value={`${approvalsWaiting} requests`} icon={ClipboardCheck} tone="amber" hint="need CEO decision" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-3">
              <CardHeader title="Sales and Profit Trend" subtitle="Last 7 days · million VND" icon={BarChart3} />
              <CardBody>
                <Bars
                  data={trendRows}
                  x="label"
                  height={270}
                  series={[
                    { key: 'sales', name: 'Sales', color: '#059669' },
                    { key: 'profit', name: 'Profit', color: '#a7f3d0' },
                  ]}
                />
              </CardBody>
            </Card>

            <Card className="min-w-0 xl:col-span-2">
              <CardHeader
                title="Approval Queue"
                subtitle="Requests requiring executive review"
                icon={ClipboardCheck}
                action={
                  <Link to="/app/ceo/approvals">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={approvalRows}
                  rowKey="id"
                  onRowClick={() => navigate('/app/ceo/approvals')}
                  empty={{ title: 'No approval requests', subtitle: 'The executive approval queue is clear.' }}
                  columns={[
                    { key: 'id', header: 'Request', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.id}</span> },
                    { key: 'requester', header: 'Requester' },
                    { key: 'type', header: 'Type' },
                    {
                      key: 'priority',
                      header: 'Priority',
                      render: (row) => <Badge tone={row.priority === 'High' ? 'red' : 'slate'}>{row.priority}</Badge>,
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => <Badge tone={row.status === 'Review' ? 'blue' : 'amber'} dot>{row.status}</Badge>,
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader title="Executive Shortcuts" subtitle="Frequently used CEO actions" icon={FileChartColumn} />
              <CardBody className="grid gap-3 sm:grid-cols-2">
                <ExecutiveShortcut to="/app/ceo/reports" icon={FileChartColumn} label="Open Report Center" />
                <ExecutiveShortcut to="/app/ceo/approvals" icon={ClipboardCheck} label="Review Approvals" />
                <ExecutiveShortcut to="/app/ceo/policies" icon={BookOpenCheck} label="Manage Policy" />
                <ExecutiveShortcut onClick={exportKpis} icon={Download} label="Export KPI Pack" />
              </CardBody>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader title="Policy Alerts" subtitle="Items awaiting executive confirmation" icon={AlertTriangle} />
              <CardBody>
                <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-600">
                    <AlertTriangle size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{policyAlert.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{policyAlert.detail}</p>
                  </div>
                  <Link to="/app/ceo/policies">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">Open</Button>
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

function ExecutiveShortcut({ to, onClick, icon: Icon, label }) {
  const className = 'group flex min-h-16 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-center transition hover:border-brand-200 hover:bg-brand-50/50'
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={17} />
      </span>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">{label}</span>
    </>
  )

  if (to) return <Link to={to} className={className}>{content}</Link>
  return <button type="button" onClick={onClick} className={className}>{content}</button>
}
