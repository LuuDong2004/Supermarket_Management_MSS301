import { useState, useEffect, useMemo } from 'react'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Card, CardBody, Button, Badge, Field, Input, EmptyState } from '../../components/ui/primitives.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { formatCurrency } from '../../lib/format.js'
import { productService, withFallback, toList } from '../../services/index.js'
import { Search, Printer, Barcode as BarcodeIcon, CheckSquare, Square } from 'lucide-react'

// Deterministic visual barcode (module widths) from a code string. Not a scannable
// standard symbology — a print-ready label representation for the warehouse UI.
function moduleWidths(text) {
  const src = (text || '0').toString()
  const widths = []
  for (const ch of src) {
    const code = ch.charCodeAt(0)
    for (let i = 0; i < 4; i++) widths.push(((code >> i) & 1) ? 3 : 1)
  }
  return widths.length ? widths : [1]
}

function barsSvg(value, { w = 220, h = 54 } = {}) {
  const widths = moduleWidths(value)
  const unit = w / widths.reduce((a, b) => a + b, 0)
  let x = 0
  const rects = widths.map((wd, i) => {
    const rw = wd * unit
    const rect = i % 2 === 0 ? `<rect x="${x.toFixed(2)}" y="0" width="${rw.toFixed(2)}" height="${h}" fill="#0f172a"/>` : ''
    x += rw
    return rect
  }).join('')
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`
}

function Barcode({ value }) {
  return <span dangerouslySetInnerHTML={{ __html: barsSvg(value, { w: 200, h: 48 }) }} />
}

function printLabels(labels) {
  const cells = labels.map((l) => `
    <div class="label">
      <div class="name">${l.name}</div>
      ${barsSvg(l.barcode || l.code, { w: 200, h: 50 })}
      <div class="code">${l.barcode || l.code}</div>
      <div class="price">${new Intl.NumberFormat('vi-VN').format(l.price || 0)} đ</div>
    </div>`).join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Tem mã vạch</title>
    <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:10px}
    .grid{display:flex;flex-wrap:wrap;gap:8px}
    .label{width:220px;border:1px solid #cbd5e1;border-radius:6px;padding:8px;text-align:center}
    .name{font-size:12px;font-weight:600;color:#0f172a;height:32px;overflow:hidden}
    .code{font-family:monospace;font-size:12px;letter-spacing:1px;margin-top:2px}
    .price{font-size:14px;font-weight:700;color:#0f172a}
    @media print{.label{page-break-inside:avoid}}</style></head>
    <body><div class="grid">${cells}</div></body></html>`
  const win = window.open('', '_blank', 'width=900,height=650')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  win.print()
}

export default function BarcodePrint() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [source, setSource] = useState('backend')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState({}) // code -> true
  const [copies, setCopies] = useState(1)

  const load = async () => {
    const res = await withFallback(() => productService.list())
    setProducts(toList(res.data))
    setSource(res.source)
  }
  useEffect(() => { load() }, [])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q) || (p.barcode || '').toLowerCase().includes(q))
  }, [products, search])

  const selectedList = useMemo(() => products.filter((p) => selected[p.code]), [products, selected])
  const toggle = (code) => setSelected((s) => ({ ...s, [code]: !s[code] }))
  const selectAll = () => setSelected(Object.fromEntries(rows.map((p) => [p.code, true])))
  const clear = () => setSelected({})

  const labels = useMemo(() => {
    const n = Math.max(1, Number(copies) || 1)
    return selectedList.flatMap((p) => Array.from({ length: n }, () => p))
  }, [selectedList, copies])

  const doPrint = () => {
    if (labels.length === 0) { toast.error('Chọn ít nhất một sản phẩm.'); return }
    printLabels(labels)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.7.7"
        title="In tem mã vạch"
        subtitle="Chọn sản phẩm và in tem nhãn mã vạch cho hàng hóa."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={source === 'backend' ? 'green' : 'amber'} dot>
              {source === 'backend' ? 'Dữ liệu backend' : 'Dữ liệu demo'}
            </Badge>
            <Field label="" className="w-24"><Input type="number" min="1" value={copies} onChange={(e) => setCopies(e.target.value)} title="Số bản/nhãn" /></Field>
            <Button icon={Printer} onClick={doPrint} disabled={labels.length === 0}>In {labels.length > 0 ? `(${labels.length})` : ''}</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Selector */}
        <Card>
          <CardBody>
            <FilterBar>
              <Field label="Tìm sản phẩm" className="grow">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input className="pl-9" placeholder="Tên / mã / barcode..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </Field>
              <div className="flex items-end gap-2">
                <Button variant="secondary" size="sm" onClick={selectAll}>Chọn tất cả</Button>
                <Button variant="ghost" size="sm" onClick={clear}>Bỏ chọn</Button>
              </div>
            </FilterBar>
            <div className="max-h-[480px] divide-y divide-slate-100 overflow-y-auto">
              {rows.length === 0 ? (
                <EmptyState icon={BarcodeIcon} title="Không có sản phẩm" />
              ) : rows.map((p) => {
                const on = !!selected[p.code]
                return (
                  <button key={p.code} onClick={() => toggle(p.code)} className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-slate-50">
                    {on ? <CheckSquare size={18} className="text-brand-600" /> : <Square size={18} className="text-slate-300" />}
                    <div className="grow">
                      <p className="text-sm font-medium text-slate-700">{p.name}</p>
                      <p className="font-mono text-xs text-slate-400">{p.barcode || p.code}</p>
                    </div>
                    <span className="text-sm text-slate-500">{formatCurrency(p.price)}</span>
                  </button>
                )
              })}
            </div>
          </CardBody>
        </Card>

        {/* Preview */}
        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Xem trước tem ({selectedList.length} sản phẩm)</p>
            </div>
            {selectedList.length === 0 ? (
              <EmptyState icon={Printer} title="Chưa chọn sản phẩm" subtitle="Chọn sản phẩm bên trái để xem tem." />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {selectedList.map((p) => (
                  <div key={p.code} className="rounded-lg border border-slate-200 p-3 text-center">
                    <p className="mb-1 h-8 overflow-hidden text-xs font-semibold text-slate-700">{p.name}</p>
                    <Barcode value={p.barcode || p.code} />
                    <p className="mt-1 font-mono text-xs tracking-wider">{p.barcode || p.code}</p>
                    <p className="text-sm font-bold text-slate-800">{formatCurrency(p.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
