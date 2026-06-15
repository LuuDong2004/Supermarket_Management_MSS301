import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Card, CardHeader, CardBody, Button, Field, Input } from '../components/ui/primitives.jsx'
import { StatusBadge } from '../components/ui/primitives.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { roleLabel, initials, formatDate } from '../lib/format.js'
import { api } from '../lib/api.js'
import { UserCircle, KeyRound } from 'lucide-react'

export default function Profile() {
  const { user, mockMode } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '' })
  const [pwd, setPwd] = useState({ oldPassword: '', newPassword: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const saveProfile = async (e) => {
    e.preventDefault()
    if (mockMode) return toast.info('Chế độ demo: thay đổi không lưu lên backend.')
    try {
      await api.put('/users/me', form)
      toast.success('Đã cập nhật hồ sơ.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (mockMode) return toast.info('Chế độ demo: không đổi mật khẩu thật.')
    try {
      await api.put('/users/me/password', pwd)
      toast.success('Đã đổi mật khẩu.')
      setPwd({ oldPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Hồ sơ của tôi" subtitle="Quản lý thông tin tài khoản và bảo mật." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
              {initials(user?.fullName || user?.username || 'U')}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{user?.fullName || user?.username}</h3>
            <p className="text-sm text-slate-500">@{user?.username}</p>
            <div className="mt-3"><StatusBadge status={user?.status || 'Active'} /></div>
            <div className="mt-5 w-full space-y-2 border-t border-slate-100 pt-4 text-left text-sm">
              <Row label="Vai trò" value={roleLabel(user?.role)} />
              <Row label="Email" value={user?.email || '—'} />
              <Row label="Điện thoại" value={user?.phone || '—'} />
              <Row label="Tham gia" value={formatDate(user?.createdAt)} />
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Thông tin cá nhân" icon={UserCircle} />
            <CardBody>
              <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
                <Field label="Họ và tên"><Input value={form.fullName} onChange={set('fullName')} /></Field>
                <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
                <Field label="Điện thoại"><Input value={form.phone} onChange={set('phone')} /></Field>
                <div className="flex items-end sm:col-span-2">
                  <Button type="submit">Lưu thay đổi</Button>
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Đổi mật khẩu" icon={KeyRound} />
            <CardBody>
              <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
                <Field label="Mật khẩu hiện tại"><Input type="password" value={pwd.oldPassword} onChange={(e) => setPwd((p) => ({ ...p, oldPassword: e.target.value }))} /></Field>
                <Field label="Mật khẩu mới"><Input type="password" value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} /></Field>
                <div className="flex items-end sm:col-span-2">
                  <Button type="submit" variant="secondary">Cập nhật mật khẩu</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  )
}
