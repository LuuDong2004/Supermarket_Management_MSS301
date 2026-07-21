import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

const BRAND = '#059669'
const PALETTE = ['#059669', '#0ea5e9', '#8b5cf6', '#f59e0b', '#f43f5e', '#14b8a6']

const axis = { tick: { fontSize: 11, fill: '#64748b' }, axisLine: false, tickLine: false }
const grid = { strokeDasharray: '4 4', stroke: '#e2e8f0', vertical: false }

function box() {
  return { contentStyle: { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 12px 32px rgba(15,23,42,.12)' } }
}

export function AreaTrend({ data, x, y, height = 260, color = BRAND }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...box()} />
        <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.28} /><stop offset="100%" stopColor={color} stopOpacity={0.02} /></linearGradient></defs>
        <Area type="monotone" dataKey={y} stroke={color} strokeWidth={2.5} fill="url(#areaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Bars({ data, x, series, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...box()} cursor={{ fill: '#f8fafc' }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || PALETTE[i % PALETTE.length]} radius={[6, 6, 0, 0]} maxBarSize={42} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function Lines({ data, x, series, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...box()} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || PALETTE[i % PALETTE.length]} strokeWidth={2.5} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Donut({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={2}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Pie>
        <Tooltip {...box()} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
