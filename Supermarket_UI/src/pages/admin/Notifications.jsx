import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, EmptyState } from '../../components/ui/primitives.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import { notificationService, withFallback, toList } from '../../services/index.js'
import { Bell, BellRing, AlertOctagon, AlertTriangle, Check, Trash2, Inbox } from 'lucide-react'

const LEVELS = [
  { key: '', label: 'Tất cả' },
  { key: 'CRITICAL', label: 'Sự cố' },
  { key: 'WARN', label: 'Cảnh báo' },
  { key: 'INFO', label: 'Thông tin' },
]

const levelMeta = (lvl) => ({
  CRITICAL: { tone: 'red', icon: AlertOctagon, label: 'Sự cố', box: 'bg-rose-50 text-rose-600' },
  WARN: { tone: 'amber', icon: AlertTriangle, label: 'Cảnh báo', box: 'bg-amber-50 text-amber-600' },
  INFO: { tone: 'blue', icon: Bell, label: 'Thông tin', box: 'bg-sky-50 text-sky-600' },
}[lvl] || { tone: 'slate', icon: Bell, label: lvl || '—', box: 'bg-slate-50 text-slate-600' })

export default function Notifications() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [source, setSource] = useState('backend')
  const [level, setLevel] = useState('')

  const load = async () => {
    const res = await withFallback(() => notificationService.list())
    setItems(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(() => (level ? items.filter((n) => n.level === level) : items), [items, level])
  const counts = useMemo(() => ({
    total: items.length,
    unread: items.filter((n) => !n.readFlag).length,
    critical: items.filter((n) => n.level === 'CRITICAL').length,
    warn: items.filter((n) => n.level === 'WARN').length,
  }), [items])

  const markRead = async (n) => {
    if (source !== 'backend' || !n.id) { toast.error('Không có kết nối backend.'); return }
    try {
      await notificationService.markRead(n.id)
      await load()
    } catch { toast.error('Không thể đánh dấu đã đọc.') }
  }

  const remove = async (n) => {
    if (source !== 'backend' || !n.id) { toast.error('Không có kết nối backend.'); return }
    try {
      await notificationService.remove(n.id)
      toast.success('Đã xóa thông báo.')
      await load()
    } catch { toast.error('Không thể xóa thông báo.') }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.6"
        title="Thông báo hệ thống"
        subtitle="Cảnh báo sự cố và thông báo vận hành gửi tới quản trị viên."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng thông báo" value={counts.total} icon={Bell} tone="brand" />
        <StatCard label="Chưa đọc" value={counts.unread} icon={BellRing} tone="amber" hint="cần xem" />
        <StatCard label="Sự cố" value={counts.critical} icon={AlertOctagon} tone="red" />
        <StatCard label="Cảnh báo" value={counts.warn} icon={AlertTriangle} tone="amber" />
      </div>

      <div className="my-6 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.key || 'all'}
            onClick={() => setLevel(l.key)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              level === l.key ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState icon={Inbox} title="Không có thông báo" subtitle="Chưa có thông báo phù hợp bộ lọc." />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((n) => {
            const m = levelMeta(n.level)
            const Icon = m.icon
            return (
              <Card key={n.id || n.title} className={n.readFlag ? '' : 'border-l-4 border-l-brand-500'}>
                <CardBody className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${m.box}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 grow">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      <Badge tone={m.tone}>{m.label}</Badge>
                      {!n.readFlag && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(n.createdAt, true)} · gửi tới {n.recipient}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {!n.readFlag && <Button size="sm" variant="secondary" icon={Check} onClick={() => markRead(n)}>Đã đọc</Button>}
                    <Button size="sm" variant="ghost" icon={Trash2} onClick={() => remove(n)} />
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
