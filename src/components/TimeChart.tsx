import ReactECharts from 'echarts-for-react'
import { useStore } from '../store'
import { useMemo, useRef } from 'react'
import { lttb } from '../lib/downsampling'

export default function TimeChart() {
  const samples = useStore(s => s.samples)
  const { alertLow, alertHigh, tMin, tMax } = useStore()
  const ref = useRef<ReactECharts>(null)

  const data = useMemo(()=>{
    const arr = samples.map(s => ({ ts:s.ts, value:s.value }))
    const ds = arr.length>5000 ? lttb(arr, 2000) : arr
    return ds.map(p => [p.ts, p.value])
  }, [samples])

  const option = useMemo(()=>({
    animation: false,
    grid: { left: 48, right: 24, top: 24, bottom: 48 },
    xAxis: { type: 'time' },
    yAxis: { type: 'value', min: tMin, max: tMax },
    tooltip: { trigger: 'axis', axisPointer:{ type:'cross' } },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
    series: [
      {
        type: 'line',
        showSymbol: false,
        name: 'Temperatura',
        data
      },
      // bandas de umbral con markArea
      {
        type: 'line',
        data: [],
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(244,63,94,0.10)' },
          data: [[{ yAxis: alertHigh }, { yAxis: tMax }]]
        }
      },
      {
        type: 'line',
        data: [],
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(59,130,246,0.10)' },
          data: [[{ yAxis: 0 }, { yAxis: alertLow }]]
        }
      }
    ]
  }), [data, tMin, tMax, alertLow, alertHigh])

  function exportPng() {
    const inst = ref.current?.getEchartsInstance()
    if (!inst) return
    const url = inst.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
    const a = document.createElement('a')
    a.href = url
    a.download = `timechart-${Date.now()}.png`
    a.click()
  }

  function exportCsv() {
    const rows = [['ts','value']]
    for (const [ts, val] of data) rows.push([String(ts), String(val)])
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download=`series-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Serie temporal</h3>
        <div className="flex gap-2">
          <button className="btn" onClick={exportCsv}>⬇️ CSV</button>
          <button className="btn" onClick={exportPng}>🖼️ PNG</button>
        </div>
      </div>
      <ReactECharts ref={ref} style={{ height: 360 }} option={option} />
    </div>
  )
}
