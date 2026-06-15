import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, ShoppingCart,
  Boxes, BarChart3, Sparkles, Crown, Wrench,
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
    setPassword('password')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ---------------- Brand panel ---------------- */}
      <div className="relative hidden w-[55%] overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-900 lg:flex lg:flex-col">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-400/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl font-extrabold shadow-lg backdrop-blur">
              S
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">SMS</p>
              <p className="text-sm text-white/60">Supermarket Management System</p>
            </div>
          </div>

          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <Sparkles size={13} /> Nền tảng quản lý siêu thị hợp nhất
            </span>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight">
              Vận hành siêu thị<br />thông minh &amp; hiện đại.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Hợp nhất bán hàng, kho vận, nhân sự và báo cáo điều hành trong một hệ thống duy nhất.
            </p>

            <div className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur transition hover:bg-white/10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                    <f.icon size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-white/60">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-white/50">
            <span>MSS301 · SE1913 · JV Group 4</span>
            <span>© 2026 SMS</span>
          </div>
        </div>
      </div>

      {/* ---------------- Form panel ---------------- */}
      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[45%]">
        <div className="w-full max-w-[380px]">
          {/* mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-xl font-extrabold text-white">S</div>
            <div>
              <p className="font-bold text-slate-900">SMS</p>
              <p className="text-xs text-slate-400">Supermarket Management</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card-hover">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chào mừng trở lại 👋</h1>
            <p className="mt-1.5 text-sm text-slate-500">Đăng nhập bằng tài khoản nhân viên để tiếp tục.</p>

            <form onSubmit={submit} className="mt-7 space-y-4">
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

            <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
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
            <p className="mt-3 text-center text-xs text-slate-400">Mật khẩu demo: <span className="font-medium text-slate-500">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
