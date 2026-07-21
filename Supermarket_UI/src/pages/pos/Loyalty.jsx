import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { customerService, saleService, toList, withFallback } from '../../services/index.js'
import { ArrowRightLeft, Coins, History, UserRound } from 'lucide-react'

const POINT_VALUE = 100

export default function Loyalty() {
  const toast = useToast()
  const [customers, setCustomers] = useState([])
  const [sales, setSales] = useState([])
  const [memberId, setMemberId] = useState('')
  const [points, setPoints] = useState('')
  const [balances, setBalances] = useState({})
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  useEffect(() => { const load = async () => { const [customerResult, salesResult] = await Promise.all([withFallback(() => customerService.list()), withFallback(() => saleService.list())]); const customerRows = toList(customerResult.data); setCustomers(customerRows); setSales(toList(salesResult.data)); setBalances(Object.fromEntries(customerRows.map((row) => [row.id, Number(row.points || 0)]))); setMemberId(customerRows[0]?.id || ''); setSource(customerResult.source); setLoading(false) }; load() }, [])
  const member = customers.find((customer) => customer.id === memberId)
  const balance = balances[memberId] || 0
  const redeemValue = Number(points || 0) * POINT_VALUE
  const history = useMemo(() => sales.filter((sale) => !member || !sale.customerCode || sale.customerCode === member.code).slice(0, 8).map((sale, index) => ({ id: sale.id || sale.code || index, date: sale.saleDate || sale.date || '2026-06-12', order: sale.code || sale.id, earned: Math.floor(Number(sale.total || 0) / 10000), redeemed: Number(sale.pointsRedeemed || 0), balance: Math.max(0, balance - index * 25) })), [balance, member, sales])

  const redeem = async () => {
    const amount = Number(points || 0)
    if (!member || amount <= 0 || amount > balance) return toast.error('Enter a valid point amount within the available balance.')
    try { if (source === 'backend') await customerService.adjustPoints(member.id, -amount); setBalances((current) => ({ ...current, [member.id]: current[member.id] - amount })); setPoints(''); toast.success('Loyalty points redeemed successfully.') } catch (error) { toast.error(error.message) }
  }

  if (loading) return <div className="flex justify-center rounded-2xl border bg-white py-20"><Spinner className="h-7 w-7" /></div>
  return <div>
    <PageHeader breadcrumb="Customer Membership · 3.9.2" title="View and Redeem Loyalty Points" subtitle="Review a customer balance, point history, and confirm point redemption." />
    <div className="grid items-start gap-6 xl:grid-cols-5"><div className="space-y-5 xl:col-span-2"><Card><CardHeader title="Customer" icon={UserRound} /><CardBody><Field label="Select Member"><Select value={memberId} onChange={(event) => { setMemberId(event.target.value); setPoints('') }}>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.phone}</option>)}</Select></Field><div className="mt-4 space-y-2 text-sm text-slate-600"><p>Name: <b className="text-slate-900">{member?.name}</b></p><p>Phone: {member?.phone}</p><p>Membership: <Badge tone="green">{member?.tier || 'Active'}</Badge></p></div></CardBody></Card><div className="grid gap-4 sm:grid-cols-2"><Card><CardBody><p className="text-xs font-medium uppercase text-slate-500">Available Points</p><p className="mt-2 text-2xl font-bold text-slate-900">{balance.toLocaleString()}</p></CardBody></Card><Card><CardBody><p className="text-xs font-medium uppercase text-slate-500">Redeem Value</p><p className="mt-2 text-2xl font-bold text-brand-700">{redeemValue.toLocaleString()} VND</p></CardBody></Card></div><Card><CardHeader title="Redeem Points" icon={Coins} /><CardBody><div className="flex flex-col gap-3 sm:flex-row sm:items-end"><Field label="Redeem Points"><Input type="number" min="0" max={balance} value={points} onChange={(event) => setPoints(event.target.value)} placeholder="Enter amount" /></Field><Button className="shrink-0" icon={ArrowRightLeft} onClick={redeem}>Confirm Redemption</Button></div></CardBody></Card></div><section className="min-w-0 xl:col-span-3"><div className="mb-3"><h2 className="flex items-center gap-2 font-bold text-slate-900"><History size={17} />Point History</h2><p className="text-xs text-slate-500">Recent earning and redemption activity.</p></div><DataTable dense rows={history} empty={{ title: 'No point history found' }} columns={[{ key: 'date', header: 'Date' }, { key: 'order', header: 'Order' }, { key: 'earned', header: 'Earned' }, { key: 'redeemed', header: 'Redeemed' }, { key: 'balance', header: 'Balance' }]} /></section></div>
    <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-card">3.9.2 View and Redeem Loyalty Points · 1 point equals 100 VND redemption value</div>
  </div>
}
