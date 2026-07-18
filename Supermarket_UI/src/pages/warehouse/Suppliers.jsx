import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, StatusBadge, Field, Input, Select, Spinner, Divider } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { supplierService, withFallback, toList } from '../../services/index.js'
import { Search, Truck, Save, Trash2, RotateCcw, Info } from 'lucide-react'

const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

const emptyForm = { id: null, code: '', name: '', contact: '', phone: '', status: 'ACTIVE', terms: '', rating: '' }

export default function Suppliers() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [applied, setApplied] = useState({ search: '', status: '' })

  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => supplierService.list({ page: 0, size: 100 }))
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = applied.search.trim().toLowerCase()
    return rows.filter((s) => {
      if (q && !(s.name || '').toLowerCase().includes(q) && !(s.code || '').toLowerCase().includes(q) && !(s.contact || '').toLowerCase().includes(q)) return false
      if (applied.status && s.status !== applied.status) return false
      return true
    })
  }, [rows, applied])

  const apply = () => setApplied({ search, status })
  const reset = () => { setSearch(''); setStatus(''); setApplied({ search: '', status: '' }) }

  const edit = (s) => setForm({
    id: s.id, code: s.code || '', name: s.name || '', contact: s.contact || '',
    phone: s.phone || '', status: s.status || 'ACTIVE', terms: s.terms || '',
    rating: s.rating ?? '',
  })
  const create = () => setForm(emptyForm)

  const body = () => ({
    code: form.code,
    name: form.name,
    contact: form.contact,
    phone: form.phone,
    status: form.status,
    terms: form.terms,
    rating: form.rating === '' ? null : Number(form.rating),
  })

  const save = async () => {
    try {
      if (form.id) {
        await supplierService.update(form.id, body())
        toast.success(`Đã cập nhật nhà cung cấp ${form.name}.`)
      } else {
        await supplierService.create(body())
        toast.success(`Đã thêm nhà cung cấp ${form.name}.`)
      }
      setForm(emptyForm)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const remove = async () => {
    if (!form.id) return
    try {
      await supplierService.remove(form.id)
      toast.success(`Đã xóa nhà cung cấp ${form.name}.`)
      setForm(emptyForm)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.6"
        title="Nhà cung cấp"
        subtitle="Quản lý danh mục nhà cung cấp phục vụ đơn mua hàng."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2">
          <FilterBar>
            <Field label="Tìm kiếm" className="grow">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Tên / mã / người liên hệ..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </Field>
            <Field label="Trạng thái">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Tất cả</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <div className="flex gap-2">
              <Button onClick={apply}>Áp dụng</Button>
              <Button variant="secondary" icon={RotateCcw} onClick={reset}>Đặt lại</Button>
            </div>
          </FilterBar>

          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner className="h-7 w-7" />
            </div>
          ) : (
            <DataTable
              rows={filtered}
              onRowClick={edit}
              empty={{ title: 'Chưa có nhà cung cấp', subtitle: 'Thêm nhà cung cấp mới ở biểu mẫu bên phải.' }}
              columns={[
                { key: 'code', header: 'Mã', render: (s) => <span className="font-mono text-xs">{s.code}</span> },
                { key: 'name', header: 'Nhà cung cấp', render: (s) => <span className="font-medium text-slate-700">{s.name}</span> },
                { key: 'contact', header: 'Liên hệ' },
                { key: 'phone', header: 'Điện thoại' },
                { key: 'rating', header: 'Đánh giá', align: 'center', render: (s) => s.rating != null ? <Badge tone="brand">{s.rating}</Badge> : '—' },
                { key: 'status', header: 'Trạng thái', render: (s) => <StatusBadge status={s.status} /> },
              ]}
            />
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Biểu mẫu nhà cung cấp" subtitle={form.id ? `Đang sửa: ${form.code}` : 'Thêm nhà cung cấp mới'} icon={Truck} />
            <CardBody className="space-y-4">
              <Field label="Mã nhà cung cấp" required>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="NCC001" disabled={!!form.id} />
              </Field>
              <Field label="Tên nhà cung cấp" required>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Công ty TNHH..." />
              </Field>
              <Field label="Người liên hệ">
                <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Nguyễn Văn..." />
              </Field>
              <Field label="Điện thoại">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09..." />
              </Field>
              <Field label="Điều khoản">
                <Input value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} placeholder="Thanh toán 30 ngày..." />
              </Field>
              <Field label="Đánh giá (0–5)">
                <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
              </Field>
              <Field label="Trạng thái">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Divider />
              <div className="flex flex-wrap gap-2">
                <Button icon={Save} onClick={save}>{form.id ? 'Lưu thay đổi' : 'Thêm mới'}</Button>
                {form.id && <Button variant="danger" icon={Trash2} onClick={remove}>Xóa</Button>}
                {form.id && <Button variant="ghost" onClick={create}>Mới</Button>}
              </div>
            </CardBody>
          </Card>

          <Card className="border-brand-200 bg-brand-50/60">
            <CardBody className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Info size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-800">Lưu ý</p>
                <p className="mt-0.5 text-sm text-brand-700">Nhà cung cấp ở đây được chọn khi lập Đơn mua hàng (3.6.1).</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
