import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Select, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import { customerService, withFallback, toList, mockCustomers } from '../../services/index.js'
import { Star, Gift, Coins, Crown, ArrowRightLeft } from 'lucide-react'

const POINT_VALUE = 1000 // 1 điểm = 1.000đ
const TIER_TONE = { Platinum: 'violet', Gold: 'amber', Silver: 'slate', Member: 'blue' }

const INITIAL_HISTORY = [
  { id: 'RD-118', customer: 'Trần Thị Mai', points: 200, value: 200000, date: '2026-06-12', note: 'Đổi voucher mua sắm' },
  { id: 'RD-117', customer: 'Phạm Thu Hà', points: 500, value: 500000, date: '2026-06-08', note: 'Đổi quà tặng' },
  { id: 'RD-116', customer: 'Nguyễn Văn Hùng', points: 100, value: 100000, date: '2026-06-03', note: 'Giảm trừ hóa đơn' },
]

export default function Loyalty() {
  const toast = useToast()
  const [customers, setCustomers] = useState([])
  const [source, setSource] = useState('backend')
  const [memberId, setMemberId] = useState('')
  const [redeem, setRedeem] = useState('')
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [balances, setBalances] = useState({})

  useEffect(() => {
    ;(async () => {
      const r = await withFallback(() => customerService.list(), mockCustomers)
      const list = toList(r.data)
      setCustomers(list)
      setSource(r.source)
      setBalances(Object.fromEntries(list.map((c) => [c.id, c.points])))
      if (list.length) setMemberId(list[0].id)
    })()
  }, [])

  const member = customers.find((c) => c.id === memberId)
  const balance = balances[memberId] ?? 0

  const redeemNum = Number(redeem) || 0
  const redeemValue = useMemo(() => redeemNum * POINT_VALUE, [redeemNum])
  const totalRedeemed = history.reduce((s, h) => s + h.points, 0)

  const doRedeem = () => {
    if (redeemNum <= 0) return toast.error('Vui lòng nhập số điểm cần đổi.')
    if (redeemNum > balance) return toast.error(`Số điểm vượt quá số dư (${formatNumber(balance)} điểm).`)
    const entry = {
      id: `RD-${119 + history.length}`,
      customer: member.name,
      points: redeemNum,
      value: redeemValue,
      date: new Date().toISOString().slice(0, 10),
      note: 'Đổi điểm tại quầy',
    }
    setHistory((h) => [entry, ...h])
    setBalances((b) => ({ ...b, [memberId]: b[memberId] - redeemNum }))
    setRedeem('')
    toast.success(`Đã đổi ${formatNumber(redeemNum)} điểm (${formatCurrency(redeemValue)}).`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.9.2"
        title="Điểm thưởng"
        subtitle="Tra cứu số dư điểm và đổi điểm thưởng cho khách hàng thành viên."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Số dư điểm" value={formatNumber(balance)} icon={Star} tone="violet" hint={member?.name} />
        <StatCard label="Giá trị quy đổi" value={formatCurrency(balance * POINT_VALUE, { compact: true })} icon={Coins} tone="amber" hint="1 điểm = 1.000đ" />
        <StatCard label="Đã đổi (kỳ này)" value={formatNumber(totalRedeemed)} icon={Gift} tone="green" hint={`${history.length} lượt`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Đổi điểm thưởng" icon={ArrowRightLeft} subtitle="Chọn thành viên và số điểm cần đổi" />
          <CardBody className="space-y-5">
            <Field label="Thành viên">
              <Select value={memberId} onChange={(e) => { setMemberId(e.target.value); setRedeem('') }}>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
                ))}
              </Select>
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Số dư hiện tại</p>
                <p className="mt-1 text-3xl font-bold text-brand-700">{formatNumber(balance)} <span className="text-base font-medium">điểm</span></p>
                <p className="mt-0.5 text-sm text-brand-600">≈ {formatCurrency(balance * POINT_VALUE)}</p>
              </div>
              <Badge tone={TIER_TONE[member?.tier] || 'slate'} className="self-start">
                <Crown size={13} /> {member?.tier}
              </Badge>
            </div>

            <Divider />

            <Field label="Số điểm muốn đổi" hint={`Tối đa ${formatNumber(balance)} điểm`}>
              <Input
                type="number"
                placeholder="Nhập số điểm..."
                value={redeem}
                onChange={(e) => setRedeem(e.target.value)}
              />
            </Field>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-600">Giá trị quy đổi</span>
              <span className="text-lg font-bold text-emerald-600">{formatCurrency(redeemValue)}</span>
            </div>
            <Button size="lg" icon={ArrowRightLeft} className="w-full" disabled={redeemNum <= 0} onClick={doRedeem}>
              Đổi điểm
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quy tắc tích điểm" icon={Coins} />
          <CardBody className="space-y-3 text-sm">
            <Rule label="Tỷ giá quy đổi" value="1 điểm = 1.000đ" />
            <Rule label="Tích điểm" value="1đ / 10.000đ chi tiêu" />
            <Rule label="Hạn sử dụng điểm" value="12 tháng" />
            <Rule label="Điểm tối thiểu để đổi" value="100 điểm" />
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
              Điểm thưởng có thể dùng để giảm trừ trực tiếp vào hóa đơn hoặc đổi quà tặng tại quầy.
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Lịch sử đổi điểm" icon={Gift} subtitle={`${history.length} giao dịch`} />
        <CardBody className="p-0">
          <DataTable
            className="rounded-none border-0 shadow-none"
            rows={history}
            empty={{ title: 'Chưa có giao dịch đổi điểm' }}
            columns={[
              { key: 'id', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
              { key: 'customer', header: 'Khách hàng' },
              { key: 'points', header: 'Điểm', align: 'right', render: (r) => <span className="font-semibold">{formatNumber(r.points)}</span> },
              { key: 'value', header: 'Giá trị', align: 'right', render: (r) => <span className="font-semibold text-slate-800">{formatCurrency(r.value)}</span> },
              { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
              { key: 'note', header: 'Ghi chú', render: (r) => <span className="text-slate-500">{r.note}</span> },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  )
}

function Rule({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  )
}
