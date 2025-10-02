import dayjs from 'dayjs'
import { useStore } from '../store'
import { useMemo } from 'react'

export default function AlertsPanel() {
  const alerts = useStore(s => s.alerts)
  const active = alerts.filter(a => !a.tEnd)
  const last = useMemo(()=> alerts[alerts.length-1], [alerts])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Alertas</h3>
        <div className="text-sm text-zinc-500">{active.length>0 ? '⚠️ Activas' : 'Sin alertas activas'}</div>
      </div>

      {last ? (
        <div className="mb-3 p-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-100/10 dark:border-amber-400/50">
          <div className="text-sm font-medium">
            Último evento: {last.type.replaceAll('_',' ')}
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            {dayjs(last.tStart).format('HH:mm:ss')} {last.tEnd ? `→ ${dayjs(last.tEnd).format('HH:mm:ss')}` : '(activo)'}
          </div>
        </div>
      ) : <div className="text-sm text-zinc-500">No hay eventos.</div>}

      <div className="max-h-48 overflow-auto pr-2">
        <table className="w-full text-sm">
          <thead className="text-zinc-500">
            <tr><th className="text-left">Tipo</th><th>Inicio</th><th>Fin</th><th>Pico</th></tr>
          </thead>
          <tbody>
            {alerts.map(a=>(
              <tr key={a.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="py-1">{a.type}</td>
                <td className="text-center">{dayjs(a.tStart).format('HH:mm:ss')}</td>
                <td className="text-center">{a.tEnd ? dayjs(a.tEnd).format('HH:mm:ss') : '—'}</td>
                <td className="text-center">{a.peak?.toFixed(2) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
