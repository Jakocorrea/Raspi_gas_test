import { useMemo } from 'react'
import { useStore } from '../store'

export function useStats() {
  const samples = useStore(s => s.samples)
  return useMemo(() => {
    if (samples.length === 0) return { current: null, min: null, max: null, mean: null, std: null, lastAgeMs: null, trend: 0 }
    const vals = samples.map(s => s.value)
    const n = vals.length
    const mean = vals.reduce((a,b)=>a+b,0)/n
    const variance = vals.reduce((a,b)=>a+(b-mean)*(b-mean),0)/(n||1)
    const std = Math.sqrt(variance)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const current = vals[n-1]
    const lastAgeMs = Date.now() - samples[n-1].ts
    // tendencia vs últimos 60s
    const cutoff = Date.now() - 60000
    const past = samples.find(s => s.ts >= cutoff) ?? samples[0]
    const trend = current - past.value
    return { current, min, max, mean, std, lastAgeMs, trend }
  }, [samples])
}
