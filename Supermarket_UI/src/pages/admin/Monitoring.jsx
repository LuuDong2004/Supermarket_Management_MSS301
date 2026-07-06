import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { formatNumber } from '../../lib/format.js'
import { monitoringService, withFallback, toList, mockServices, mockSystemLogs } from '../../services/index.js'
import { Server, ServerCrash, Activity, AlertTriangle, Cpu, MemoryStick } from 'lucide-react'

const LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR']

function levelTone(level) {
  if (level === 'ERROR') return 'red'
  if (level === 'WARN') return 'amber'
  return 'blue'
}

function MeterBar({ label, value, icon: Icon }) {
  const tone = value >= 75 ? 'bg-rose-500' : value >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><Icon size={12} /> {label}</span>
        <span className="font-medium text-slate-600">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function Monitoring() {
  const [services, setServices] = useState([])
  const [systemLogs, setSystemLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [tab, setTab] = useState('logs')
  const [level, setLevel] = useState('ALL')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const [svc, lg] = await Promise.all([
        withFallback(() => monitoringService.services(), mockServices),
        withFallback(() => monitoringService.logs(), mockSystemLogs),
      ])
      setServices(toList(svc.data))
      setSystemLogs(toList(lg.data))
      setSource(svc.source === 'backend' && lg.source === 'backend' ? 'backend' : 'mock')
      setLoading(false)
    })()
  }, [])

  const up = services.filter((s) => s.status === 'UP').length
  const down = services.filter((s) => s.status === 'DOWN').length
  const errors = systemLogs.filter((l) => l.level === 'ERROR').length

  const logs = useMemo(
    () => (level === 'ALL' ? systemLogs : systemLogs.filter((l) => l.level === level)),
    [level, systemLogs],
  )

  const actorOf = (l) => l.actor ?? l.user

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.3"
        title="Giám sát hệ thống"
        subtitle="Trạng thái microservices, tài nguyên và nhật ký hệ thống."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Service hoạt động" value={formatNumber(up)} icon={Server} tone="green" hint="đang chạy" />
        <StatCard label="Service ngừng" value={formatNumber(down)} icon={ServerCrash} tone="red" hint="cần khởi động" />
        <StatCard label="Requests / phút" value={formatNumber(1284)} icon={Activity} tone="brand" hint="trung bình" />
        <StatCard label="Lỗi gần đây" value={formatNumber(errors)} icon={AlertTriangle} tone="amber" hint="trong nhật ký" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          {/* Service health grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => {
              const upState = s.status === 'UP'
              return (
                <Card key={s.name} className={upState ? '' : 'border-rose-200'}>
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{s.name}</p>
                        <p className="font-mono text-xs text-slate-400">:{s.port} · {s.uptime}</p>
                      </div>
                      <Badge tone={upState ? 'green' : 'red'} dot>{s.status}</Badge>
                    </div>
                    <MeterBar label="CPU" value={s.cpu} icon={Cpu} />
                    <MeterBar label="RAM" value={s.mem} icon={MemoryStick} />
                  </CardBody>
                </Card>
              )
            })}
          </div>

          <Card className="mt-6">
            <CardHeader
              title="Nhật ký hệ thống"
              icon={Activity}
              subtitle="Logs và audit trail từ các service"
              action={
                <div className="flex gap-1.5">
                  {LEVELS.map((l) => (
                    <Button key={l} size="sm" variant={level === l ? 'primary' : 'secondary'} onClick={() => setLevel(l)}>{l}</Button>
                  ))}
                </div>
              }
            />
            <CardBody>
              <Tabs
                className="mb-4"
                value={tab}
                onChange={setTab}
                tabs={[
                  { value: 'logs', label: 'Logs', count: logs.length },
                  { value: 'audit', label: 'Audit' },
                ]}
              />
              {tab === 'logs' ? (
                <DataTable
                  className="border-0 shadow-none"
                  rows={logs}
                  empty={{ title: 'Không có log', subtitle: 'Không có bản ghi phù hợp mức lọc.' }}
                  columns={[
                    { key: 'time', header: 'Thời gian', render: (l) => <span className="font-mono text-xs">{l.time}</span> },
                    { key: 'level', header: 'Mức', render: (l) => <Badge tone={levelTone(l.level)}>{l.level}</Badge> },
                    { key: 'service', header: 'Service', render: (l) => <span className="font-medium text-slate-700">{l.service}</span> },
                    { key: 'message', header: 'Nội dung' },
                    { key: 'actor', header: 'Người dùng', render: (l) => <span className="font-mono text-xs">{actorOf(l)}</span> },
                  ]}
                />
              ) : (
                <DataTable
                  className="border-0 shadow-none"
                  rows={systemLogs.filter((l) => actorOf(l) !== 'system')}
                  empty={{ title: 'Không có bản ghi audit' }}
                  columns={[
                    { key: 'time', header: 'Thời gian', render: (l) => <span className="font-mono text-xs">{l.time}</span> },
                    { key: 'actor', header: 'Người dùng', render: (l) => <Badge tone="slate">{actorOf(l)}</Badge> },
                    { key: 'service', header: 'Service' },
                    { key: 'message', header: 'Hành động' },
                  ]}
                />
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}
