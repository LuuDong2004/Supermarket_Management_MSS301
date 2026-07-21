import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Spinner } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency, formatNumber, formatDate, initials } from '../../lib/format.js'
import { customerService, withFallback, toList } from '../../services/index.js'
import { ArrowLeft, Mail, Phone, Crown, Star, Gift, Calendar } from 'lucide-react'

const TIER_TONE = { Platinum: 'violet', Gold: 'amber', Silver: 'slate', Member: 'blue' }

// Full-page member profile view (replaces the old detail modal).
export default function MemberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const r = await withFallback(() => customerService.list())
      const c = toList(r.data).find((x) => String(x.id) === String(id) || x.code === id)
      if (!c) {
        toast.error('Không tìm thấy thành viên.')
        navigate('/app/pos/members')
        return
      }
      setMember(c)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading || !member) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        breadcrumb="POS · 3.9.1"
        title={member.name}
        subtitle={`${member.id} · Thành viên ${member.tier}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/app/pos/members')}>Quay lại danh sách</Button>
            <Button variant="secondary" icon={Mail} onClick={() => toast.info(`Đã gửi ưu đãi tới ${member.name}.`)}>
              Gửi ưu đãi cá nhân
            </Button>
          </div>
        }
      />

      <Card className="max-w-4xl">
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-base font-semibold text-brand-700">
              {initials(member.name)}
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-800">{member.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge tone={TIER_TONE[member.tier] || 'slate'}>{member.tier}</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow icon={Phone} label="Điện thoại" value={member.phone} />
            <InfoRow icon={Crown} label="Hạng thành viên" value={member.tier} />
            <InfoRow icon={Star} label="Điểm thưởng" value={formatNumber(member.points)} />
            <InfoRow icon={Gift} label="Tổng chi tiêu" value={formatCurrency(member.spent)} />
            <InfoRow icon={Calendar} label="Ngày tham gia" value={formatDate(member.joined)} />
          </div>
        </CardBody>
      </Card>
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
