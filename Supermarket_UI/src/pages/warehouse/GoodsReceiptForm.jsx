import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Field, Input, Textarea } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { goodsReceiptService } from '../../services/index.js'
import { ArrowLeft, Save } from 'lucide-react'

const today = () => new Date().toISOString().slice(0, 10)

// Full-page create goods receipt (replaces the old modal).
export default function GoodsReceiptForm() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: `GRN-${Date.now().toString().slice(-4)}`,
    poCode: '', supplier: '', receiveDate: today(), receivedBy: '', items: '', total: '', note: '',
  })

  const create = async () => {
    if (!form.code.trim() || !form.supplier.trim()) { toast.error('Nhập mã phiếu và nhà cung cấp.'); return }
    if (!(await confirm({ title: 'Tạo phiếu nhập kho?', message: `Tạo phiếu nhập ${form.code} từ nhà cung cấp ${form.supplier}.`, confirmLabel: 'Tạo' }))) return
    const body = {
      code: form.code, poCode: form.poCode || null, supplier: form.supplier,
      receiveDate: form.receiveDate || today(), receivedBy: form.receivedBy || null,
      items: Number(form.items) || 0, total: Number(form.total) || 0, note: form.note || null,
    }
    setSaving(true)
    try {
      await goodsReceiptService.create(body)
      toast.success(`Đã tạo phiếu nhập ${form.code}.`)
      navigate('/app/warehouse/goods-receipts')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.6"
        title="Lập phiếu nhập kho"
        subtitle="Ghi nhận lô hàng nhận từ nhà cung cấp"
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/warehouse/goods-receipts')}>Quay lại danh sách</Button>}
      />

      <Card className="max-w-4xl">
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mã phiếu" required><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field label="Mã PO"><Input value={form.poCode} onChange={(e) => setForm({ ...form, poCode: e.target.value })} placeholder="PO-..." /></Field>
            <Field label="Nhà cung cấp" required className="sm:col-span-2"><Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></Field>
            <Field label="Ngày nhận"><Input type="date" value={form.receiveDate} onChange={(e) => setForm({ ...form, receiveDate: e.target.value })} /></Field>
            <Field label="Người nhận"><Input value={form.receivedBy} onChange={(e) => setForm({ ...form, receivedBy: e.target.value })} /></Field>
            <Field label="Số mặt hàng"><Input type="number" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} /></Field>
            <Field label="Tổng giá trị"><Input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} /></Field>
            <Field label="Ghi chú" className="sm:col-span-2"><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
          </div>
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="secondary" onClick={() => navigate('/app/warehouse/goods-receipts')}>Hủy</Button>
            <Button icon={Save} onClick={create} disabled={saving}>{saving ? 'Đang lưu...' : 'Tạo phiếu'}</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
