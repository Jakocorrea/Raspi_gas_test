import { useStats } from '../hooks/useStats'
import { useStore } from '../store'
import { cToF } from '../lib/units'

function fmt(v:number|null, unit:'C'|'F') {
  if (v==null) return '—'
  const val = unit==='C'? v : cToF(v)
  return `${val.toFixed(2)} °${unit}`
}

export default function KPIGrid() {
  const unit = useStore(s => s.unit)
  const { current, min, max, mean, std, lastAgeMs, trend } = useStats()
  const trendIcon = trend>0.1 ? '↗' : trend<-0.1 ? '↘' : '→'
  return (
    <div className="grid md:grid-cols-5 gap-3">
      <div className="card">
        <div className="text-sm text-zinc-500">Actual</div>
        <div className="text-3xl font-semibold">{fmt(current, unit)} <span className="text-zinc-400 text-xl">{trendIcon}</span></div>
        <div className="text-xs text-zinc-500 mt-1">{lastAgeMs!=null ? `hace ${Math.round(lastAgeMs)} ms` : '—'}</div>
      </div>
      <div className="card"><div className="text-sm text-zinc-500">Mín</div><div className="text-2xl">{fmt(min, unit)}</div></div>
      <div className="card"><div className="text-sm text-zinc-500">Máx</div><div className="text-2xl">{fmt(max, unit)}</div></div>
      <div className="card"><div className="text-sm text-zinc-500">Media</div><div className="text-2xl">{fmt(mean, unit)}</div></div>
      <div className="card"><div className="text-sm text-zinc-500">Desv. Est.</div><div className="text-2xl">{std==null?'—':std.toFixed(2)}</div></div>
    </div>
  )
}
