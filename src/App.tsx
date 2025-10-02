import Header from './components/Header'
import ControlPanel from './components/ControlPanel'
import KPIGrid from './components/KPIGrid'
import TimeChart from './components/TimeChart'
import GaugeChart from './components/GaugeChart'
import HistogramChart from './components/HistogramChart'
import Timeline from './components/Timeline'
import AlertsPanel from './components/AlertsPanel'
import { useTheme } from './hooks/useTheme'
import { useWebSocket } from './hooks/useWebSocket'
import { useEffect } from 'react'
import { useStore } from './store'

export default function App() {
  useTheme()
  useWebSocket()
  const addTimeline = useStore(s => s.addTimeline)

  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        addTimeline({ id: crypto.randomUUID(), t: Date.now(), kind: 'MARK', message: 'Marca manual' })
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [addTimeline])

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Header/>
      <div className="grid gap-4">
        <ControlPanel/>
        <KPIGrid/>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><TimeChart/></div>
          <GaugeChart/>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <HistogramChart/>
          <AlertsPanel/>
        </div>
        <Timeline/>
      </div>
    </div>
  )
}
