import { useState, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Search, UserPlus, Users, Crown, Star, Phone, Mail, Gift } from 'lucide-react'

const TIER_TONE = { Platinum: 'violet', Gold: 'amber', Silver: 'slate', Member: 'blue' }

export default function Members() {
  const toast = useToast()
  const [members, setMembers] = useState(db.customers)
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('all')
  const [register, setRegister] = useState(false)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', tier: 'Member' })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q)
      const matchT = tier === 'all' || c.tier === tier
      return matchQ && matchT
    })
  }, [members, search, tier])

  const goldPlus = members.filter((c) => c.tier === 'Gold' || c.tier === 'Platinum').length
  const avgPoints = members.length ? Math.round(members.reduce((s, c) => s + c.points, 0) / members.length) : 0

  const submitRegister = () => {
    if (!form.name.trim() || !form.phone.trim()) return toast.error('Vui lòng nhập họ tên và số điện thoại.')
    const newMember = {
      id: `C${String(members.length + 1).padStart(3, '0')}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      tier: form.tier,
      points: 0,
      joined: new Date().toISOString().slice(0, 10),
      spent: 0,
    }
    setMembers((m) => [newMember, ...m])
    setRegister(false)
    setForm({ name: '', phone: '', email: '', tier: 'Member' })
    toast.success(`Đã đăng ký thành viên ${newMember.name}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.9.1"
        title="Khách hàng thành viên"
        subtitle="Tra cứu, đăng ký và quản lý thông tin khách hàng thành viên."
        actions={<Button icon={UserPlus} onClick={() => setRegister(true)}>Đăng ký thành viên</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tổng thành viên" value={formatNumber(members.length)} icon={Users} tone="brand" hint="đang hoạt động" />
        <StatCard label="Gold trở lên" value={formatNumber(goldPlus)} icon={Crown} tone="amber" hint="khách VIP" />
        <StatCard label="Điểm trung bình" value={formatNumber(avgPoints)} icon={Star} tone="violet" hint="mỗi thành viên" />
      </div>

      <FilterBar>
        <Field label="Tìm kiếm" className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Tên hoặc số điện thoại..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </Field>
        <Field label="Hạng thành viên">
          <Select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="all">Tất cả hạng</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Member">Member</option>
          </Select>
        </Field>
      </FilterBar>

      <DataTable
        rows={filtered}
        onRowClick={(r) => setDetail(r)}
        empty={{ title: 'Không tìm thấy thành viên', subtitle: 'Thử thay đổi từ khóa hoặc bộ lọc hạng.' }}
        columns={[
          { key: 'name', header: 'Họ tên', render: (r) => (
            <div>
              <p className="font-medium text-slate-700">{r.name}</p>
              <p className="font-mono text-xs text-slate-400">{r.id}</p>
            </div>
          ) },
          { key: 'phone', header: 'Số điện thoại', render: (r) => <span className="font-mono text-sm">{r.phone}</span> },
          { key: 'tier', header: 'Hạng', align: 'center', render: (r) => <Badge tone={TIER_TONE[r.tier] || 'slate'}>{r.tier}</Badge> },
          { key: 'points', header: 'Điểm', align: 'right', render: (r) => <span className="font-semibold">{formatNumber(r.points)}</span> },
          { key: 'joined', header: 'Ngày tham gia', render: (r) => formatDate(r.joined) },
          { key: 'spent', header: 'Chi tiêu', align: 'right', render: (r) => <span className="font-semibold text-slate-800">{formatCurrency(r.spent)}</span> },
        ]}
      />

      {/* Register modal */}
      <Modal
        open={register}
        onClose={() => setRegister(false)}
        title="Đăng ký thành viên"
        subtitle="Tạo hồ sơ khách hàng thành viên mới"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRegister(false)}>Hủy</Button>
            <Button icon={UserPlus} onClick={submitRegister}>Đăng ký</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Họ tên" required>
            <Input placeholder="Nguyễn Văn A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Số điện thoại" required>
            <Input placeholder="09xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Email" hint="Không bắt buộc">
            <Input type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Hạng thành viên">
            <Select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
              <option value="Member">Member</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </Select>
          </Field>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.name}
        subtitle={detail ? `${detail.id} · Thành viên ${detail.tier}` : ''}
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Đóng</Button>}
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <DetailChip icon={Phone} label="Điện thoại" value={detail.phone} />
              <DetailChip icon={Crown} label="Hạng" value={detail.tier} />
            </div>
            <Divider className="my-2" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat icon={Star} label="Điểm thưởng" value={formatNumber(detail.points)} />
              <Stat icon={Gift} label="Tổng chi tiêu" value={formatCurrency(detail.spent)} />
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm">
              <span className="text-slate-500">Ngày tham gia: </span>
              <span className="font-medium text-slate-700">{formatDate(detail.joined)}</span>
            </div>
            <Button className="w-full" variant="secondary" icon={Mail} onClick={() => toast.info(`Đã gửi ưu đãi tới ${detail.name}.`)}>
              Gửi ưu đãi cá nhân
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
      <Icon size={15} className="text-brand-600" />
      <span className="text-slate-400">{label}:</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon size={13} /> {label}
      </div>
      <p className="mt-1 text-lg font-bold text-slate-800">{value}</p>
    </div>
  )
}
