import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { cn } from '../../lib/cn.js'
import { formatDate, formatNumber } from '../../lib/format.js'
import { policyService, monitoringService, withFallback, toList } from '../../services/index.js'
import {
  ScrollText, ShieldCheck, History, ClipboardList, Pencil, Plus, Trash2,
} from 'lucide-react'

const TABS = [
  { value: 'rules', label: 'Quy tắc nghiệp vụ' },
  { value: 'audit', label: 'Nhật ký kiểm toán' },
]

const CATEGORY_TONE = {
  'Bán hàng': 'brand',
  'Kho': 'blue',
  'Thành viên': 'violet',
  'Mua hàng': 'amber',
}

const LEVEL_TONE = { INFO: 'blue', WARN: 'amber', ERROR: 'red' }

// Inline toggle switch for enabling/disabling a rule.
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-brand-500/30',
        checked ? 'bg-brand-600' : 'bg-slate-300',
      )}
    >
      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition', checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  )
}

export default function BusinessRules() {
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('rules')

  const [policies, setPolicies] = useState([])
  const [allLogs, setAllLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [enabled, setEnabled] = useState({})
  const [levelFilter, setLevelFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const [r, lr] = await Promise.all([
      withFallback(() => policyService.list()),
      withFallback(() => monitoringService.logs()),
    ])
    const rows = toList(r.data)
    setPolicies(rows)
    setAllLogs(toList(lr.data))
    setSource(r.source)
    setEnabled(Object.fromEntries(rows.map((p) => [p.id, true])))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const recentChange = useMemo(
    () => policies.reduce((latest, p) => ((p.updatedDate || '') > latest ? p.updatedDate : latest), '0000-00-00'),
    [policies],
  )

  const logs = useMemo(
    () => allLogs.filter((l) => levelFilter === 'all' || l.level === levelFilter),
    [allLogs, levelFilter],
  )

  const removeRule = async (rule) => {
    try {
      await policyService.remove(rule.id)
      toast.success(`Đã xóa quy tắc "${rule.name}".`)
      await load()
    } catch (e) {
      toast.error(e.message || 'Xóa quy tắc thất bại.')
    }
  }

  const toggleRule = (id) => {
    setEnabled((s) => {
      const next = { ...s, [id]: !s[id] }
      toast.info(next[id] ? 'Đã bật quy tắc.' : 'Đã tắt quy tắc.')
      return next
    })
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Hệ thống · 3.11.2"
        title="Quy tắc & Nhật ký kiểm toán"
        subtitle="Quản lý quy tắc nghiệp vụ và truy vết mọi thay đổi (ai · khi nào · việc gì)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Lỗi tải dữ liệu'}
            </Badge>
            <Button icon={Plus} onClick={() => navigate('/app/settings/rules/new')}>Thêm quy tắc</Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tổng quy tắc" value={formatNumber(policies.length)} icon={ClipboardList} tone="brand" hint="đang áp dụng" />
        <StatCard label="Thay đổi gần nhất" value={formatDate(recentChange)} icon={History} tone="amber" hint="cập nhật quy tắc" />
        <StatCard label="Sự kiện kiểm toán" value={formatNumber(allLogs.length)} icon={ShieldCheck} tone="violet" hint="trong nhật ký" />
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === 'rules' && (
        <Card>
          <CardHeader title="Quy tắc nghiệp vụ" subtitle="Cấu hình hạn mức và ngưỡng vận hành" icon={ScrollText} />
          <CardBody className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="h-7 w-7" />
              </div>
            ) : (
              <DataTable
                className="rounded-none border-0 shadow-none"
                rows={policies}
                rowKey="id"
                empty={{ title: 'Chưa có quy tắc', subtitle: 'Thêm quy tắc nghiệp vụ đầu tiên.' }}
                columns={[
                  { key: 'name', header: 'Quy tắc', render: (r) => <span className="font-medium text-slate-700">{r.name}</span> },
                  { key: 'value', header: 'Giá trị', render: (r) => <span className="font-mono text-sm text-slate-700">{r.value}</span> },
                  { key: 'category', header: 'Nhóm', render: (r) => <Badge tone={CATEGORY_TONE[r.category] || 'slate'}>{r.category}</Badge> },
                  { key: 'updatedDate', header: 'Cập nhật', render: (r) => formatDate(r.updatedDate) },
                  {
                    key: 'enabled',
                    header: 'Trạng thái',
                    align: 'center',
                    render: (r) => <Toggle checked={!!enabled[r.id]} onChange={() => toggleRule(r.id)} />,
                  },
                ]}
                actions={(r) => (
                  <>
                    <Button size="sm" variant="secondary" icon={Pencil} onClick={() => navigate(`/app/settings/rules/${r.id}/edit`)}>Sửa</Button>
                    <Button size="sm" variant="danger" icon={Trash2} onClick={() => removeRule(r)}>Xóa</Button>
                  </>
                )}
              />
            )}
          </CardBody>
        </Card>
      )}

      {tab === 'audit' && (
        <Card>
          <CardHeader
            title="Nhật ký kiểm toán"
            subtitle="Truy vết hệ thống — ai thực hiện, khi nào, việc gì"
            icon={History}
            action={
              <Field className="w-44">
                <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                  <option value="all">Tất cả mức độ</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </Select>
              </Field>
            }
          />
          <CardBody className="p-0">
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={logs}
              rowKey="id"
              empty={{ title: 'Không có sự kiện', subtitle: 'Không có nhật ký khớp bộ lọc đã chọn.' }}
              columns={[
                { key: 'time', header: 'Thời gian', render: (r) => <span className="font-mono text-xs text-slate-500">{r.time}</span> },
                { key: 'level', header: 'Mức độ', align: 'center', render: (r) => <Badge tone={LEVEL_TONE[r.level] || 'slate'} dot>{r.level}</Badge> },
                { key: 'service', header: 'Dịch vụ', render: (r) => <span className="font-mono text-xs text-slate-600">{r.service}</span> },
                { key: 'message', header: 'Nội dung', render: (r) => <span className="text-slate-700">{r.message}</span> },
                { key: 'actor', header: 'Người dùng', render: (r) => <Badge tone="slate">{r.actor}</Badge> },
              ]}
            />
          </CardBody>
        </Card>
      )}

    </div>
  )
}
