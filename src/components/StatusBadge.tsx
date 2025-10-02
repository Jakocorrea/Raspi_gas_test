import { useStore } from '../store'

export default function StatusBadge() {
  const { connected, latencyMs } = useStore()
  const color = connected === 'connected' ? 'bg-emerald-500' : connected === 'reconnecting' ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`}></span>
      <span className="text-sm">{connected}</span>
      <span className="text-xs text-zinc-500"> {latencyMs!=null ? `• ${latencyMs} ms` : ''}</span>
    </div>
  )
}
