import ReactECharts from 'echarts-for-react'
import { useStore } from '../store'
import { useStats } from '../hooks/useStats'
import { useMemo } from 'react'

export default function GaugeChart() {
  const { tMin, tMax, alertLow, alertHigh } = useStore()
  const { current } = useStats()
  const option = useMemo(()=>({
    animation:false,
    series:[{
      type:'gauge',
      min: tMin,
      max: tMax,
      splitNumber: 5,
      axisLine:{ lineStyle:{ width: 12 } },
      detail:{ valueAnimation:false, formatter:'{value}°C', fontSize:18 },
      data:[{ value: current ?? 0 }],
      axisLabel:{},
      pointer:{ width: 5 },
      markArea: {
        silent:true,
        itemStyle:{ color: 'transparent' },
        data:[]
      }
    }],
    // Nota: ECharts gauge no soporta bandas coloreadas por defecto; simplificado
  }), [current, tMin, tMax, alertLow, alertHigh])

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Gauge</h3>
      <ReactECharts style={{ height: 240 }} option={option} />
    </div>
  )
}
