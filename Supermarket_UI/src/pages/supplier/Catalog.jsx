import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, Select, Textarea, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import { priceListService, withFallback, toList } from '../../services/index.js'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

const emptyForm = { id: null, productName: '', unit: 'thùng', price: '', moq: '', status: 'Đang bán', note: '' }

export default function Catalog() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => priceListService.mine())
    setRows(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => (r.productName || '').toLowerCase().includes(q) || (r.code || '').toLowerCase().includes(q))
  }, [rows, search])

  const openNew = () => setForm({ ...emptyForm })
  const openEdit = (r) => setForm({ id: r.id, productName: r.productName, unit: r.unit || '', price: r.price ?? '', moq: r.moq ?? '', status: r.status || 'Đang bán', note: r.note || '' })

  const save = async () => {
    if (!form.productName.trim()) return toast.error('Nhập tên sản phẩm.')
    if (source !== 'backend') return toast.error('Không có kết nối backend.')
    const body = {
      productName: form.productName,
      unit: form.unit || null,
      price: form.price === '' ? 0 : Number(form.price),
      moq: form.moq === '' ? 0 : Number(form.moq),
      status: form.status,
      note: form.note || null,
    }
    try {
      if (form.id) await priceListService.update(form.id, body)
      else await priceListService.create(body)
      toast.success(form.id ? `Đã cập nhật ${form.productName}.` : `Đã thêm ${form.productName}.`)
      setForm(null)
      await load()
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (r) => {
    if (source !== 'backend' || !r.id) return toast.error('Không có kết nối backend.')
    try { await priceListService.remove(r.id); toast.success(`Đã xóa ${r.productName}.`); await load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhà cung cấp · 3.11.2"
        title="Bảng giá & danh mục cung cấp"
        subtitle="Quản lý danh mục sản phẩm và báo giá bạn cung cấp cho siêu thị."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Button icon={Plus} onClick={openNew}>Thêm mặt hàng</Button>
          </div>
        }
      />

      <FilterBar>
        <Field label="Tìm kiếm" className="grow">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Tên sản phẩm / mã..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </Field>
      </FilterBar>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Spinner className="h-7 w-7" /></div>
          ) : (
            <DataTable
              rows={filtered}
              rowKey="code"
              onRowClick={openEdit}
              empty={{ title: 'Chưa có mặt hàng', subtitle: 'Thêm sản phẩm bạn cung cấp và báo giá.' }}
              columns={[
                { key: 'code', header: 'Mã', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
                { key: 'productName', header: 'Sản phẩm', render: (r) => <span className="font-medium text-slate-700">{r.productName}</span> },
                { key: 'unit', header: 'Đơn vị' },
                { key: 'price', header: 'Giá', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.price)}</span> },
                { key: 'moq', header: 'SL tối thiểu', align: 'right', render: (r) => formatNumber(r.moq) },
                { key: 'status', header: 'Trạng thái', render: (r) => <Badge tone={r.status === 'Đang bán' ? 'green' : 'slate'}>{r.status}</Badge> },
                { key: 'actions', header: '', align: 'right', render: (r) => (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="secondary" icon={Pencil} onClick={(e) => { e.stopPropagation(); openEdit(r) }}>Sửa</Button>
                    <Button size="sm" variant="danger" icon={Trash2} onClick={(e) => { e.stopPropagation(); remove(r) }}>Xóa</Button>
                  </div>
                ) },
              ]}
            />
          )}
        </CardBody>
      </Card>

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.id ? 'Sửa mặt hàng' : 'Thêm mặt hàng'}
        subtitle={form?.id ? 'Cập nhật báo giá' : 'Thêm sản phẩm vào danh mục cung cấp'}
        footer={<><Button variant="secondary" onClick={() => setForm(null)}>Hủy</Button><Button onClick={save}>{form?.id ? 'Lưu' : 'Thêm'}</Button></>}
      >
        {form && (
          <div className="space-y-4">
            <Field label="Tên sản phẩm" required>
              <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="VD: Sữa tươi..." />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Đơn vị"><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="thùng, lốc, kg..." /></Field>
              <Field label="Trạng thái">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Đang bán">Đang bán</option>
                  <option value="Ngừng cung cấp">Ngừng cung cấp</option>
                </Select>
              </Field>
              <Field label="Giá (đ)" required><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
              <Field label="SL tối thiểu (MOQ)"><Input type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} /></Field>
            </div>
            <Field label="Ghi chú"><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
