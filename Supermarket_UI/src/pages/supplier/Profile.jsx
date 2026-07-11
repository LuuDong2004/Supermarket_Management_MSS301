import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Input, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { supplierService, withFallback } from '../../services/index.js'
import { Building2, Save, Star } from 'lucide-react'

export default function SupplierProfile() {
  const toast = useToast()
  const [supplier, setSupplier] = useState(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [form, setForm] = useState({ contact: '', phone: '', email: '', address: '', terms: '' })

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => supplierService.mine())
    const s = r.data && !Array.isArray(r.data) ? r.data : null
    setSupplier(s)
    setSource(r.source)
    if (s) setForm({ contact: s.contact || '', phone: s.phone || '', email: s.email || '', address: s.address || '', terms: s.terms || '' })
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (source !== 'backend') return toast.error('Không có kết nối backend.')
    try {
      await supplierService.updateMine(form)
      toast.success('Đã cập nhật hồ sơ nhà cung cấp.')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  if (loading) {
    return <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-20"><Spinner className="h-7 w-7" /></div>
  }

  if (!supplier) {
    return (
      <div>
        <PageHeader breadcrumb="Nhà cung cấp · 3.11.3" title="Hồ sơ nhà cung cấp" />
        <Card><CardBody><p className="text-sm text-slate-500">Tài khoản chưa được liên kết với hồ sơ nhà cung cấp nào. Vui lòng liên hệ quản trị viên.</p></CardBody></Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhà cung cấp · 3.11.3"
        title="Hồ sơ nhà cung cấp"
        subtitle="Xem và cập nhật thông tin liên hệ của bạn."
        actions={
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Thông tin công ty" icon={Building2} />
          <CardBody className="space-y-3 text-sm">
            <Info label="Tên công ty" value={supplier.name} />
            <Info label="Mã NCC" value={supplier.code} mono />
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Đánh giá</span>
              <span className="flex items-center gap-1 font-semibold text-amber-600"><Star size={14} className="fill-amber-400 text-amber-400" /> {supplier.rating ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Trạng thái</span>
              <Badge tone={(supplier.status || '').toLowerCase().includes('active') ? 'green' : 'amber'}>{supplier.status}</Badge>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Thông tin liên hệ" icon={Building2} subtitle="Cập nhật để siêu thị liên hệ chính xác" />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Người liên hệ"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></Field>
              <Field label="Điện thoại"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
              <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Điều khoản thanh toán"><Input value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} placeholder="NET 30..." /></Field>
            </div>
            <Field label="Địa chỉ"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <div className="flex justify-end">
              <Button icon={Save} onClick={save}>Lưu thay đổi</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function Info({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium text-slate-700 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}
