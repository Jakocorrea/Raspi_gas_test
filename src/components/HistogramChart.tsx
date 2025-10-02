import ReactECharts from 'echarts-for-react'
import { useStore } from '../store'
import { useMemo } from 'react'

export default function HistogramChart() {
  const samples = useStore(s => s.samples)
  const { tMin, tMax } = useStore()

  const option = useMemo(()=>{
    const vals = samples.map(s=>s.value)
    const bins = 20
    const min = tMin, max = tMax
    const width = (max - min) / bins
    const counts = Array(bins).fill(0)
    for (const v of vals) {
      const idx = Math.max(0, Math.min(bins-1, Math.floor((v - min)/width)))
      counts[idx]++
    }
    const x = Array(bins).fill(0).map((_,i)=> (min + i*width).toFixed(1))
    return {
      animation:false,
      grid: { left: 40, right: 20, top: 20, bottom: 40 },
      xAxis:{ type:'category', data: x },
      yAxis:{ type:'value' },
      tooltip:{ trigger:'axis' },
      series:[{ type:'bar', data: counts }]
    }
  }, [samples, tMin, tMax])

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Histograma (rango visible)</h3>
      <ReactECharts style={{ height: 240 }} option={option}/>
    </div>
  )
}
