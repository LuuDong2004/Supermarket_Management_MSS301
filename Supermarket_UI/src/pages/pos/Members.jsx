import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import { customerService, withFallback, toList, mockCustomers } from '../../services/index.js'
import { Search, UserPlus, Users, Crown, Star, Eye } from 'lucide-react'

const TIER_TONE = { Platinum: 'violet', Gold: 'amber', Silver: 'slate', Member: 'blue' }

export default function Members() {
  const toast = useToast()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('all')
  const [register, setRegister] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', tier: 'Member' })

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => customerService.list(), mockCustomers)
    setMembers(toList(r.data)); setSource(r.source); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members.filter((c) => {
      const matchQ = !q || (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q)
      const matchT = tier === 'all' || c.tier === tier
      return matchQ && matchT
    })
  }, [members, search, tier])

  const goldPlus = members.filter((c) => c.tier === 'Gold' || c.tier === 'Platinum').length
  const avgPoints = members.length ? Math.round(members.reduce((s, c) => s + (c.points || 0), 0) / members.length) : 0

  const submitRegister = async () => {
    if (!form.name.trim() || !form.phone.trim()) return toast.error('Vui lòng nhập họ tên và số điện thoại.')
    const payload = {
      code: `C${String(members.length + 1).padStart(3, '0')}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      tier: form.tier,
      points: 0,
      joined: new Date().toISOString().slice(0, 10),
      spent: 0,
    }
    try {
      await customerService.create(payload)
      toast.success(`Đã đăng ký thành viên ${payload.name}.`)
      setRegister(false)
      setForm({ name: '', phone: '', email: '', tier: 'Member' })
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.9.1"
        title="Khách hàng thành viên"
        subtitle="Tra cứu, đăng ký và quản lý thông tin khách hàng thành viên."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={UserPlus} onClick={() => setRegister(true)}>Đăng ký thành viên</Button>
          </div>
        }
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

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
      <DataTable
        rows={filtered}
        onRowClick={(r) => navigate(`/app/pos/members/${r.id}`)}
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
        actions={(r) => (
          <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/app/pos/members/${r.id}`)}>Xem</Button>
        )}
      />
      )}

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
    </div>
  )
}
