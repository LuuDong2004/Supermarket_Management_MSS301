import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, Select, Textarea } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import { productService, categoryService, withFallback, toList } from '../../services/index.js'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

const emptyCategory = { id: null, name: '', description: '', active: true }

export default function Products() {
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [source, setSource] = useState('backend')
  const [search, setSearch] = useState('')

  const [cForm, setCForm] = useState(null) // category form object or null

  const load = async () => {
    const p = await withFallback(() => productService.list())
    const c = await withFallback(() => categoryService.list())
    setProducts(toList(p.data))
    setCategories(toList(c.data))
    setSource(p.source)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q) || (p.barcode || '').toLowerCase().includes(q))
  }, [products, search])

  // ---- Products (create/edit live on their own page: /app/warehouse/products/new, /:id/edit) ----
  const openNewProduct = () => navigate('/app/warehouse/products/new')
  const openEditProduct = (p) => {
    if (!p.id) { toast.error('Không có kết nối backend.'); return }
    navigate(`/app/warehouse/products/${p.id}/edit`)
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
            ]}
            actions={(p) => (
              <>
                <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEditProduct(p)}>Sửa</Button>
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => removeProduct(p)}>Xóa</Button>
              </>
            )}
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
          ]}
          actions={(c) => (
            <>
              <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEditCategory(c)}>Sửa</Button>
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => removeCategory(c)}>Xóa</Button>
            </>
          )}
        />
      )}

      {/* Category modal (small form — stays a popup) */}
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
