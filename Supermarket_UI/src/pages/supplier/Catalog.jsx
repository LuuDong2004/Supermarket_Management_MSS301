import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatCurrency, formatNumber } from '../../lib/format.js'
import { priceListService, withFallback, toList } from '../../services/index.js'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

export default function Catalog() {
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [search, setSearch] = useState('')

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

  const openEdit = (r) => navigate(`/app/supplier/catalog/${r.id ?? r.code}/edit`)

  const remove = async (r) => {
    if (source !== 'backend' || !r.id) return toast.error('Không có kết nối backend.')
    if (!(await confirm({
      title: 'Xóa mặt hàng?',
      message: `Mặt hàng "${r.productName}" sẽ bị xóa khỏi danh mục cung cấp.`,
      confirmLabel: 'Xóa',
      danger: true,
    }))) return
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
            <Button icon={Plus} onClick={() => navigate('/app/supplier/catalog/new')}>Thêm mặt hàng</Button>
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
              ]}
              actions={(r) => (
                <>
                  <Button size="sm" variant="secondary" icon={Pencil} onClick={() => openEdit(r)}>Sửa</Button>
                  <Button size="sm" variant="danger" icon={Trash2} onClick={() => remove(r)}>Xóa</Button>
                </>
              )}
            />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
