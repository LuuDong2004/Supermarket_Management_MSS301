import { useMemo, useState } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Badge, Field, Select, Input } from '../../components/ui/primitives.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatNumber } from '../../lib/format.js'
import * as db from '../../mock/db.js'
import { ClipboardList, Send, ListChecks, AlertTriangle, Equal } from 'lucide-react'

const categories = [...new Set(db.products.map((p) => p.category))]

export default function StockCount() {
  const toast = useToast()
  const [category, setCategory] = useState('all')
  const [counted, setCounted] = useState(() =>
    Object.fromEntries(db.products.map((p) => [p.id, p.stock])),
  )

  const rows = useMemo(
    () => db.products.filter((p) => category === 'all' || p.category === category),
    [category],
  )

  const setCount = (id, val) => setCounted((c) => ({ ...c, [id]: val }))
  const diffOf = (p) => Number(counted[p.id] ?? p.stock) - p.stock

  const discrepancies = db.products.filter((p) => diffOf(p) !== 0)
  const totalDiff = db.products.reduce((s, p) => s + diffOf(p), 0)

  const submit = () => {
    if (discrepancies.length === 0) {
      toast.info('Không có chênh lệch nào. Kết quả kiểm kê khớp với hệ thống.')
      return
    }
    toast.success(`Đã gửi kết quả kiểm kê: ${discrepancies.length} mặt hàng chênh lệch, tổng ${totalDiff > 0 ? '+' : ''}${totalDiff} đơn vị.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.3"
        title="Kiểm kê"
        subtitle="Nhập số lượng thực đếm để đối chiếu với tồn kho hệ thống."
        actions={<Button icon={Send} onClick={submit}>Gửi kết quả kiểm kê</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mặt hàng kiểm" value={formatNumber(rows.length)} icon={ListChecks} tone="brand" hint="trong danh sách" />
        <StatCard label="Có chênh lệch" value={formatNumber(discrepancies.length)} icon={AlertTriangle} tone="amber" hint="cần điều chỉnh" />
        <StatCard label="Tổng chênh lệch" value={`${totalDiff > 0 ? '+' : ''}${formatNumber(totalDiff)}`} icon={Equal} tone={totalDiff === 0 ? 'green' : 'red'} hint="đơn vị" />
        <StatCard label="Tổng SKU" value={formatNumber(db.products.length)} icon={ClipboardList} tone="blue" hint="toàn kho" />
      </div>

      <div className="mt-6">
        <FilterBar>
          <Field label="Ngành hàng">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Tất cả</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </FilterBar>

        <Card>
          <CardHeader title="Phiếu kiểm kê" subtitle="Nhập thực đếm cho từng mặt hàng" icon={ClipboardList} />
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3 text-center">Tồn hệ thống</th>
                  <th className="px-4 py-3 text-center">Thực đếm</th>
                  <th className="px-4 py-3 text-right">Chênh lệch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((p) => {
                  const diff = diffOf(p)
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700">{p.name}</p>
                        <p className="font-mono text-xs text-slate-400">{p.barcode}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{p.stock} {p.unit}</td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={0}
                          className="mx-auto w-24 text-center"
                          value={counted[p.id] ?? p.stock}
                          onChange={(e) => setCount(p.id, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {diff === 0 ? (
                          <Badge tone="slate">0</Badge>
                        ) : (
                          <Badge tone={diff > 0 ? 'green' : 'red'}>{diff > 0 ? `+${diff}` : diff}</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
