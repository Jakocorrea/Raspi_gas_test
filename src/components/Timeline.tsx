import dayjs from 'dayjs'
import { useStore } from '../store'

export default function Timeline() {
  const timeline = useStore(s => s.timeline)
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Timeline</h3>
        <button className="btn" onClick={()=>{
          const rows = [['t','kind','message'], ...timeline.map(e=>[String(e.t), e.kind, e.message])]
          const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href=url; a.download=`timeline-${Date.now()}.csv`; a.click()
          URL.revokeObjectURL(url)
        }}>⬇️ CSV</button>
      </div>
      <ul className="space-y-2 max-h-64 overflow-auto pr-2">
        {timeline.map(item=>(
          <li key={item.id} className="flex items-start gap-2">
            <span className="text-xs text-zinc-500 w-40">{dayjs(item.t).format('HH:mm:ss.SSS')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">{item.kind}</span>
            <span className="text-sm">{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
