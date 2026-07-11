import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, ShoppingCart,
  Boxes, BarChart3, Crown, Wrench, Package, Truck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { Button, Field, Input } from '../../components/ui/primitives.jsx'

const QUICK = [
  { u: 'ceo', label: 'CEO', icon: Crown },
  { u: 'admin', label: 'Admin', icon: ShieldCheck },
  { u: 'cashier', label: 'Thu ngân', icon: ShoppingCart },
  { u: 'warehouse', label: 'Quản lý kho', icon: Wrench },
  { u: 'staff', label: 'Nhân viên kho', icon: Package },
  { u: 'supplier', label: 'Nhà cung cấp', icon: Truck },
]

const FEATURES = [
  { icon: Boxes, title: 'Kiến trúc Microservice', text: 'Các service độc lập, dễ mở rộng và ổn định.' },
  { icon: BarChart3, title: 'Quản lý tập trung', text: 'Sản phẩm, kho, bán hàng, khách hàng… một nơi.' },
  { icon: ShieldCheck, title: 'An toàn & tin cậy', text: 'Phân quyền theo vai trò, xác thực bảo mật.' },
]

/* Flat supermarket-checkout illustration, brand-tinted. */
function StoreScene() {
  return (
    <svg viewBox="0 0 520 300" className="h-auto w-full" role="img" aria-label="Minh hoạ siêu thị">
      {/* back shelves */}
      <rect x="150" y="20" width="330" height="150" rx="10" fill="#dfe8fb" />
      {[38, 74, 110].map((y) => (
        <g key={y}>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={i}
              x={168 + i * 33}
              y={y}
              width="20"
              height="26"
              rx="4"
              fill={['#c7d6f7', '#bcd0f5', '#d4b9e8', '#f6d9b0', '#bfe3d0'][i % 5]}
            />
          ))}
          <rect x="160" y={y + 28} width="308" height="5" rx="2.5" fill="#c2d2f2" />
        </g>
      ))}

      {/* floor shadow */}
      <ellipse cx="270" cy="284" rx="230" ry="14" fill="#d5e0f6" />

      {/* counter */}
      <rect x="150" y="196" width="250" height="86" rx="8" fill="#4f6bf0" />
      <rect x="150" y="196" width="250" height="86" rx="8" fill="url(#cg)" />
      <rect x="140" y="182" width="270" height="20" rx="6" fill="#eef3ff" />
      <rect x="176" y="222" width="52" height="44" rx="6" fill="#3b55d9" opacity=".55" />
      <rect x="240" y="222" width="52" height="44" rx="6" fill="#3b55d9" opacity=".55" />

      {/* POS monitor */}
      <rect x="196" y="112" width="92" height="62" rx="7" fill="#1e2a5a" />
      <rect x="204" y="120" width="76" height="46" rx="4" fill="#3f57c9" />
      <rect x="236" y="174" width="12" height="12" fill="#1e2a5a" />
      <rect x="222" y="184" width="40" height="6" rx="3" fill="#1e2a5a" />
      {/* card reader */}
      <rect x="300" y="150" width="26" height="34" rx="4" fill="#26327a" />
      <rect x="304" y="156" width="18" height="11" rx="2" fill="#5b73e0" />

      {/* shopping basket */}
      <polygon points="330,150 410,150 398,196 342,196" fill="#3b5bdb" />
      <polygon points="330,150 410,150 406,164 334,164" fill="#5876e8" />
      <circle cx="352" cy="150" r="11" fill="#f2b34a" />
      <circle cx="372" cy="147" r="12" fill="#e2574c" />
      <circle cx="392" cy="151" r="10" fill="#4fae6d" />
      <path d="M340 150v40M356 152v38M372 152v38M388 152v38" stroke="#2c49c4" strokeWidth="2" opacity=".5" />

      {/* cardboard boxes */}
      <rect x="150" y="228" width="70" height="54" rx="5" fill="#e2c191" />
      <rect x="150" y="228" width="70" height="18" rx="5" fill="#d7b27d" />
      <rect x="181" y="228" width="8" height="54" fill="#c69e63" opacity=".6" />
      <rect x="120" y="250" width="46" height="32" rx="5" fill="#eccfa0" />
      <rect x="120" y="250" width="46" height="11" rx="5" fill="#dcbd85" />

      {/* vegetable crate */}
      <rect x="228" y="244" width="74" height="38" rx="5" fill="#2f9e6b" />
      <circle cx="246" cy="248" r="9" fill="#e57e3c" />
      <circle cx="266" cy="246" r="9" fill="#e2574c" />
      <circle cx="286" cy="248" r="9" fill="#4fae6d" />

      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".12" />
          <stop offset="1" stopColor="#1e2a5a" stopOpacity=".12" />
        </linearGradient>
      </defs>
    </svg>
  )
}

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

  // Quick login signs straight in with the demo password.
  const quick = async (u) => {
    setUsername(u)
    setPassword('123456')
    try {
      const usr = await login(u, '123456')
      toast.success(`Xin chào, ${usr.fullName || usr.username}!`)
      navigate('/app/dashboard')
    } catch (err) {
      toast.error(err.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="grid min-h-screen w-full bg-gradient-to-b from-[#eaf1fd] via-[#eef4fe] to-white lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      {/* ---------------- Brand panel ---------------- */}
      <div className="relative mx-auto flex w-full max-w-xl flex-col justify-between gap-4 overflow-y-auto p-6 sm:p-8 lg:px-10 xl:py-10">
            {/* logo */}
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <ShoppingCart size={22} strokeWidth={2.4} />
              </span>
              <div className="leading-tight">
                <p className="text-2xl font-extrabold tracking-tight text-brand-700">SMS</p>
                <p className="text-[11px] font-medium text-slate-400">Supermarket Management System</p>
              </div>
            </div>

            <div>
              {/* headline */}
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-[2rem]">
                Hệ thống Quản lý<br />Siêu thị <span className="text-brand-600">(microservice)</span>
              </h1>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-500">
                Giải pháp hiện đại, mở rộng linh hoạt và module hoá để quản lý toàn bộ vận hành siêu thị.
              </p>

              {/* illustration */}
              <div className="relative mt-4 max-w-[380px]">
                <span className="absolute left-[30%] top-2 -rotate-6 rounded-md bg-brand-500/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
                  ĐỒ UỐNG
                </span>
                <span className="absolute right-[16%] top-10 rotate-3 rounded-md bg-brand-500/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
                  THỰC PHẨM
                </span>
                <StoreScene />
              </div>
            </div>

            {/* feature cards */}
            <div className="space-y-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200/70">
                    <f.icon size={19} />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-slate-800">{f.title}</p>
                    <p className="text-xs leading-relaxed text-slate-400">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400">© 2026 SMS · MSS301 · SE1913 · JV Group 4</p>
          </div>

          {/* ---------------- Form panel (raised card) ---------------- */}
          <div className="mx-auto flex w-full max-w-xl items-center justify-center overflow-y-auto p-5 sm:p-8 lg:px-10 lg:py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_60px_-24px_rgba(30,58,138,0.45)] ring-1 ring-slate-100 sm:p-8">
              {/* lock badge + heading */}
              <div className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/50">
                  <Lock size={24} />
                </span>
                <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">Chào mừng trở lại!</h2>
                <p className="mt-1 text-sm text-slate-500">Đăng nhập để tiếp tục vào tài khoản SMS của bạn.</p>
              </div>

              <form onSubmit={submit} className="mt-5 space-y-3.5">
                <Field label="Tên đăng nhập" required>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="pl-9"
                      placeholder="Nhập tên đăng nhập"
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
                      placeholder="Nhập mật khẩu"
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

              <div className="my-4 flex items-center gap-3 text-xs font-medium text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                HOẶC ĐĂNG NHẬP NHANH
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {QUICK.map((q) => (
                  <button
                    key={q.u}
                    type="button"
                    onClick={() => quick(q.u)}
                    className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-brand-300 hover:bg-brand-50"
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
                Chưa có tài khoản? <span className="font-medium text-brand-600">Liên hệ quản trị viên.</span>
                <span className="mx-1.5 text-slate-300">·</span>
                Mật khẩu demo: <span className="font-semibold text-slate-500">123456</span>
              </p>
            </div>
          </div>
    </div>
  )
}
