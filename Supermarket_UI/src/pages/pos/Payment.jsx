import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency } from '../../lib/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { saleService, withFallback, toList, mockSales } from '../../services/index.js'
import {
  Banknote, CreditCard, Wallet, QrCode, ReceiptText, CheckCircle2, Printer, ShoppingCart,
} from 'lucide-react'

const ORDER_TOTAL = 648000
const ORDER_CODE = 'INV-20260615-0099'

const METHODS = [
  { key: 'cash', label: 'Tiền mặt', icon: Banknote },
  { key: 'card', label: 'Thẻ', icon: CreditCard },
  { key: 'wallet', label: 'Ví điện tử', icon: Wallet },
  { key: 'qr', label: 'QR Code', icon: QrCode },
]

const QUICK_CASH = [500000, 200000, 100000, 50000]

export default function Payment() {
  const toast = useToast()
  const { user } = useAuth()
  const [method, setMethod] = useState('cash')
  const [given, setGiven] = useState('')
  const [receipt, setReceipt] = useState(false)
  const [paid, setPaid] = useState(false)

  const [recentSales, setRecentSales] = useState([])
  const [source, setSource] = useState('backend')

  const load = async () => {
    const r = await withFallback(() => saleService.list(), mockSales)
    setRecentSales(toList(r.data)); setSource(r.source)
  }
  useEffect(() => { load() }, [])

  const givenNum = Number(given) || 0
  const change = useMemo(() => Math.max(0, givenNum - ORDER_TOTAL), [givenNum])
  const enoughCash = method !== 'cash' || givenNum >= ORDER_TOTAL

  const complete = async () => {
    if (!enoughCash) return toast.error('Số tiền khách đưa chưa đủ.')
    const now = new Date()
    const methodLabel = METHODS.find((m) => m.key === method)?.label
    try {
      await saleService.create({
        code: ORDER_CODE,
        saleTime: now.toTimeString().slice(0, 5),
        cashier: user?.fullName || user?.username || 'Thu ngân',
        items: 3,
        total: ORDER_TOTAL,
        payment: methodLabel,
      })
      toast.success('Thanh toán thành công! Hóa đơn đã được tạo.')
      await load()
    } catch (e) {
      toast.error(`Không tạo được hóa đơn: ${e.message}`)
    }
    setPaid(true)
    setReceipt(true)
  }

  const reset = () => {
    setReceipt(false)
    setPaid(false)
    setGiven('')
    setMethod('cash')
  }

  const methodLabel = METHODS.find((m) => m.key === method)?.label

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.2"
        title="Xử lý thanh toán"
        subtitle="Chọn phương thức và hoàn tất thanh toán cho đơn hàng hiện tại."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tiền mặt hôm nay" value={formatCurrency(4_180_000, { compact: true })} icon={Banknote} tone="green" hint="thu trong ca" />
        <StatCard label="Thẻ hôm nay" value={formatCurrency(1_640_000, { compact: true })} icon={CreditCard} tone="blue" hint="thu trong ca" />
        <StatCard label="Ví điện tử hôm nay" value={formatCurrency(660_000, { compact: true })} icon={Wallet} tone="violet" hint="thu trong ca" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment method */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Phương thức thanh toán" icon={Wallet} subtitle="Chọn hình thức khách thanh toán" />
            <CardBody>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {METHODS.map((m) => {
                  const active = m.key === method
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={
                        'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition ' +
                        (active
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50/50')
                      }
                    >
                      <m.icon size={22} />
                      {m.label}
                    </button>
                  )
                })}
              </div>

              {method === 'cash' && (
                <div className="mt-5 space-y-4">
                  <Field label="Tiền khách đưa">
                    <Input
                      type="number"
                      placeholder="Nhập số tiền khách đưa..."
                      value={given}
                      onChange={(e) => setGiven(e.target.value)}
                      autoFocus
                    />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_CASH.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setGiven(String(amt))}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300 hover:bg-brand-50"
                      >
                        {formatCurrency(amt)}
                      </button>
                    ))}
                    <button
                      onClick={() => setGiven(String(ORDER_TOTAL))}
                      className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100"
                    >
                      Vừa đủ
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">Tiền thối lại</span>
                    <span className="text-lg font-bold text-emerald-600">{formatCurrency(change)}</span>
                  </div>
                </div>
              )}

              {method !== 'cash' && (
                <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  {method === 'qr'
                    ? 'Yêu cầu khách quét mã QR hiển thị trên màn hình thanh toán.'
                    : method === 'card'
                      ? 'Quẹt/chạm thẻ trên máy POS và chờ xác nhận giao dịch.'
                      : 'Khách quét mã trên ứng dụng ví điện tử để thanh toán.'}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Giao dịch gần đây" icon={ShoppingCart} subtitle={`${recentSales.length} hóa đơn`} />
            <CardBody className="p-0">
              <DataTable
                className="rounded-none border-0 shadow-none"
                rows={recentSales}
                empty={{ title: 'Chưa có giao dịch' }}
                columns={[
                  { key: 'id', header: 'Hóa đơn', render: (r) => <span className="font-mono text-xs">{r.code || r.id}</span> },
                  { key: 'time', header: 'Giờ', render: (r) => r.saleTime || r.time },
                  { key: 'items', header: 'SP', align: 'center' },
                  { key: 'payment', header: 'Thanh toán', render: (r) => <Badge tone="slate">{r.payment}</Badge> },
                  { key: 'total', header: 'Tổng', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.total)}</span> },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        {/* Order summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Đơn hàng" icon={ReceiptText} subtitle="INV-20260615-0099" />
            <CardBody className="space-y-2.5 text-sm">
              <Row label="Tạm tính" value={formatCurrency(620000)} />
              <Row label="Giảm giá thành viên" value={`- ${formatCurrency(20000)}`} tone="green" />
              <Row label="VAT (8%)" value={formatCurrency(48000)} />
              <Divider className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Khách phải trả</span>
                <span className="text-xl font-bold text-brand-700">{formatCurrency(ORDER_TOTAL)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <span>Phương thức</span>
                <Badge tone="brand">{methodLabel}</Badge>
              </div>
              <Button size="lg" className="mt-3 w-full" icon={CheckCircle2} disabled={paid} onClick={complete}>
                Hoàn tất thanh toán
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={receipt}
        onClose={reset}
        title="Hóa đơn thanh toán"
        subtitle="INV-20260615-0099"
        footer={
          <>
            <Button variant="secondary" onClick={reset}>Đóng</Button>
            <Button variant="primary" icon={Printer} onClick={() => toast.info('Đang gửi hóa đơn tới máy in...')}>In hóa đơn</Button>
          </>
        }
      >
        <div className="space-y-2.5 text-sm">
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700">
            <CheckCircle2 size={18} />
            <span className="font-medium">Thanh toán thành công</span>
          </div>
          <Row label="Phương thức" value={methodLabel} />
          <Row label="Khách phải trả" value={formatCurrency(ORDER_TOTAL)} bold />
          {method === 'cash' && givenNum > 0 && (
            <>
              <Row label="Tiền khách đưa" value={formatCurrency(givenNum)} />
              <Row label="Tiền thối lại" value={formatCurrency(change)} tone="green" />
            </>
          )}
          <p className="pt-2 text-xs text-slate-400">Cảm ơn quý khách. Hẹn gặp lại!</p>
        </div>
      </Modal>
    </div>
  )
}

function Row({ label, value, tone, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={
        (tone === 'green' ? 'text-emerald-600 ' : 'text-slate-700 ') + (bold ? 'text-base font-bold' : 'font-medium')
      }>{value}</span>
    </div>
  )
}
