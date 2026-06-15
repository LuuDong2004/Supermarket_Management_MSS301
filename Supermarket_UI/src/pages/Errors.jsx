import { Link } from 'react-router-dom'
import { ShieldX, Compass } from 'lucide-react'
import { Button } from '../components/ui/primitives.jsx'

function Shell({ icon: Icon, code, title, text }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon size={30} />
      </span>
      <p className="text-5xl font-extrabold text-slate-900">{code}</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-800">{title}</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      <Link to="/app/dashboard" className="mt-6">
        <Button>Về trang Tổng quan</Button>
      </Link>
    </div>
  )
}

export function Forbidden() {
  return <Shell icon={ShieldX} code="403" title="Không có quyền truy cập" text="Vai trò của bạn không được phép xem trang này." />
}

export function NotFound() {
  return <Shell icon={Compass} code="404" title="Không tìm thấy trang" text="Đường dẫn bạn truy cập không tồn tại." />
}
