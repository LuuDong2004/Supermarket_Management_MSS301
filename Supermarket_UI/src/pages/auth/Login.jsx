import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, ShoppingCart,
  Boxes, BarChart3, Crown, Wrench,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { Button, Field, Input } from '../../components/ui/primitives.jsx'

const QUICK = [
  { u: 'ceo', label: 'CEO', icon: Crown },
  { u: 'admin', label: 'Admin', icon: ShieldCheck },
  { u: 'cashier', label: 'Thu ngân', icon: ShoppingCart },
  { u: 'warehouse', label: 'Kho', icon: Wrench },
]

const FEATURES = [
  { icon: ShoppingCart, title: 'Bán hàng POS', text: 'Thu ngân, thanh toán, khuyến mãi' },
  { icon: Boxes, title: 'Quản lý kho', text: 'Nhập xuất, kiểm kê, cảnh báo tồn' },
  { icon: BarChart3, title: 'Báo cáo điều hành', text: 'Doanh thu, nhân sự, phê duyệt' },
]

export default function Login() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  if (user) return <Navigate to="/app/dashboard" replace />

  const submit = async (e) => {
    e.preventDefault()
    try {
      const u = await login(username.trim(), password)
      toast.success(`Xin chào, ${u.fullName || u.username}!`)
      navigate('/app/dashboard')
    } catch (err) {
      toast.error(err.message || 'Đăng nhập thất bại')
    }
  }

  const quick = (u) => {
    setUsername(u)
    setPassword('123456')
  }

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      {/* ---------------- Brand panel ---------------- */}
      <div className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white p-10 lg:flex xl:p-16">
        {/* soft decorative glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative">
          {/* logo */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
              <ShoppingCart size={22} strokeWidth={2.4} />
            </span>
            <div className="leading-tight">
              <p className="text-xl font-extrabold tracking-tight text-brand-700">SMS</p>
              <p className="text-[11px] font-medium text-slate-400">Supermarket Management System</p>
            </div>
          </div>

          {/* headline */}
          <h1 className="mt-10 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-[2.35rem]">
            Vận hành siêu thị<br />thông minh &amp; hiện đại.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
            Hợp nhất bán hàng, kho vận, nhân sự và báo cáo điều hành trong một hệ thống duy nhất.
          </p>

          {/* illustration */}
          <div className="relative mt-9 max-w-xl overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-brand-50 to-blue-100/40 px-6 py-10">
            <span className="absolute left-8 top-5 -rotate-6 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand-500 shadow-sm">
              ĐỒ UỐNG
            </span>
            <span className="absolute right-10 top-12 rotate-6 rounded-md bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand-500 shadow-sm">
              THỰC PHẨM
            </span>
            <div className="flex items-center justify-center gap-8 text-brand-500/80">
              <Boxes size={60} strokeWidth={1.3} />
              <ShoppingCart size={104} strokeWidth={1.3} className="text-brand-600/90" />
              <BarChart3 size={60} strokeWidth={1.3} />
            </div>
          </div>
        </div>

        {/* feature cards */}
        <div className="relative grid max-w-xl gap-2.5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200/80 bg-white/70 p-3.5 backdrop-blur-sm transition hover:border-brand-200 hover:bg-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <f.icon size={19} />
              </span>
              <p className="mt-2.5 text-sm font-semibold text-slate-800">{f.title}</p>
              <p className="text-xs text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>

        <p className="relative text-xs text-slate-400">MSS301 · SE1913 · JV Group 4 · © 2026 SMS</p>
      </div>

      {/* ---------------- Form panel ---------------- */}
      <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 sm:py-12">
        <div className="w-full max-w-sm">
          {/* mobile brand */}
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <ShoppingCart size={22} strokeWidth={2.4} />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-brand-700">SMS</p>
              <p className="text-[11px] text-slate-400">Supermarket Management</p>
            </div>
          </div>

          {/* lock badge + heading */}
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/50">
              <Lock size={26} />
            </span>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Chào mừng trở lại 👋</h2>
            <p className="mt-1.5 text-sm text-slate-500">Đăng nhập bằng tài khoản nhân viên để tiếp tục.</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="Tên đăng nhập" required>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="vd: cashier"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </Field>

            <Field label="Mật khẩu" required>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type={showPwd ? 'text' : 'password'}
                  className="pl-9 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/30" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-brand-600 hover:text-brand-700">
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading} icon={ArrowRight}>
              Đăng nhập
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-medium text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            ĐĂNG NHẬP NHANH (DEMO)
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUICK.map((q) => (
              <button
                key={q.u}
                type="button"
                onClick={() => quick(q.u)}
                className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-brand-600 group-hover:text-white">
                  <q.icon size={15} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-700 group-hover:text-brand-700">{q.label}</span>
                  <span className="block text-[11px] text-slate-400">@{q.u}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Mật khẩu demo: <span className="font-semibold text-slate-500">123456</span>
          </p>
        </div>
      </div>
    </div>
  )
}
