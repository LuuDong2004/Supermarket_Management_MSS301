import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input, Textarea, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { shiftService, saleService, withFallback, toList, mockShifts } from '../../services/index.js'
import { Clock, DollarSign, ShoppingCart, Banknote, Scale, LockKeyhole, Plus } from 'lucide-react'

const EMPTY_SHIFT = { code: '', cashier: '', open: '', close: '', opening: 0, sales: 0, status: 'Đang mở' }

export default function Shift() {
  const toast = useToast()
  const confirmDialog = useConfirm()
  const { user } = useAuth()

  const [shifts, setShifts] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [actual, setActual] = useState('')
  const [note, setNote] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [openShift, setOpenShift] = useState(false)
  const [openForm, setOpenForm] = useState({ opening: '' })

  const load = async () => {
    setLoading(true)
    const [rs, rsale] = await Promise.all([
      withFallback(() => shiftService.list(), mockShifts),
      withFallback(() => saleService.list()),
    ])
    setShifts(toList(rs.data)); setSales(toList(rsale.data)); setSource(rs.source); setLoading(false)
  }
  useEffect(() => { load() }, [])

  // Current shift = first open one, else most recent.
  const shift = shifts.find((s) => s.status !== 'Đã đóng') || shifts[0] || EMPTY_SHIFT
  const closed = shift.status === 'Đã đóng'

  // Real per-shift aggregation: completed sales by this cashier since the shift opened.
  const live = useMemo(() => {
    if (!shift || closed) return { sales: shift.sales || 0, orders: shift.orders || 0 }
    const openedAt = shift.createdAt ? new Date(shift.createdAt).getTime() : 0
    const mine = sales.filter((s) =>
      s.status === 'COMPLETED' &&
      (s.cashier || '') === (shift.cashier || '') &&
      (!openedAt || (s.createdAt && new Date(s.createdAt).getTime() >= openedAt)))
    return {
      sales: mine.reduce((sum, s) => sum + (Number(s.total) || 0), 0),
      orders: mine.length,
    }
  }, [sales, shift, closed])

  const shiftSales = closed ? (shift.sales || 0) : live.sales
  const shiftOrders = closed ? (shift.orders || 0) : live.orders
  const expectedCash = (shift.opening || 0) + shiftSales
  const actualNum = Number(actual) || 0
  const diff = actualNum - expectedCash

  const doClose = async () => {
    try {
      await shiftService.update(shift.id, {
        code: shift.code || shift.id,
        cashier: shift.cashier,
        openAt: shift.openAt || shift.open,
        closeAt: formatDate(new Date(), true),
        opening: shift.opening || 0,
        sales: shiftSales,
        closingActual: actualNum,
        orders: shiftOrders,
        varianceNote: note || null,
        status: 'Đã đóng',
      })
      setConfirm(false)
      toast.success(`Đã đóng ca ${shift.code || shift.id}. Chênh lệch ${formatCurrency(diff)}.`)
      setActual(''); setNote('')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  const doOpen = async () => {
    const cashier = user?.fullName || user?.username || 'Thu ngân'
    if (!(await confirmDialog({
      title: 'Mở ca mới?',
      message: `Mở ca thu ngân cho ${cashier} với tiền đầu ca ${formatCurrency(Number(openForm.opening) || 0)}.`,
      confirmLabel: 'Mở ca',
    }))) return
    try {
      await shiftService.create({
        code: `SH-${Date.now()}`,
        cashier,
        openAt: formatDate(new Date(), true),
        closeAt: '',
        opening: Number(openForm.opening) || 0,
        sales: 0,
        status: 'Đang mở',
      })
      setOpenShift(false)
      setOpenForm({ opening: '' })
      toast.success('Đã mở ca mới.')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.3"
        title="Ca thu ngân"
        subtitle="Quản lý mở/đóng ca và đối soát tiền mặt cuối ca."
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={shift.status} />
            <Button variant="secondary" icon={Plus} onClick={() => setOpenShift(true)}>Mở ca</Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu ca" value={formatCurrency(shiftSales, { compact: true })} icon={DollarSign} tone="green" hint={shift.code || '—'} />
        <StatCard label="Số đơn" value={formatNumber(shiftOrders)} icon={ShoppingCart} tone="brand" hint="đã hoàn tất" />
        <StatCard label="Tiền mặt dự kiến" value={formatCurrency(expectedCash, { compact: true })} icon={Banknote} tone="blue" hint="đầu ca + bán hàng" />
        <StatCard
          label="Chênh lệch"
          value={formatCurrency(diff)}
          icon={Scale}
          tone={diff === 0 ? 'green' : diff < 0 ? 'red' : 'amber'}
          hint={actual ? 'so với dự kiến' : 'chưa kiểm đếm'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`Ca hiện tại · ${shift.code || shift.id}`} icon={Clock} subtitle={`Thu ngân: ${shift.cashier}`} />
          <CardBody className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Giờ mở ca" value={shift.openAt || shift.open} />
              <Info label="Giờ đóng ca" value={shift.closeAt || shift.close || '—'} />
              <Info label="Tiền đầu ca" value={formatCurrency(shift.opening)} />
              <Info label="Doanh thu bán hàng" value={formatCurrency(shiftSales)} />
            </div>

            <Divider />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tiền mặt dự kiến</span>
                <span className="font-semibold text-slate-800">{formatCurrency(expectedCash)}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tiền mặt thực đếm" hint="Số tiền kiểm đếm thực tế trong két cuối ca">
                  <Input
                    type="number"
                    placeholder="Nhập số tiền thực đếm..."
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                    disabled={closed}
                  />
                </Field>
                <div className="flex items-center justify-between self-start rounded-lg bg-slate-50 px-4 py-2.5 sm:mt-7">
                  <span className="text-sm font-medium text-slate-600">Chênh lệch</span>
                  <span className={'text-lg font-bold ' + (diff === 0 ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-amber-600')}>
                    {formatCurrency(diff)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="danger"
                icon={LockKeyhole}
                disabled={closed || !actual || !shift.id}
                onClick={() => setConfirm(true)}
              >
                {closed ? 'Ca đã đóng' : 'Đóng ca'}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Tóm tắt đối soát" icon={Scale} />
          <CardBody className="space-y-2.5 text-sm">
            <Row label="Tiền đầu ca" value={formatCurrency(shift.opening)} />
            <Row label="Doanh thu" value={formatCurrency(shiftSales)} tone="green" />
            <Divider className="my-3" />
            <Row label="Dự kiến trong két" value={formatCurrency(expectedCash)} />
            <Row label="Thực đếm" value={actual ? formatCurrency(actualNum) : '—'} />
            <Divider className="my-3" />
            <Row label="Chênh lệch" value={formatCurrency(diff)} bold tone={diff < 0 ? 'red' : 'green'} />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Lịch sử ca làm việc" icon={Clock} subtitle={`${shifts.length} ca gần đây`} />
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Spinner className="h-7 w-7" /></div>
          ) : (
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={shifts}
              columns={[
                { key: 'id', header: 'Mã ca', render: (r) => <span className="font-mono text-xs">{r.code || r.id}</span> },
                { key: 'cashier', header: 'Thu ngân' },
                { key: 'open', header: 'Mở ca', render: (r) => r.openAt || r.open },
                { key: 'close', header: 'Đóng ca', render: (r) => r.closeAt || r.close || '—' },
                { key: 'sales', header: 'Doanh thu', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.sales)}</span> },
                { key: 'status', header: 'Trạng thái', align: 'center', render: (r) => <StatusBadge status={r.status} /> },
              ]}
            />
          )}
        </CardBody>
      </Card>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Xác nhận đóng ca"
        subtitle={`${shift.code || shift.id} · ${shift.cashier}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>Hủy</Button>
            <Button variant="danger" icon={LockKeyhole} onClick={doClose}>Xác nhận đóng ca</Button>
          </>
        }
      >
        <div className="space-y-2.5 text-sm">
          <Row label="Tiền mặt dự kiến" value={formatCurrency(expectedCash)} />
          <Row label="Tiền mặt thực đếm" value={formatCurrency(actualNum)} />
          <Divider className="my-3" />
          <Row label="Chênh lệch" value={formatCurrency(diff)} bold tone={diff < 0 ? 'red' : 'green'} />
          {diff !== 0 && (
            <p className="pt-2 text-xs text-amber-600">
              Có chênh lệch {formatCurrency(Math.abs(diff))} ({diff < 0 ? 'thiếu' : 'thừa'}). Vui lòng ghi chú lý do khi đối soát với quản lý.
            </p>
          )}
          <Field label="Ghi chú chênh lệch" className="pt-2">
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lý do thừa/thiếu tiền (nếu có)..." />
          </Field>
        </div>
      </Modal>

      <Modal
        open={openShift}
        onClose={() => setOpenShift(false)}
        title="Mở ca mới"
        subtitle={user?.fullName || user?.username || 'Thu ngân'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpenShift(false)}>Hủy</Button>
            <Button icon={Plus} onClick={doOpen}>Mở ca</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Tiền đầu ca" hint="Số tiền mặt trong két khi bắt đầu ca">
            <Input
              type="number"
              placeholder="Nhập số tiền đầu ca..."
              value={openForm.opening}
              onChange={(e) => setOpenForm({ opening: e.target.value })}
            />
          </Field>
        </div>
      </Modal>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 font-semibold text-slate-700">{value}</p>
    </div>
  )
}

function Row({ label, value, tone, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={
        (tone === 'green' ? 'text-emerald-600 ' : tone === 'red' ? 'text-rose-600 ' : 'text-slate-700 ') + (bold ? 'text-base font-bold' : 'font-medium')
      }>{value}</span>
    </div>
  )
}
