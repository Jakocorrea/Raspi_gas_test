import { create } from 'zustand'

export type Sample = {
  ts: number
  value: number
  source?: string
}

type AlertEvent = {
  id: string
  type: 'ALERT_HIGH_START'|'ALERT_HIGH_END'|'ALERT_LOW_START'|'ALERT_LOW_END'
  tStart: number
  tEnd?: number
  peak?: number
  note?: string
}

type TimelineEvent = {
  id: string
  t: number
  kind: 'MARK'|'CONFIG'|'RECONNECT'|'ALERT'
  message: string
}

type State = {
  unit: 'C'|'F'
  theme: 'light'|'dark'
  wsUrl: string
  isPaused: boolean
  connected: 'connected'|'reconnecting'|'disconnected'
  latencyMs: number|null
  // data
  samples: Sample[] // buffer en memoria
  maxBufferMs: number
  // thresholds
  tMin: number
  tMax: number
  alertLow: number
  alertHigh: number
  hysteresis: number
  alertDelayS: number
  // alerts & timeline
  alerts: AlertEvent[]
  timeline: TimelineEvent[]
  demoMode: boolean

  setTheme: (t: State['theme']) => void
  setUnit: (u: State['unit']) => void
  setWsUrl: (u: string) => void
  setConnected: (c: State['connected']) => void
  setLatency: (ms: number|null) => void
  addSample: (s: Sample) => void
  setPaused: (p: boolean) => void
  addTimeline: (e: TimelineEvent) => void
  addAlert: (a: AlertEvent) => void
  updateAlert: (id: string, patch: Partial<AlertEvent>) => void
  setDemo: (d: boolean) => void
  setThresholds: (patch: Partial<Pick<State,'tMin'|'tMax'|'alertLow'|'alertHigh'|'hysteresis'|'alertDelayS'>>) => void
  clearData: () => void
}

const initialWsUrl = (() => {
  const qs = new URLSearchParams(location.search)
  const override = qs.get('ws')
  if (override) return override
  const stored = localStorage.getItem('wsUrl')
  if (stored) return stored
  const isHttps = location.protocol === 'https:'
  return isHttps ? (import.meta.env.VITE_WSS_URL || '') : (import.meta.env.VITE_WS_URL || '')
})()

export const useStore = create<State>((set, get) => ({
  unit: 'C',
  theme: (localStorage.getItem('theme') as State['theme']) || 'dark',
  wsUrl: initialWsUrl,
  isPaused: false,
  connected: 'disconnected',
  latencyMs: null,
  samples: [],
  maxBufferMs: 1000 * 60 * 30, // 30 min
  tMin: Number(import.meta.env.VITE_TEMP_MIN ?? 18),
  tMax: Number(import.meta.env.VITE_TEMP_MAX ?? 30),
  alertLow: Number(import.meta.env.VITE_ALERT_LOW ?? 19),
  alertHigh: Number(import.meta.env.VITE_ALERT_HIGH ?? 28),
  hysteresis: Number(import.meta.env.VITE_ALERT_HYSTERESIS ?? 0.5),
  alertDelayS: Number(import.meta.env.VITE_ALERT_DELAY_S ?? 5),
  alerts: [],
  timeline: [],
  demoMode: false,

  setTheme: (t) => { localStorage.setItem('theme', t); set({ theme: t }) },
  setUnit: (u) => set({ unit: u }),
  setWsUrl: (u) => { localStorage.setItem('wsUrl', u); set({ wsUrl: u }) },
  setConnected: (c) => set({ connected: c }),
  setLatency: (ms) => set({ latencyMs: ms }),
  addSample: (s) => {
    const now = s.ts
    const maxAge = get().maxBufferMs
    const samples = [...get().samples, s].filter(x => now - x.ts <= maxAge)
    set({ samples })
  },
  setPaused: (p) => set({ isPaused: p }),
  addTimeline: (e) => set({ timeline: [e, ...get().timeline].slice(0, 500) }),
  addAlert: (a) => set({ alerts: [...get().alerts, a] }),
  updateAlert: (id, patch) => set({ alerts: get().alerts.map(x => x.id === id ? { ...x, ...patch } : x) }),
  setDemo: (d) => set({ demoMode: d }),
  setThresholds: (patch) => set({ ...patch }),
  clearData: () => set({ samples: [], alerts: [], timeline: [] })
}))
