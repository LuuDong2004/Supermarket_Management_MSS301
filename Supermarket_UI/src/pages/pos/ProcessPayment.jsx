import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Badge, Button, Card, CardBody, CardHeader, Field, Input } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency } from '../../lib/format.js'
import { Banknote, CheckCircle2, CreditCard, QrCode } from 'lucide-react'

const GRAND_TOTAL = 648000

export default function ProcessPayment() {
  const toast = useToast()
  const [method, setMethod] = useState('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [status, setStatus] = useState('Pending')
  const change = useMemo(() => Math.max(0, Number(cashReceived || 0) - GRAND_TOTAL), [cashReceived])

  const confirm = () => {
    setStatus('Successful')
    toast.success('Thanh toán đã được xác nhận.')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Bán hàng · 3.8.2"
        title="Process Payment"
        subtitle="Select a payment method and confirm the current sale payment status."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[520px]">
          <CardHeader title="Payment Method" />
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input type="radio" name="payment-method" checked={method === 'cash'} onChange={() => setMethod('cash')} />
                <Banknote size={18} /> Cash Payment
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input type="radio" name="payment-method" checked={method === 'qr'} onChange={() => setMethod('qr')} />
                <QrCode size={18} /> QR Banking Payment
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                <input type="radio" name="payment-method" checked={method === 'card'} onChange={() => setMethod('card')} />
                <CreditCard size={18} /> Card Payment
              </label>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-slate-800">Amount Due</h3>
              <div className="space-y-3 border border-slate-900 p-4 text-sm">
                <div className="flex justify-between"><span>Grand total</span><strong>{formatCurrency(GRAND_TOTAL)}</strong></div>
                {method === 'cash' && (
                  <Field label="Cash received">
                    <Input type="number" min="0" value={cashReceived} onChange={(event) => setCashReceived(event.target.value)} placeholder="Nhập số tiền khách đưa" />
                  </Field>
                )}
                <div className="flex justify-between"><span>Change</span><strong>{formatCurrency(change)}</strong></div>
              </div>
            </div>

            <Button icon={CheckCircle2} onClick={confirm}>Confirm Payment</Button>
          </CardBody>
        </Card>

        <Card className="min-h-[520px]">
          <CardHeader title="QR Payment Status" />
          <CardBody>
            <div className="mx-auto flex h-64 max-w-xs items-center justify-center border border-slate-900 bg-slate-50 text-2xl font-bold tracking-widest text-slate-800">
              {method === 'qr' ? 'QR CODE' : 'PAYMENT'}
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span>Status:</span>
              <Badge tone={status === 'Successful' ? 'green' : 'amber'} dot>{status}</Badge>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
