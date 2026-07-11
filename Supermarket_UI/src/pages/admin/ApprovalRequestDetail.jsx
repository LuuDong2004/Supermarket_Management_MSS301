import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, StatusBadge, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { useConfirm } from '../../components/ui/Confirm.jsx'
import { formatDate } from '../../lib/format.js'
import { approvalRequestService, withFallback, toList, mockApprovalRequests } from '../../services/index.js'
import { ArrowLeft, Check, X } from 'lucide-react'

function typeTone(type) {
  if (type === 'Tạo tài khoản') return 'blue'
  if (type === 'Thay đổi quyền') return 'violet'
  if (type === 'Điều chỉnh kho') return 'amber'
  return 'brand'
}

const todayIso = () => new Date().toISOString().slice(0, 10)

// Full-page approval request view (replaces the old detail modal).
export default function ApprovalRequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const [req, setReq] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const r = await withFallback(() => approvalRequestService.list(), mockApprovalRequests)
    const found = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
    if (!found) {
      toast.error('Không tìm thấy yêu cầu phê duyệt.')
      navigate('/app/admin/approval-requests')
      return
    }
    setReq(found)
    setLoading(false)
  }
  useEffect(() => { load() }, [id])

  const decide = async (status) => {
    const approving = status === 'Đã duyệt'
    if (!(await confirm({
      title: approving ? 'Duyệt yêu cầu?' : 'Từ chối yêu cầu?',
      message: `Yêu cầu ${req.code || req.id} (${req.type}) sẽ được ${approving ? 'phê duyệt' : 'từ chối'}.`,
      confirmLabel: approving ? 'Duyệt' : 'Từ chối',
      danger: !approving,
    }))) return
    const payload = {
      code: req.code || req.id,
      type: req.type,
      requester: req.requester,
      target: req.target,
      reqDate: req.reqDate || req.date || todayIso(),
      status,
      note: req.note || '',
    }
    try {
      await approvalRequestService.update(req.id, payload)
      toast.success(status === 'Đã duyệt' ? 'Đã duyệt yêu cầu.' : 'Đã từ chối yêu cầu.')
      await load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (loading || !req) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Quản trị · 3.4.2"
        title={`Yêu cầu ${req.code || req.id}`}
        subtitle={req.type}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/admin/approval-requests')}>Quay lại</Button>
            {req.status === 'Chờ duyệt' && (
              <>
                <Button variant="danger" icon={X} onClick={() => decide('Từ chối')}>Từ chối</Button>
                <Button variant="success" icon={Check} onClick={() => decide('Đã duyệt')}>Duyệt</Button>
              </>
            )}
          </div>
        }
      />

      <Card className="max-w-3xl">
        <CardBody>
          <div className="space-y-3 text-sm">
            <DetailRow label="Loại" value={<Badge tone={typeTone(req.type)}>{req.type}</Badge>} />
            <DetailRow label="Người yêu cầu" value={req.requester} />
            <DetailRow label="Đối tượng" value={req.target} />
            <DetailRow label="Ngày tạo" value={formatDate(req.reqDate || req.date)} />
            <DetailRow label="Trạng thái" value={<StatusBadge status={req.status} />} />
            <div>
              <p className="text-slate-500">Ghi chú</p>
              <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-slate-700">{req.note || 'Không có ghi chú.'}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
