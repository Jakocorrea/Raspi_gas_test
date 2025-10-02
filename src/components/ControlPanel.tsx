import { useStore } from '../store'
import { useEffect, useState } from 'react'

export default function ControlPanel() {
  const wsUrl = useStore(s => s.wsUrl)
  const setWsUrl = useStore(s => s.setWsUrl)
  const unit = useStore(s => s.unit)
  const setUnit = useStore(s => s.setUnit)
  const isPaused = useStore(s => s.isPaused)
  const setPaused = useStore(s => s.setPaused)
  const demoMode = useStore(s => s.demoMode)
  const setDemo = useStore(s => s.setDemo)
  const thresholds = useStore(s => ({ tMin: s.tMin, tMax: s.tMax, alertLow: s.alertLow, alertHigh: s.alertHigh, hysteresis: s.hysteresis, alertDelayS: s.alertDelayS }))
  const setThresholds = useStore(s => s.setThresholds)

  const [localUrl, setLocalUrl] = useState(wsUrl)

  useEffect(() => setLocalUrl(wsUrl), [wsUrl])

  const isHttps = location.protocol === 'https:'
  const wsSchemeOk = !isHttps || localUrl.startsWith('wss://')

  return (
    <div className="card">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grow">
          <label className="block text-sm mb-1">WS/WSS URL</label>
          <input className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                 value={localUrl} onChange={e=>setLocalUrl(e.target.value)} placeholder="wss://tu-dominio" />
          {!wsSchemeOk && <p className="text-xs text-rose-500 mt-1">HTTPS requiere WSS</p>}
        </div>
        <button className="btn" onClick={()=> setWsUrl(localUrl)} disabled={!wsSchemeOk}>Guardar URL</button>
        <button className="btn" onClick={()=> setPaused(!isPaused)}>{isPaused ? '▶️ Continuar' : '⏸️ Pausar'}</button>
        <button className="btn" onClick={()=> setDemo(!demoMode)}>{demoMode ? '⛔ Salir Demo' : '🧪 Modo Demo'}</button>
        <div>
          <label className="block text-sm mb-1">Unidad</label>
          <select className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent" value={unit} onChange={e=>setUnit(e.target.value as any)}>
            <option value="C">°C</option>
            <option value="F">°F</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-3 mt-4">
        {(['tMin','tMax','alertLow','alertHigh','hysteresis','alertDelayS'] as const).map((k)=>(
          <div key={k}>
            <label className="block text-sm mb-1">{k}</label>
            <input type="number" step="0.1" className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                   value={(thresholds as any)[k]}
                   onChange={(e)=> setThresholds({ [k]: Number(e.target.value) } as any)} />
          </div>
        ))}
      </div>
    </div>
  )
}
