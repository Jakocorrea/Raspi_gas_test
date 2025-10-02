import StatusBadge from './StatusBadge'
import { useStore } from '../store'

export default function Header() {
  const theme = useStore(s => s.theme)
  const setTheme = useStore(s => s.setTheme)
  return (
    <header className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-500"></div>
        <h1 className="font-semibold text-xl">Terminal de Monitoreo</h1>
        <div className="ml-4"><StatusBadge/></div>
      </div>
      <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
      </button>
    </header>
  )
}
