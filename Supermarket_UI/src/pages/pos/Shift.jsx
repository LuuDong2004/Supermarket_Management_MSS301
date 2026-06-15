import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Clock, DollarSign, ShoppingCart, Banknote, Scale, LockKeyhole } from 'lucide-react'

export default function Shift() {
  const toast = useToast()
  const shift = db.shifts[0]
  const ordersInShift = 24

  const [actual, setActual] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [closed, setClosed] = useState(false)

  const expectedCash = shift.opening + shift.sales
  const actualNum = Number(actual) || 0
  const diff = actualNum - expectedCash

  const doClose = () => {
    setConfirm(false)
    setClosed(true)
    toast.success(`Đã đóng ca ${shift.id}. Chênh lệch ${formatCurrency(diff)}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.8.3"
        title="Ca thu ngân"
        subtitle="Quản lý mở/đóng ca và đối soát tiền mặt cuối ca."
        actions={<StatusBadge status={closed ? 'Đã đóng' : shift.status} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doanh thu ca" value={formatCurrency(shift.sales, { compact: true })} icon={DollarSign} tone="green" hint={shift.id} />
        <StatCard label="Số đơn" value={formatNumber(ordersInShift)} icon={ShoppingCart} tone="brand" hint="đã hoàn tất" />
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
          <CardHeader title={`Ca hiện tại · ${shift.id}`} icon={Clock} subtitle={`Thu ngân: ${shift.cashier}`} />
          <CardBody className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Giờ mở ca" value={shift.open} />
              <Info label="Giờ đóng ca" value={closed ? formatDate(new Date(), true) : shift.close} />
              <Info label="Tiền đầu ca" value={formatCurrency(shift.opening)} />
              <Info label="Doanh thu bán hàng" value={formatCurrency(shift.sales)} />
            </div>

            <Divider />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tiền mặt dự kiến</span>
                <span className="font-semibold text-slate-800">{formatCurrency(expectedCash)}</span>
              </div>
              <Field label="Tiền mặt thực đếm" hint="Nhập số tiền kiểm đếm thực tế trong két cuối ca">
                <Input
                  type="number"
                  placeholder="Nhập số tiền thực đếm..."
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  disabled={closed}
                />
              </Field>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">Chênh lệch</span>
                <span className={'text-lg font-bold ' + (diff === 0 ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-amber-600')}>
                  {formatCurrency(diff)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              variant="danger"
              icon={LockKeyhole}
              className="w-full"
              disabled={closed || !actual}
              onClick={() => setConfirm(true)}
            >
              {closed ? 'Ca đã đóng' : 'Đóng ca'}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Tóm tắt đối soát" icon={Scale} />
          <CardBody className="space-y-2.5 text-sm">
            <Row label="Tiền đầu ca" value={formatCurrency(shift.opening)} />
            <Row label="Doanh thu" value={formatCurrency(shift.sales)} tone="green" />
            <Divider className="my-3" />
            <Row label="Dự kiến trong két" value={formatCurrency(expectedCash)} />
            <Row label="Thực đếm" value={actual ? formatCurrency(actualNum) : '—'} />
            <Divider className="my-3" />
            <Row label="Chênh lệch" value={formatCurrency(diff)} bold tone={diff < 0 ? 'red' : 'green'} />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Lịch sử ca làm việc" icon={Clock} subtitle={`${db.shifts.length} ca gần đây`} />
        <CardBody className="p-0">
          <DataTable
            className="rounded-none border-0 shadow-none"
            rows={db.shifts}
            columns={[
              { key: 'id', header: 'Mã ca', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
              { key: 'cashier', header: 'Thu ngân' },
              { key: 'open', header: 'Mở ca' },
              { key: 'close', header: 'Đóng ca' },
              { key: 'sales', header: 'Doanh thu', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.sales)}</span> },
              { key: 'status', header: 'Trạng thái', align: 'center', render: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </CardBody>
      </Card>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Xác nhận đóng ca"
        subtitle={`${shift.id} · ${shift.cashier}`}
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
              Có chênh lệch {formatCurrency(Math.abs(diff))}. Vui lòng ghi chú lý do khi đối soát với quản lý.
            </p>
          )}
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
