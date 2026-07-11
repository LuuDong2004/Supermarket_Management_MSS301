import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Divider, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import {
  promotionService, voucherService, withFallback, toList, mockPromotions, mockVouchers,
} from '../../services/index.js'
import { BadgePercent, Ticket, CheckCircle2, Search, Calendar, Save, Trash2 } from 'lucide-react'

const emptyPromo = { code: '', name: '', scope: '', discount: 10, type: 'percent', fromDate: '', toDate: '', status: 'Đang chạy' }
const emptyVoucher = { code: '', type: 'percent', value: 10, minSpend: 0, label: '' }

export default function Promotions() {
  const toast = useToast()
  const [tab, setTab] = useState('promos')
  const [code, setCode] = useState('')
  const [checked, setChecked] = useState(null)

  const [promos, setPromos] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [promoForm, setPromoForm] = useState(emptyPromo)
  const [voucherForm, setVoucherForm] = useState(emptyVoucher)

  const load = async () => {
    setLoading(true)
    const [rp, rv] = await Promise.all([
      withFallback(() => promotionService.list(), mockPromotions),
      withFallback(() => voucherService.list(), mockVouchers),
    ])
    setPromos(toList(rp.data))
    setVouchers(toList(rv.data))
    setSource(rp.source === 'backend' && rv.source === 'backend' ? 'backend' : 'mock')
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const running = promos.filter((p) => p.status === 'Đang chạy').length

  const apply = (p) => toast.success(`Đã áp dụng "${p.name}" cho phiên bán hàng.`)

  const savePromo = async () => {
    if (!promoForm.code.trim() || !promoForm.name.trim()) return toast.error('Vui lòng nhập mã và tên chương trình.')
    const payload = { ...promoForm, discount: Number(promoForm.discount) || 0 }
    try {
      if (promoForm.id) await promotionService.update(promoForm.id, payload)
      else await promotionService.create(payload)
      toast.success('Đã lưu chương trình khuyến mãi.')
      setPromoForm(emptyPromo)
      await load()
    } catch (e) { toast.error(e.message) }
  }
  const editPromo = (p) => setPromoForm({
    id: p.id, code: p.code || p.id, name: p.name || '', scope: p.scope || '',
    discount: p.discount ?? 0, type: p.type || 'percent',
    fromDate: p.fromDate || p.from || '', toDate: p.toDate || p.to || '', status: p.status || 'Đang chạy',
  })
  const removePromo = async (p) => {
    try { await promotionService.remove(p.id); toast.success('Đã xóa chương trình.'); await load() }
    catch (e) { toast.error(e.message) }
  }

  const saveVoucher = async () => {
    if (!voucherForm.code.trim()) return toast.error('Vui lòng nhập mã voucher.')
    const payload = { ...voucherForm, value: Number(voucherForm.value) || 0, minSpend: Number(voucherForm.minSpend) || 0 }
    try {
      if (voucherForm.id) await voucherService.update(voucherForm.id, payload)
      else await voucherService.create(payload)
      toast.success('Đã lưu voucher.')
      setVoucherForm(emptyVoucher)
      await load()
    } catch (e) { toast.error(e.message) }
  }
  const editVoucher = (v) => setVoucherForm({
    id: v.id, code: v.code || '', type: v.type || 'percent',
    value: v.value ?? 0, minSpend: v.minSpend ?? v.min ?? 0, label: v.label || '',
  })
  const removeVoucher = async (v) => {
    try { await voucherService.remove(v.id); toast.success('Đã xóa voucher.'); await load() }
    catch (e) { toast.error(e.message) }
  }

  const checkCode = () => {
    const v = vouchers.find((x) => (x.code || '').toLowerCase() === code.trim().toLowerCase())
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
        <StatCard label="Chương trình KM" value={formatNumber(promos.length)} icon={BadgePercent} tone="brand" hint={`${running} đang chạy`} />
        <StatCard label="Voucher khả dụng" value={formatNumber(vouchers.length)} icon={Ticket} tone="violet" hint="đang phát hành" />
        <StatCard label="Đang chạy" value={formatNumber(running)} icon={CheckCircle2} tone="green" hint="chương trình" />
      </div>

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'promos', label: 'Chương trình KM', count: promos.length },
          { value: 'vouchers', label: 'Voucher', count: vouchers.length },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : tab === 'promos' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DataTable
              rows={promos}
              onRowClick={editPromo}
              empty={{ title: 'Chưa có chương trình khuyến mãi' }}
              columns={[
                { key: 'name', header: 'Chương trình', render: (r) => (
                  <div>
                    <p className="font-medium text-slate-700">{r.name}</p>
                    <p className="font-mono text-xs text-slate-400">{r.code || r.id}</p>
                  </div>
                ) },
                { key: 'scope', header: 'Phạm vi', render: (r) => <Badge tone="slate">{r.scope}</Badge> },
                { key: 'discount', header: 'Giảm', align: 'center', render: (r) => <span className="font-semibold text-brand-700">{r.discount}%</span> },
                { key: 'range', header: 'Thời gian', render: (r) => (
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <Calendar size={13} className="text-slate-400" />
                    {formatDate(r.fromDate || r.from)} – {formatDate(r.toDate || r.to)}
                  </span>
                ) },
                { key: 'status', header: 'Trạng thái', align: 'center', render: (r) => <StatusBadge status={r.status} /> },
                { key: 'action', header: '', align: 'right', render: (r) => (
                  <Button variant="secondary" size="sm" icon={CheckCircle2} onClick={(e) => { e.stopPropagation(); apply(r) }}>Áp dụng</Button>
                ) },
              ]}
            />
          </div>

          <Card>
            <CardHeader title="Biểu mẫu khuyến mãi" subtitle={promoForm.id ? `Đang sửa: ${promoForm.code}` : 'Tạo chương trình mới'} icon={BadgePercent} />
            <CardBody className="space-y-4">
              <Field label="Mã chương trình" required>
                <Input value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })} placeholder="PR04" />
              </Field>
              <Field label="Tên chương trình" required>
                <Input value={promoForm.name} onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })} placeholder="Tuần lễ vàng" />
              </Field>
              <Field label="Phạm vi">
                <Input value={promoForm.scope} onChange={(e) => setPromoForm({ ...promoForm, scope: e.target.value })} placeholder="Toàn bộ / Đồ uống..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Giảm">
                  <Input type="number" value={promoForm.discount} onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })} />
                </Field>
                <Field label="Loại">
                  <Select value={promoForm.type} onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value })}>
                    <option value="percent">Phần trăm</option>
                    <option value="amount">Số tiền</option>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Từ ngày">
                  <Input type="date" value={promoForm.fromDate} onChange={(e) => setPromoForm({ ...promoForm, fromDate: e.target.value })} />
                </Field>
                <Field label="Đến ngày">
                  <Input type="date" value={promoForm.toDate} onChange={(e) => setPromoForm({ ...promoForm, toDate: e.target.value })} />
                </Field>
              </div>
              <Field label="Trạng thái">
                <Select value={promoForm.status} onChange={(e) => setPromoForm({ ...promoForm, status: e.target.value })}>
                  <option value="Đang chạy">Đang chạy</option>
                  <option value="Lên lịch">Lên lịch</option>
                  <option value="Kết thúc">Kết thúc</option>
                </Select>
              </Field>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Button icon={Save} onClick={savePromo}>{promoForm.id ? 'Lưu thay đổi' : 'Tạo chương trình'}</Button>
                {promoForm.id && <Button variant="danger" icon={Trash2} onClick={() => removePromo(promoForm)}>Xóa</Button>}
                {promoForm.id && <Button variant="ghost" onClick={() => setPromoForm(emptyPromo)}>Mới</Button>}
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((v) => (
              <Card key={v.id || v.code} className="cursor-pointer" onClick={() => editVoucher(v)}>
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
                    <span className="font-semibold text-slate-700">{formatCurrency(v.minSpend ?? v.min)}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
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
                    <span className="font-semibold">Tối thiểu {formatCurrency(checked.voucher.minSpend ?? checked.voucher.min)}</span>
                  </div>
                )}
                {checked && !checked.ok && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    Mã không hợp lệ hoặc đã hết hạn.
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Biểu mẫu voucher" subtitle={voucherForm.id ? `Đang sửa: ${voucherForm.code}` : 'Tạo voucher mới'} icon={Ticket} />
              <CardBody className="space-y-4">
                <Field label="Mã voucher" required>
                  <Input value={voucherForm.code} onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value })} placeholder="WELCOME10" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Loại">
                    <Select value={voucherForm.type} onChange={(e) => setVoucherForm({ ...voucherForm, type: e.target.value })}>
                      <option value="percent">Phần trăm</option>
                      <option value="amount">Số tiền</option>
                    </Select>
                  </Field>
                  <Field label="Giá trị">
                    <Input type="number" value={voucherForm.value} onChange={(e) => setVoucherForm({ ...voucherForm, value: e.target.value })} />
                  </Field>
                </div>
                <Field label="Đơn tối thiểu">
                  <Input type="number" value={voucherForm.minSpend} onChange={(e) => setVoucherForm({ ...voucherForm, minSpend: e.target.value })} />
                </Field>
                <Field label="Nhãn">
                  <Input value={voucherForm.label} onChange={(e) => setVoucherForm({ ...voucherForm, label: e.target.value })} placeholder="Giảm 10% đơn từ 100k" />
                </Field>
                <Divider />
                <div className="flex flex-wrap gap-2">
                  <Button icon={Save} onClick={saveVoucher}>{voucherForm.id ? 'Lưu thay đổi' : 'Tạo voucher'}</Button>
                  {voucherForm.id && <Button variant="danger" icon={Trash2} onClick={() => removeVoucher(voucherForm)}>Xóa</Button>}
                  {voucherForm.id && <Button variant="ghost" onClick={() => setVoucherForm(emptyVoucher)}>Mới</Button>}
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
