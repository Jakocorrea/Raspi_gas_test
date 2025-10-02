import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import { processAlert } from '../lib/alert-engine'

type Msg = { ts:number; temperature_c:number; source?:string }

export function useWebSocket() {
  const { wsUrl, isPaused, demoMode } = useStore()
  const setConnected = useStore(s => s.setConnected)
  const setLatency = useStore(s => s.setLatency)
  const addSample = useStore(s => s.addSample)
  const addTimeline = useStore(s => s.addTimeline)

  const socketRef = useRef<WebSocket|null>(null)
  const backoffRef = useRef(1000)

  useEffect(() => {
    if (demoMode) {
      setConnected('connected')
      let t0 = Date.now()
      const id = setInterval(() => {
        if (isPaused) return
        const t = Date.now()
        const seconds = (t - t0)/1000
        const base = 26 + 2 * Math.sin(seconds / 10 * Math.PI)
        const door = Math.random() < 0.02 ? 3 : 0
        const value = base + door + (Math.random()-0.5)*0.3
        const sample = { ts: t, value, source: 'demo' }
        addSample(sample)
        processAlert(sample.value, sample.ts)
      }, 1000)
      return () => clearInterval(id)
    }

    if (!wsUrl) { setConnected('disconnected'); return }

    let ws: WebSocket
    let pingTimer: number|undefined
    let pongTimeout: number|undefined

    function connect() {
      try {
        ws = new WebSocket(wsUrl)
      } catch {
        setConnected('disconnected')
        return
      }
      socketRef.current = ws
      setConnected('reconnecting')

      ws.onopen = () => {
        setConnected('connected')
        addTimeline({ id: crypto.randomUUID(), t: Date.now(), kind: 'RECONNECT', message: `Conectado a ${wsUrl}` })
        backoffRef.current = 1000
        // keepalive
        pingTimer = window.setInterval(() => {
          if (ws.readyState !== 1) return
          const t = Date.now()
          ws.send(JSON.stringify({ type: 'ping', t }))
          if (pongTimeout) window.clearTimeout(pongTimeout)
          pongTimeout = window.setTimeout(() => {
            try { ws.close() } catch {}
          }, 10000)
        }, 25000)
      }

      ws.onmessage = (ev) => {
        try {
          const msg: Msg|any = JSON.parse(ev.data)
          if ((msg as any).type === 'pong' && typeof msg.latency === 'number') {
            setLatency(msg.latency)
            if (pongTimeout) window.clearTimeout(pongTimeout)
            return
          }
          if (typeof (msg as any).ts === 'number' && typeof (msg as any).temperature_c === 'number') {
            const sample = { ts: msg.ts, value: msg.temperature_c as number, source: msg.source }
            if (!isPaused) {
              addSample(sample)
              processAlert(sample.value, sample.ts)
            }
          }
        } catch {}
      }

      ws.onclose = () => {
        setConnected('reconnecting')
        if (pingTimer) window.clearInterval(pingTimer)
        setTimeout(connect, Math.min(backoffRef.current, 30000))
        backoffRef.current *= 2
      }

      ws.onerror = () => {
        try { ws.close() } catch {}
      }
    }

    connect()
    return () => {
      if (pingTimer) window.clearInterval(pingTimer)
      if (pongTimeout) window.clearTimeout(pongTimeout)
      try { socketRef.current?.close() } catch {}
    }
  }, [wsUrl, isPaused, demoMode, addSample, setLatency, setConnected, addTimeline])

  return { }
}
