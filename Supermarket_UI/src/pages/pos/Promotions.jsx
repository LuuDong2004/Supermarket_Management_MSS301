import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { BadgePercent, Ticket, CheckCircle2, Search, Calendar } from 'lucide-react'

export default function Promotions() {
  const toast = useToast()
  const [tab, setTab] = useState('promos')
  const [code, setCode] = useState('')
  const [checked, setChecked] = useState(null)

  const running = db.promotions.filter((p) => p.status === 'Đang chạy').length

  const apply = (p) => toast.success(`Đã áp dụng "${p.name}" cho phiên bán hàng.`)

  const checkCode = () => {
    const v = db.vouchers.find((x) => x.code.toLowerCase() === code.trim().toLowerCase())
    if (!v) {
      setChecked({ ok: false })
      return toast.error('Mã không hợp lệ hoặc đã hết hạn.')
    }
    setChecked({ ok: true, voucher: v })
    toast.success(`Mã hợp lệ: ${v.label}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.9.3"
        title="Khuyến mãi & Voucher"
        subtitle="Quản lý chương trình khuyến mãi và kiểm tra mã giảm giá."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Chương trình KM" value={formatNumber(db.promotions.length)} icon={BadgePercent} tone="brand" hint={`${running} đang chạy`} />
        <StatCard label="Voucher khả dụng" value={formatNumber(db.vouchers.length)} icon={Ticket} tone="violet" hint="đang phát hành" />
        <StatCard label="Đang chạy" value={formatNumber(running)} icon={CheckCircle2} tone="green" hint="chương trình" />
      </div>

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'promos', label: 'Chương trình KM', count: db.promotions.length },
          { value: 'vouchers', label: 'Voucher', count: db.vouchers.length },
        ]}
      />

      {tab === 'promos' && (
        <DataTable
          rows={db.promotions}
          empty={{ title: 'Chưa có chương trình khuyến mãi' }}
          columns={[
            { key: 'name', header: 'Chương trình', render: (r) => (
              <div>
                <p className="font-medium text-slate-700">{r.name}</p>
                <p className="font-mono text-xs text-slate-400">{r.id}</p>
              </div>
            ) },
            { key: 'scope', header: 'Phạm vi', render: (r) => <Badge tone="slate">{r.scope}</Badge> },
            { key: 'discount', header: 'Giảm', align: 'center', render: (r) => <span className="font-semibold text-brand-700">{r.discount}%</span> },
            { key: 'range', header: 'Thời gian', render: (r) => (
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <Calendar size={13} className="text-slate-400" />
                {formatDate(r.from)} – {formatDate(r.to)}
              </span>
            ) },
            { key: 'status', header: 'Trạng thái', align: 'center', render: (r) => <StatusBadge status={r.status} /> },
            { key: 'action', header: '', align: 'right', render: (r) => (
              <Button variant="secondary" size="sm" icon={CheckCircle2} onClick={() => apply(r)}>Áp dụng</Button>
            ) },
          ]}
        />
      )}

      {tab === 'vouchers' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {db.vouchers.map((v) => (
              <Card key={v.code}>
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 font-mono text-sm font-semibold text-brand-700">
                      <Ticket size={15} /> {v.code}
                    </span>
                    <Badge tone={v.type === 'percent' ? 'violet' : 'green'}>
                      {v.type === 'percent' ? `${v.value}%` : formatCurrency(v.value)}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{v.label}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span>Đơn tối thiểu</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(v.min)}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader title="Kiểm tra mã giảm giá" icon={Search} subtitle="Nhập mã để xác thực trước khi áp dụng" />
            <CardBody className="space-y-4">
              <div className="flex gap-2">
                <Field className="flex-1">
                  <Input
                    placeholder="Nhập mã voucher..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkCode()}
                  />
                </Field>
                <Button icon={Search} onClick={checkCode}>Kiểm tra</Button>
              </div>
              {checked && checked.ok && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 size={16} /> Mã hợp lệ — {checked.voucher.label}
                  </span>
                  <span className="font-semibold">Tối thiểu {formatCurrency(checked.voucher.min)}</span>
                </div>
              )}
              {checked && !checked.ok && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Mã không hợp lệ hoặc đã hết hạn.
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}
