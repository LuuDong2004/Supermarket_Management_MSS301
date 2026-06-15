import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatDate } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { Check, X } from 'lucide-react'

const TYPE_TONE = { 'Nhập kho': 'green', 'Xuất kho': 'blue', 'Điều chỉnh': 'amber' }

export default function Transactions() {
  const toast = useToast()
  const [txns, setTxns] = useState(db.warehouseTxns)
  const [tab, setTab] = useState('Chờ duyệt')

  const counts = useMemo(() => ({
    pending: txns.filter((t) => t.status === 'Chờ duyệt').length,
    approved: txns.filter((t) => t.status === 'Đã duyệt').length,
    all: txns.length,
  }), [txns])

  const rows = useMemo(() => {
    if (tab === 'all') return txns
    return txns.filter((t) => t.status === tab)
  }, [txns, tab])

  const decide = (id, approved) => {
    setTxns((list) => list.map((t) => (t.id === id ? { ...t, status: approved ? 'Đã duyệt' : 'Từ chối' } : t)))
    toast[approved ? 'success' : 'info'](`${approved ? 'Đã duyệt' : 'Đã từ chối'} giao dịch ${id}.`)
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
          { key: 'date', header: 'Ngày', render: (r) => formatDate(r.date) },
          { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            header: 'Thao tác',
            align: 'right',
            render: (r) =>
              r.status === 'Chờ duyệt' ? (
                <div className="flex justify-end gap-2">
                  <Button variant="success" size="sm" icon={Check} onClick={() => decide(r.id, true)}>Duyệt</Button>
                  <Button variant="danger" size="sm" icon={X} onClick={() => decide(r.id, false)}>Từ chối</Button>
                </div>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              ),
          },
        ]}
      />
    </div>
  )
}
