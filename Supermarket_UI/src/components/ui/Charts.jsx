import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

const BRAND = '#111111'
const PALETTE = ['#111111', '#555555', '#888888', '#aaaaaa', '#333333', '#777777']

const axis = { tick: { fontSize: 12, fill: '#111111' }, axisLine: { stroke: '#111111' }, tickLine: false }
const grid = { strokeDasharray: '0', stroke: '#d1d1d1', vertical: false }

function box() {
  return { contentStyle: { borderRadius: 0, border: '1px solid #111111', fontSize: 12, boxShadow: 'none' } }
}

export function AreaTrend({ data, x, y, height = 260, color = BRAND }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...box()} />
        <Area type="monotone" dataKey={y} stroke={color} strokeWidth={2} fill="#eeeeee" />
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
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || PALETTE[i % PALETTE.length]} radius={[0, 0, 0, 0]} maxBarSize={42} />
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
