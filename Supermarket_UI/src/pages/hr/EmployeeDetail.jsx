import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatDate, roleLabel, initials } from '../../lib/format.js'
import { employeeService, withFallback, toList, mockEmployees } from '../../services/index.js'
import { ArrowLeft, Pencil, Trash2, UserCheck, UserX, Building2, Calendar, Phone, BadgeDollarSign } from 'lucide-react'

const isInactive = (status) => (status || '').toLowerCase().includes('nghỉ')

// Full-page employee profile view (replaces the old detail modal).
export default function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [emp, setEmp] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => employeeService.list({ size: 200 }), mockEmployees)
    const e = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
    if (!e) {
      toast.error('Không tìm thấy nhân viên.')
      navigate('/app/hr/employees')
      return
    }
    setEmp(e)
    setLoading(false)
  }
  useEffect(() => { load() }, [id])

  const remove = async () => {
    try {
      await employeeService.remove(emp.id)
      toast.success('Đã xóa nhân viên.')
      navigate('/app/hr/employees')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const toggleActive = async () => {
    try {
      if (isInactive(emp.status)) await employeeService.activate(emp.id)
      else await employeeService.deactivate(emp.id)
      toast.success(isInactive(emp.status) ? `Đã kích hoạt lại ${emp.name}.` : `Đã cho ${emp.name} nghỉ việc.`)
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const history = [
    { date: '2024-05-01', text: 'Gia nhập công ty — Thu ngân' },
    { date: '2024-11-20', text: 'Hoàn thành đào tạo POS nâng cao' },
    { date: '2025-06-01', text: 'Đánh giá hiệu suất loại A — tăng lương 6%' },
    { date: '2026-01-15', text: 'Phụ trách ca tối' },
  ]

  if (loading || !emp) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Nhân sự · 3.5.1"
        title={emp.name}
        subtitle={`${emp.code || emp.id} · ${roleLabel(emp.role)}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/hr/employees')}>Quay lại</Button>
            <Button variant="secondary" icon={Pencil} onClick={() => navigate(`/app/hr/employees/${emp.id}/edit`)}>Sửa</Button>
            <Button
              variant={isInactive(emp.status) ? 'success' : 'secondary'}
              icon={isInactive(emp.status) ? UserCheck : UserX}
              onClick={toggleActive}
            >
              {isInactive(emp.status) ? 'Kích hoạt' : 'Vô hiệu hóa'}
            </Button>
            <Button variant="danger" icon={Trash2} onClick={remove}>Xóa</Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-base font-semibold text-brand-700">
                {initials(emp.name)}
              </span>
              <div>
                <p className="text-lg font-semibold text-slate-800">{emp.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone="brand">{roleLabel(emp.role)}</Badge>
                  <StatusBadge status={emp.status} />
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={Building2} label="Phòng ban" value={emp.dept} />
              <InfoRow icon={Calendar} label="Ngày vào làm" value={formatDate(emp.joined)} />
              <InfoRow icon={Phone} label="Điện thoại" value={emp.phone} />
              <InfoRow icon={BadgeDollarSign} label="Lương" value={formatCurrency(emp.salary)} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="mb-3 text-sm font-semibold text-slate-700">Lịch sử công tác</p>
            <ol className="relative ml-2 space-y-4 border-l border-slate-200 pl-5">
              {history.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
                  <p className="text-xs font-medium text-brand-600">{formatDate(h.date)}</p>
                  <p className="text-sm text-slate-700">{h.text}</p>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}
