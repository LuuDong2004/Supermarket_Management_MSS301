import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, Select, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import { productService, categoryService, withFallback, toList } from '../../services/index.js'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

const emptyProduct = { id: null, code: '', barcode: '', name: '', category: '', price: '', cost: '', stock: '', unit: 'cái', expiry: '' }
const emptyCategory = { id: null, name: '', description: '', active: true }

export default function Products() {
  const toast = useToast()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [source, setSource] = useState('backend')
  const [search, setSearch] = useState('')

  const [pForm, setPForm] = useState(null) // product form object or null
  const [cForm, setCForm] = useState(null) // category form object or null

  const load = async () => {
    const p = await withFallback(() => productService.list())
    const c = await withFallback(() => categoryService.list())
    setProducts(toList(p.data))
    setCategories(toList(c.data))
    setSource(p.source)
  }
  useEffect(() => { load() }, [])

  const activeCats = useMemo(() => categories.filter((c) => c.active), [categories])
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q) || (p.barcode || '').toLowerCase().includes(q))
  }, [products, search])

  // ---- Products ----
  const openNewProduct = () => setPForm({ ...emptyProduct, category: activeCats[0]?.name || '' })
  const openEditProduct = (p) => setPForm({
    id: p.id, code: p.code, barcode: p.barcode || '', name: p.name, category: p.category,
    price: p.price, cost: p.cost, stock: p.stock, unit: p.unit || '', expiry: (p.expiry || '').slice(0, 10),
  })
  const saveProduct = async () => {
    if (!pForm.name.trim() || !pForm.code.trim()) { toast.error('Nhập mã và tên sản phẩm.'); return }
    if (source !== 'backend') { toast.error('Không có kết nối backend.'); return }
    const body = {
      code: pForm.code, barcode: pForm.barcode || null, name: pForm.name, category: pForm.category,
      price: Number(pForm.price) || 0, cost: Number(pForm.cost) || 0, stock: Number(pForm.stock) || 0,
      unit: pForm.unit || null, expiry: pForm.expiry || null,
    }
    try {
      if (pForm.id) await productService.update(pForm.id, body)
      else await productService.create(body)
      toast.success(pForm.id ? `Đã cập nhật ${pForm.name}.` : `Đã thêm ${pForm.name}.`)
      setPForm(null)
      await load()
    } catch (e) { toast.error(e.message) }
  }
  const removeProduct = async (p) => {
    if (source !== 'backend' || !p.id) { toast.error('Không có kết nối backend.'); return }
    try { await productService.remove(p.id); toast.success(`Đã xóa ${p.name}.`); await load() }
    catch (e) { toast.error(e.message) }
  }

  // ---- Categories ----
  const openNewCategory = () => setCForm({ ...emptyCategory })
  const openEditCategory = (c) => setCForm({ id: c.id, name: c.name, description: c.description || '', active: c.active })
  const saveCategory = async () => {
    if (!cForm.name.trim()) { toast.error('Nhập tên danh mục.'); return }
    if (source !== 'backend') { toast.error('Không có kết nối backend.'); return }
    const body = { name: cForm.name, description: cForm.description || null, active: !!cForm.active }
    try {
      if (cForm.id) await categoryService.update(cForm.id, body)
      else await categoryService.create(body)
      toast.success(cForm.id ? `Đã cập nhật danh mục ${cForm.name}.` : `Đã thêm danh mục ${cForm.name}.`)
      setCForm(null)
      await load()
    } catch (e) { toast.error(e.message) }
  }
  const removeCategory = async (c) => {
    if (source !== 'backend' || !c.id) { toast.error('Không có kết nối backend.'); return }
    try { await categoryService.remove(c.id); toast.success(`Đã xóa danh mục ${c.name}.`); await load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.5"
        title="Quản lý sản phẩm & danh mục"
        subtitle="Tạo, cập nhật sản phẩm và duy trì danh mục hàng hóa."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            {tab === 'products'
              ? <Button icon={Plus} onClick={openNewProduct}>Thêm sản phẩm</Button>
              : <Button icon={Plus} onClick={openNewCategory}>Thêm danh mục</Button>}
          </div>
        }
      />

      <Tabs
        className="mb-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'products', label: 'Sản phẩm', count: products.length },
          { value: 'categories', label: 'Danh mục', count: categories.length },
        ]}
      />

      {tab === 'products' ? (
        <>
          <FilterBar>
            <Field label="Tìm kiếm" className="grow">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Tên / mã / barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </Field>
          </FilterBar>
          <DataTable
            rows={rows}
            rowKey="code"
            onRowClick={openEditProduct}
            empty={{ title: 'Chưa có sản phẩm' }}
            columns={[
              { key: 'code', header: 'Mã', render: (p) => <span className="font-mono text-xs">{p.code}</span> },
              { key: 'name', header: 'Tên', render: (p) => <span className="font-medium text-slate-700">{p.name}</span> },
              { key: 'category', header: 'Danh mục', render: (p) => <Badge tone="brand">{p.category}</Badge> },
              { key: 'price', header: 'Giá bán', align: 'right', render: (p) => formatCurrency(p.price) },
              { key: 'stock', header: 'Tồn', align: 'right', render: (p) => formatNumber(p.stock) },
              { key: 'actions', header: '', align: 'right', render: (p) => (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" icon={Pencil} onClick={(e) => { e.stopPropagation(); openEditProduct(p) }}>Sửa</Button>
                  <Button size="sm" variant="danger" icon={Trash2} onClick={(e) => { e.stopPropagation(); removeProduct(p) }}>Xóa</Button>
                </div>
              ) },
            ]}
          />
        </>
      ) : (
        <DataTable
          rows={categories}
          rowKey="name"
          onRowClick={openEditCategory}
          empty={{ title: 'Chưa có danh mục' }}
          columns={[
            { key: 'name', header: 'Danh mục', render: (c) => <span className="font-medium text-slate-700">{c.name}</span> },
            { key: 'description', header: 'Mô tả', render: (c) => <span className="text-slate-500">{c.description || '—'}</span> },
            { key: 'active', header: 'Trạng thái', render: (c) => <Badge tone={c.active ? 'green' : 'slate'}>{c.active ? 'Đang dùng' : 'Ẩn'}</Badge> },
            { key: 'actions', header: '', align: 'right', render: (c) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" icon={Pencil} onClick={(e) => { e.stopPropagation(); openEditCategory(c) }}>Sửa</Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={(e) => { e.stopPropagation(); removeCategory(c) }}>Xóa</Button>
              </div>
            ) },
          ]}
        />
      )}

      {/* Product modal */}
      <Modal
        open={!!pForm}
        onClose={() => setPForm(null)}
        title={pForm?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        subtitle={pForm?.id ? pForm.code : 'Tạo sản phẩm mới'}
        size="lg"
        footer={<><Button variant="secondary" onClick={() => setPForm(null)}>Hủy</Button><Button onClick={saveProduct}>{pForm?.id ? 'Lưu' : 'Thêm'}</Button></>}
      >
        {pForm && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mã sản phẩm" required><Input value={pForm.code} onChange={(e) => setPForm({ ...pForm, code: e.target.value })} disabled={!!pForm.id} /></Field>
            <Field label="Barcode"><Input value={pForm.barcode} onChange={(e) => setPForm({ ...pForm, barcode: e.target.value })} /></Field>
            <Field label="Tên sản phẩm" required className="sm:col-span-2"><Input value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} /></Field>
            <Field label="Danh mục">
              <Select value={pForm.category} onChange={(e) => setPForm({ ...pForm, category: e.target.value })}>
                {activeCats.length === 0 && <option value="">—</option>}
                {activeCats.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Đơn vị"><Input value={pForm.unit} onChange={(e) => setPForm({ ...pForm, unit: e.target.value })} placeholder="cái, chai, thùng..." /></Field>
            <Field label="Giá bán" required><Input type="number" value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: e.target.value })} /></Field>
            <Field label="Giá vốn" required><Input type="number" value={pForm.cost} onChange={(e) => setPForm({ ...pForm, cost: e.target.value })} /></Field>
            <Field label="Tồn kho" required><Input type="number" value={pForm.stock} onChange={(e) => setPForm({ ...pForm, stock: e.target.value })} /></Field>
            <Field label="Hạn dùng"><Input type="date" value={pForm.expiry} onChange={(e) => setPForm({ ...pForm, expiry: e.target.value })} /></Field>
          </div>
        )}
      </Modal>

      {/* Category modal */}
      <Modal
        open={!!cForm}
        onClose={() => setCForm(null)}
        title={cForm?.id ? 'Sửa danh mục' : 'Thêm danh mục'}
        footer={<><Button variant="secondary" onClick={() => setCForm(null)}>Hủy</Button><Button onClick={saveCategory}>{cForm?.id ? 'Lưu' : 'Thêm'}</Button></>}
      >
        {cForm && (
          <div className="space-y-4">
            <Field label="Tên danh mục" required><Input value={cForm.name} onChange={(e) => setCForm({ ...cForm, name: e.target.value })} /></Field>
            <Field label="Mô tả"><Textarea rows={2} value={cForm.description} onChange={(e) => setCForm({ ...cForm, description: e.target.value })} /></Field>
            <Field label="Trạng thái">
              <Select value={cForm.active ? '1' : '0'} onChange={(e) => setCForm({ ...cForm, active: e.target.value === '1' })}>
                <option value="1">Đang dùng</option>
                <option value="0">Ẩn</option>
              </Select>
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
