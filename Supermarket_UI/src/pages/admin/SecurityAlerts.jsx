import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { securityAlertService, withFallback, toList } from '../../services/index.js'
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'

const sevTone = (s) => ({ Cao: 'red', 'Trung bình': 'amber', Thấp: 'slate' }[s] || 'slate')

export default function SecurityAlerts() {
  const toast = useToast()
  const [tab, setTab] = useState('open')
  const [alerts, setAlerts] = useState([])
  const [source, setSource] = useState('backend')

  const load = async () => {
    const res = await withFallback(() => securityAlertService.list())
    setAlerts(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const open = useMemo(() => alerts.filter((a) => a.status === 'Mở'), [alerts])
  const resolved = useMemo(() => alerts.filter((a) => a.status !== 'Mở'), [alerts])
  const rows = tab === 'open' ? open : resolved

  const resolve = async (a) => {
    if (source !== 'backend' || !a.id) { toast.error('Không có kết nối backend để cập nhật.'); return }
    try {
      await securityAlertService.resolve(a.id)
      toast.success(`Đã xử lý cảnh báo ${a.code}.`)
      await load()
    } catch {
      toast.error('Không thể cập nhật cảnh báo.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.5"
        title="Cảnh báo bảo mật"
        subtitle="Giám sát truy cập đáng ngờ, rủi ro phân quyền và sự kiện bảo mật."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng cảnh báo" value={alerts.length} icon={ShieldAlert} tone="brand" />
        <StatCard label="Đang mở" value={open.length} icon={AlertTriangle} tone="amber" hint="cần xử lý" />
        <StatCard label="Mức độ Cao" value={alerts.filter((a) => a.severity === 'Cao' && a.status === 'Mở').length} icon={ShieldAlert} tone="red" hint="đang mở" />
        <StatCard label="Đã xử lý" value={resolved.length} icon={ShieldCheck} tone="green" />
      </div>

      <Tabs
        className="my-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'open', label: 'Đang mở', count: open.length },
          { value: 'resolved', label: 'Đã xử lý', count: resolved.length },
        ]}
      />

      <Card>
        <CardBody className="p-0">
          <DataTable
            rows={rows}
            rowKey="code"
            empty={{ title: tab === 'open' ? 'Không có cảnh báo đang mở' : 'Chưa có cảnh báo đã xử lý' }}
            columns={[
              { key: 'code', header: 'Mã', render: (a) => <span className="font-mono text-xs">{a.code}</span> },
              { key: 'type', header: 'Loại', render: (a) => <span className="font-medium text-slate-700">{a.type}</span> },
              { key: 'severity', header: 'Mức độ', render: (a) => <Badge tone={sevTone(a.severity)}>{a.severity}</Badge> },
              { key: 'source', header: 'Nguồn' },
              { key: 'actor', header: 'Đối tượng', render: (a) => a.actor || '—' },
              { key: 'ipAddress', header: 'IP', render: (a) => <span className="font-mono text-xs">{a.ipAddress || '—'}</span> },
              { key: 'detectedAt', header: 'Thời điểm' },
              { key: 'status', header: 'Trạng thái', render: (a) => <StatusBadge status={a.status} /> },
              { key: 'actions', header: '', align: 'right', render: (a) => (
                a.status === 'Mở'
                  ? <Button size="sm" variant="success" icon={CheckCircle2} onClick={(e) => { e.stopPropagation(); resolve(a) }}>Đã xử lý</Button>
                  : null
              ) },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  )
}
