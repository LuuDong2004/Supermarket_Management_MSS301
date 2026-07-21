import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Spinner, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency } from '../../lib/format.js'
import { mockPromotions, mockVouchers, promotionService, toList, voucherService, withFallback } from '../../services/index.js'
import { BadgePercent, Calculator, RotateCcw } from 'lucide-react'

const SUBTOTAL = 650000
const voucherMinimum = (voucher) => Number(voucher.minSpend ?? voucher.min ?? 0)

export default function Promotions() {
  const toast = useToast()
  const [promotions, setPromotions] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { const load = async () => { const [promotionResult, voucherResult] = await Promise.all([withFallback(() => promotionService.list(), mockPromotions), withFallback(() => voucherService.list(), mockVouchers)]); setPromotions(toList(promotionResult.data)); setVouchers(toList(voucherResult.data)); setLoading(false) }; load() }, [])
  const discount = useMemo(() => { if (!applied || SUBTOTAL < voucherMinimum(applied)) return 0; return applied.type === 'percent' ? Math.round(SUBTOTAL * Number(applied.value || applied.discount || 0) / 100) : Number(applied.value || applied.discount || 0) }, [applied])
  const apply = () => { const voucher = vouchers.find((item) => String(item.code || '').toLowerCase() === code.trim().toLowerCase()); if (!voucher) return toast.error('Promotion or voucher code is not valid.'); if (SUBTOTAL < voucherMinimum(voucher)) return toast.error('The cart does not meet the minimum spend.'); setApplied(voucher); toast.success(`${voucher.code} applied to the current cart.`) }
  const remove = () => { setApplied(null); setCode('') }
  return <div>
    <PageHeader breadcrumb="Customer Membership · 3.9.3" title="Apply Promotion, Discount, or Voucher" subtitle="Validate an eligible promotion and calculate the current cart discount." />
    {loading ? <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div> : <div className="grid items-start gap-6 lg:grid-cols-2"><Card className="min-h-[28rem]"><CardHeader title="Promotion / Voucher" icon={BadgePercent} /><CardBody><div className="mb-5 flex items-end gap-3"><Field label="Promotion Code"><Input placeholder="Enter code" value={code} onChange={(event) => setCode(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && apply()} /></Field><Button onClick={apply}>Apply</Button></div><h3 className="mb-3 font-bold text-slate-900">Eligible Promotions</h3><DataTable dense rows={promotions} empty={{ title: 'No eligible promotions' }} columns={[
      { key: 'name', header: 'Campaign' }, { key: 'scope', header: 'Rule' }, { key: 'discount', header: 'Discount', render: (row) => `${row.discount || row.value || 0}%` }, { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    ]} /></CardBody></Card><div><Card className="min-h-[18rem]"><CardHeader title="Cart Discount Summary" icon={Calculator} /><CardBody className="space-y-3 text-sm text-slate-600"><p>Subtotal: <b className="text-slate-900">{formatCurrency(SUBTOTAL)}</b></p><p>Applied campaign: <Badge tone={applied ? 'green' : 'slate'}>{applied?.code || 'None'}</Badge></p><p>Discount amount: <b className="text-emerald-700">{formatCurrency(discount)}</b></p><p>Stacking rule: one voucher only</p><div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-4"><p className="text-xs uppercase text-brand-600">Cart total after discount</p><p className="mt-1 text-2xl font-bold text-brand-800">{formatCurrency(SUBTOTAL - discount)}</p></div></CardBody></Card><div className="mt-5 flex gap-3"><Button variant="secondary" icon={RotateCcw} onClick={remove}>Remove</Button><Button icon={Calculator} onClick={() => toast.success('Cart discount recalculated.')}>Recalculate</Button></div></div></div>}
    <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.9.3 Apply Promotion, Discount, or Voucher · one eligible voucher can be applied per cart</div>
  </div>
}
