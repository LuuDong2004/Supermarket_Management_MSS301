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
    <div className="flex min-h-screen bg-slate-50/50">
      {/* ---------------- Brand panel ---------------- */}
      <div className="relative hidden w-[55%] overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-600 to-teal-950 lg:flex lg:flex-col shadow-premium">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-400/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl font-black shadow-lg backdrop-blur border border-white/10">
              S
            </div>
            <div>
              <p className="text-lg font-black tracking-wide font-display">SMS</p>
              <p className="text-xs text-emerald-100/70 font-medium">Supermarket Management System</p>
            </div>
          </div>

          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-emerald-50 backdrop-blur border border-white/5">
              <Sparkles size={13} className="text-emerald-300 animate-pulse" /> Nền tảng quản lý siêu thị hợp nhất
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight font-display text-white">
              Vận hành siêu thị<br />thông minh &amp; hiện đại.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">
              Hợp nhất bán hàng, kho vận, nhân sự và báo cáo điều hành trong một hệ thống duy nhất, tối ưu hiệu suất tối đa.
            </p>

            <div className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white shadow-sm">
                    <f.icon size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold tracking-wide font-display">{f.title}</p>
                    <p className="text-xs text-emerald-100/60 mt-0.5">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-100/40 font-medium tracking-wide">
            <span>MSS301 · SE1913 · JV Group 4</span>
            <span>© 2026 SMS</span>
          </div>
        </div>
      </div>

      {/* ---------------- Form panel ---------------- */}
      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[45%]">
        <div className="w-full max-w-[390px]">
          {/* mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-xl font-extrabold text-white shadow-premium">S</div>
            <div>
              <p className="font-extrabold text-slate-800 font-display tracking-wide">SMS</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Supermarket Management</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-premium backdrop-blur-sm">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">Chào mừng trở lại 👋</h1>
            <p className="mt-1.5 text-xs text-slate-400 font-medium">Đăng nhập bằng tài khoản nhân viên để tiếp tục.</p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <Field label="Tên đăng nhập" required>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-10"
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
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                  <input type="checkbox" className="h-4 w-4 rounded-md border-slate-200 text-brand-600 focus:ring-brand-500/10" />
                  Ghi nhớ đăng nhập
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="font-bold text-brand-600 hover:text-brand-700">
                  Quên mật khẩu?
                </a>
              </div>

              <Button type="submit" size="lg" className="w-full font-bold" loading={loading} icon={ArrowRight}>
                Đăng nhập
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[10px] font-bold tracking-wider text-slate-400/80">
              <span className="h-px flex-1 bg-slate-100" />
              ĐĂNG NHẬP NHANH (DEMO)
              <span className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {QUICK.map((q) => (
                <button
                  key={q.u}
                  type="button"
                  onClick={() => quick(q.u)}
                  className="group flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-2.5 text-left transition-all duration-300 hover:border-brand-200 hover:bg-brand-50/50 hover:shadow-premium-hover active:scale-95"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-sm">
                    <q.icon size={15} />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-slate-700 tracking-wide font-display group-hover:text-brand-700">{q.label}</span>
                    <span className="block text-[10px] text-slate-400/80 font-medium">@{q.u}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3.5 text-center text-[10px] text-slate-400/70 font-semibold">Mật khẩu demo: <span className="font-bold text-slate-500">password</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
