import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Field, Input, Select, Divider } from '../../components/ui/primitives.jsx'
import { Tabs } from '../../components/ui/Tabs.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { cn } from '../../lib/cn.js'
import {
  Settings, Store, ReceiptText, Bell, Plug, Save,
} from 'lucide-react'

const TABS = [
  { value: 'general', label: 'Chung' },
  { value: 'tax', label: 'Thuế & Hóa đơn' },
  { value: 'notify', label: 'Thông báo' },
  { value: 'integration', label: 'Tích hợp' },
]

// Inline toggle switch built from a styled button.
function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-brand-500/30',
          checked ? 'bg-brand-600' : 'bg-slate-300',
        )}
      >
        <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition', checked ? 'translate-x-6' : 'translate-x-1')} />
      </button>
    </div>
  )
}

export default function SystemSettings() {
  const toast = useToast()
  const [tab, setTab] = useState('general')
  const [form, setForm] = useState({
    storeName: 'Siêu thị SMS Central',
    address: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    hotline: '1900 1234',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    vat: '8',
    invoiceTemplate: 'A5 chuẩn',
    invoicePrefix: 'INV-',
    notifyLowStock: true,
    notifyExpiry: true,
    notifyEmailReport: false,
    paymentGateway: 'VNPAY',
    apiKey: 'sk_live_4f8a••••••••••••2c91',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const save = () => toast.success('Đã lưu cấu hình hệ thống.')

  return (
    <div>
      <PageHeader
        breadcrumb="Hệ thống · 3.11.1"
        title="Cấu hình hệ thống"
        subtitle="Thiết lập thông tin cửa hàng, thuế, thông báo và tích hợp."
        actions={<Button icon={Save} onClick={save}>Lưu cấu hình</Button>}
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === 'general' && (
        <Card>
          <CardHeader title="Thông tin chung" subtitle="Thông tin định danh cửa hàng" icon={Store} />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên cửa hàng">
              <Input value={form.storeName} onChange={set('storeName')} />
            </Field>
            <Field label="Hotline">
              <Input value={form.hotline} onChange={set('hotline')} />
            </Field>
            <Field label="Địa chỉ" className="sm:col-span-2">
              <Input value={form.address} onChange={set('address')} />
            </Field>
            <Field label="Múi giờ">
              <Select value={form.timezone} onChange={set('timezone')}>
                <option value="Asia/Ho_Chi_Minh">(GMT+7) Hồ Chí Minh</option>
                <option value="Asia/Bangkok">(GMT+7) Bangkok</option>
                <option value="Asia/Singapore">(GMT+8) Singapore</option>
              </Select>
            </Field>
            <Field label="Tiền tệ">
              <Select value={form.currency} onChange={set('currency')}>
                <option value="VND">VND — Việt Nam Đồng</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
            </Field>
          </CardBody>
        </Card>
      )}

      {tab === 'tax' && (
        <Card>
          <CardHeader title="Thuế & Hóa đơn" subtitle="Cấu hình VAT và mẫu hóa đơn" icon={ReceiptText} />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Thuế VAT (%)" hint="Áp dụng mặc định trên hóa đơn">
              <Input type="number" value={form.vat} onChange={set('vat')} />
            </Field>
            <Field label="Mẫu hóa đơn">
              <Select value={form.invoiceTemplate} onChange={set('invoiceTemplate')}>
                <option value="A5 chuẩn">A5 chuẩn</option>
                <option value="A4 chi tiết">A4 chi tiết</option>
                <option value="Hóa đơn nhiệt 80mm">Hóa đơn nhiệt 80mm</option>
              </Select>
            </Field>
            <Field label="Tiền tố mã hóa đơn" hint="Ví dụ: INV-20260615-0001">
              <Input value={form.invoicePrefix} onChange={set('invoicePrefix')} />
            </Field>
          </CardBody>
        </Card>
      )}

      {tab === 'notify' && (
        <Card>
          <CardHeader title="Thông báo" subtitle="Bật/tắt cảnh báo tự động" icon={Bell} />
          <CardBody className="space-y-3">
            <Toggle
              label="Cảnh báo tồn kho thấp"
              hint="Gửi cảnh báo khi sản phẩm dưới ngưỡng tồn tối thiểu"
              checked={form.notifyLowStock}
              onChange={(v) => setForm((f) => ({ ...f, notifyLowStock: v }))}
            />
            <Toggle
              label="Cảnh báo hàng cận hạn"
              hint="Nhắc nhở khi sản phẩm sắp hết hạn sử dụng"
              checked={form.notifyExpiry}
              onChange={(v) => setForm((f) => ({ ...f, notifyExpiry: v }))}
            />
            <Toggle
              label="Email báo cáo định kỳ"
              hint="Gửi báo cáo doanh thu hằng tuần qua email"
              checked={form.notifyEmailReport}
              onChange={(v) => setForm((f) => ({ ...f, notifyEmailReport: v }))}
            />
          </CardBody>
        </Card>
      )}

      {tab === 'integration' && (
        <Card>
          <CardHeader title="Tích hợp" subtitle="Cổng thanh toán và khóa API" icon={Plug} />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Cổng thanh toán">
              <Select value={form.paymentGateway} onChange={set('paymentGateway')}>
                <option value="VNPAY">VNPAY</option>
                <option value="MoMo">MoMo</option>
                <option value="ZaloPay">ZaloPay</option>
              </Select>
            </Field>
            <Field label="API Key" hint="Khóa được ẩn vì lý do bảo mật" className="sm:col-span-2">
              <Input value={form.apiKey} onChange={set('apiKey')} readOnly className="font-mono" />
            </Field>
            <Divider className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <Button variant="secondary" onClick={() => toast.info('Đã tạo lại khóa API mới (demo).')}>Tạo lại khóa API</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="mt-6 flex justify-end">
        <Button icon={Save} onClick={save}>Lưu cấu hình</Button>
      </div>
    </div>
  )
}
