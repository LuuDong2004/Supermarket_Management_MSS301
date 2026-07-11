import { useMemo, useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatDate } from '../../lib/format.js'
import { warehouseTxnService, withFallback, toList, mockWarehouseTxns } from '../../services/index.js'
import { Check, X } from 'lucide-react'

const TYPE_TONE = { 'Nhập kho': 'green', 'Xuất kho': 'blue', 'Điều chỉnh': 'amber' }
const MANAGER = ['ROLE_WAREHOUSE_MANAGER', 'ROLE_ADMIN']

export default function Transactions() {
  const toast = useToast()
  const confirm = useConfirm()
  const { user } = useAuth()
  const isManager = MANAGER.includes(user?.role)
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')
  const [tab, setTab] = useState('Chờ duyệt')

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => warehouseTxnService.list(), mockWarehouseTxns)
    setTxns(toList(r.data))
    setSource(r.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const counts = useMemo(() => ({
    pending: txns.filter((t) => t.status === 'Chờ duyệt').length,
    approved: txns.filter((t) => t.status === 'Đã duyệt').length,
    all: txns.length,
  }), [txns])

  const rows = useMemo(() => {
    if (tab === 'all') return txns
    return txns.filter((t) => t.status === tab)
  }, [txns, tab])

  const decide = async (row, approved) => {
    const ok = approved
      ? await confirm({ title: 'Duyệt giao dịch?', message: `Duyệt giao dịch ${row.code} — tồn kho sẽ được cập nhật ngay.`, confirmLabel: 'Duyệt' })
      : await confirm({ title: 'Từ chối giao dịch?', message: `Từ chối giao dịch ${row.code}. Giao dịch sẽ không được ghi nhận vào tồn kho.`, confirmLabel: 'Từ chối', danger: true })
    if (!ok) return
    try {
      // Real approve/reject: approval posts the movement to inventory on-hand.
      if (approved) await warehouseTxnService.approve(row.id)
      else await warehouseTxnService.reject(row.id)
      toast[approved ? 'success' : 'info'](`${approved ? 'Đã duyệt' : 'Đã từ chối'} giao dịch ${row.code}.`)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.2"
        title="Duyệt giao dịch kho"
        subtitle="Xem xét và phê duyệt các giao dịch nhập, xuất và điều chỉnh tồn kho."
      />

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'Chờ duyệt', label: 'Chờ duyệt', count: counts.pending },
          { value: 'Đã duyệt', label: 'Đã duyệt', count: counts.approved },
          { value: 'all', label: 'Tất cả', count: counts.all },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <DataTable
          rows={rows}
          empty={{ title: 'Không có giao dịch', subtitle: 'Chưa có giao dịch nào ở trạng thái này.' }}
          columns={[
            { key: 'type', header: 'Loại', render: (r) => <Badge tone={TYPE_TONE[r.type] || 'slate'}>{r.type}</Badge> },
            { key: 'ref', header: 'Chứng từ', render: (r) => <span className="font-mono text-xs">{r.ref}</span> },
            { key: 'product', header: 'Sản phẩm' },
            {
              key: 'qty',
              header: 'Số lượng',
              align: 'right',
              render: (r) => (
                <span className={r.qty < 0 ? 'font-semibold text-rose-600' : 'font-semibold text-emerald-600'}>
                  {r.qty > 0 ? `+${r.qty}` : r.qty}
                </span>
              ),
            },
            { key: 'txnDate', header: 'Ngày', render: (r) => formatDate(r.txnDate) },
            { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
            {
              key: 'actions',
              header: 'Thao tác',
              align: 'right',
              render: (r) =>
                r.status === 'Chờ duyệt' && isManager ? (
                  <div className="flex justify-end gap-2">
                    <Button variant="success" size="sm" icon={Check} onClick={() => decide(r, true)}>Duyệt</Button>
                    <Button variant="danger" size="sm" icon={X} onClick={() => decide(r, false)}>Từ chối</Button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                ),
            },
          ]}
        />
      )}
    </div>
  )
}
