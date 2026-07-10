import { useState, useEffect, useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Badge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { permissionService, withFallback, toList } from '../../services/index.js'
import { Check, X, KeyRound, Crown, ShieldCheck, ShoppingCart } from 'lucide-react'

// Matrix columns → backend boolean keys.
const ROLE_COLS = [
  { key: 'ceo', label: 'CEO' },
  { key: 'admin', label: 'Admin' },
  { key: 'warehouseManager', label: 'QL Kho' },
  { key: 'warehouseStaff', label: 'NV Kho' },
  { key: 'cashier', label: 'Thu ngân' },
]

const catTone = (c) => ({ 'Bán hàng': 'brand', Kho: 'amber', 'Nhân sự': 'violet', 'Điều hành': 'green', 'Hệ thống': 'blue' }[c] || 'slate')

export default function Permissions() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [source, setSource] = useState('backend')
  const [saving, setSaving] = useState(null) // `${id}:${key}` while a toggle is in flight

  const load = async () => {
    const res = await withFallback(() => permissionService.list())
    setRows(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const counts = useMemo(() => ({
    total: rows.length,
    ceo: rows.filter((r) => r.ceo).length,
    admin: rows.filter((r) => r.admin).length,
    cashier: rows.filter((r) => r.cashier).length,
  }), [rows])

  const toggle = async (row, key) => {
    if (source !== 'backend' || !row.id) { toast.error('Không có kết nối backend để cập nhật phân quyền.'); return }
    const next = { ...row, [key]: !row[key] }
    setSaving(`${row.id}:${key}`)
    // optimistic update
    setRows((rs) => rs.map((r) => (r.id === row.id ? next : r)))
    try {
      await permissionService.update(row.id, {
        ceo: next.ceo, admin: next.admin, warehouseManager: next.warehouseManager,
        warehouseStaff: next.warehouseStaff, cashier: next.cashier,
      })
    } catch {
      toast.error('Không thể lưu phân quyền.')
      setRows((rs) => rs.map((r) => (r.id === row.id ? row : r))) // rollback
    } finally {
      setSaving(null)
    }
  }

  const permCol = (col) => ({
    key: col.key,
    header: col.label,
    align: 'center',
    render: (row) => {
      const on = !!row[col.key]
      const busy = saving === `${row.id}:${col.key}`
      return (
        <button
          onClick={(e) => { e.stopPropagation(); toggle(row, col.key) }}
          disabled={busy}
          title={on ? 'Đang cho phép — nhấn để thu hồi' : 'Đang chặn — nhấn để cấp quyền'}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
            on ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
               : 'border-slate-200 bg-slate-50 text-slate-300 hover:bg-slate-100'
          } ${busy ? 'opacity-50' : ''}`}
        >
          {on ? <Check size={15} /> : <X size={15} />}
        </button>
      )
    },
  })

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.4"
        title="Cấu hình phân quyền"
        subtitle="Ma trận vai trò × chức năng. Nhấn ô để cấp hoặc thu hồi quyền truy cập."
        actions={
          <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
            {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng chức năng" value={counts.total} icon={KeyRound} tone="brand" />
        <StatCard label="Quyền của CEO" value={counts.ceo} icon={Crown} tone="green" />
        <StatCard label="Quyền của Admin" value={counts.admin} icon={ShieldCheck} tone="blue" />
        <StatCard label="Quyền Thu ngân" value={counts.cashier} icon={ShoppingCart} tone="amber" />
      </div>

      <Card className="mt-6">
        <CardBody className="p-0">
          <DataTable
            rows={rows}
            rowKey="featureCode"
            empty={{ title: 'Chưa có dữ liệu phân quyền' }}
            columns={[
              { key: 'feature', header: 'Chức năng', render: (r) => (
                <div>
                  <p className="font-medium text-slate-700">{r.featureName}</p>
                  <span className="font-mono text-xs text-slate-400">{r.featureCode}</span>
                </div>
              ) },
              { key: 'category', header: 'Nhóm', render: (r) => <Badge tone={catTone(r.category)}>{r.category}</Badge> },
              ...ROLE_COLS.map(permCol),
            ]}
          />
        </CardBody>
      </Card>
    </div>
  )
}
