import { useState, useEffect, useRef, useCallback } from 'react'
import { Moon, Sun, ChevronLeft, Menu, Bot, Sparkles, Settings } from 'lucide-react'
import Sidebar from './components/Sidebar'
import ModelSelector from './components/ModelSelector'
import Onboarding from './components/Onboarding'
import ToolCard from './components/ToolCard'
import MessageBubble from './components/MessageBubble'
import SettingsPage from './components/SettingsPage'
import { setLanguage, t } from './i18n'

const API_BASE = '/api'

export default function App() {
  // ── State ──
  const [dark, setDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [toolsCalled, setToolsCalled] = useState([])
  const [model, setModel] = useState('openrouter/owl-alpha')
  const [provider, setProvider] = useState('openrouter')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showModelSelect, setShowModelSelect] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState(null)
  const chatRef = useRef(null)

  // ── Init ──
  useEffect(() => {
    loadSessions()
    const saved = localStorage.getItem('jintai-dark')
    if (saved !== null) setDark(saved === 'true')
    const savedModel = localStorage.getItem('jintai-model')
    if (savedModel) setModel(savedModel)
    const savedProvider = localStorage.getItem('jintai-provider')
    if (savedProvider) setProvider(savedProvider)
    const visited = localStorage.getItem('jintai-visited')
    if (visited) setShowOnboarding(false)
    
    // Load language from config
    fetch('/api/settings')
      .then(res => res.json())
      .then(config => {
        const lang = config.language || 'vi'
        setLanguage(lang)
      })
      .catch(() => setLanguage('vi'))
  }, [])

  // Apply dark class to body
  useEffect(() => {
    localStorage.setItem('jintai-dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // ── API ──
  const loadSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions`)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch { /* ignore */ }
  }

  const loadSession = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${id}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setCurrentSession(id)
      setShowOnboarding(false)
    } catch { /* ignore */ }
  }

  const newSession = () => {
    setMessages([])
    setCurrentSession(null)
    setStreamingText('')
    setToolsCalled([])
    setShowOnboarding(true)
    setError(null)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setShowOnboarding(false)
    localStorage.setItem('jintai-visited', 'true')

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setStreamingText('')
    setToolsCalled([])
    setError(null)

    let accumulated = ''
    let sessionId = currentSession

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          ...(sessionId ? { session_id: sessionId } : {}),
          model,
          provider,
        }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) {
              accumulated += data.text
              setStreamingText(accumulated)
            }
            if (data.tool) {
              setToolsCalled(prev => {
                const idx = prev.findIndex(t => t.name === data.tool)
                if (idx >= 0) {
                  // Create new object — never mutate state
                  const updated = prev.map((t, i) =>
                    i === idx ? { ...t, status: data.status } : t
                  )
                  return updated
                }
                return [...prev, { id: Date.now(), name: data.tool, status: data.status }]
              })
            }
            if (data.session_id) {
              sessionId = data.session_id
              setCurrentSession(sessionId)
              loadSessions()
            }
            if (data.error) {
              setError(data.error)
            }
          } catch { /* skip malformed */ }
        }
      }

      // Done streaming
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
      setStreamingText('')
      setIsLoading(false)
      loadSessions()

    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Render ──
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="flex h-screen"
         style={{ background: '#0b1121', color: '#e2e8f0' }}>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        sessions={sessions}
        currentSession={currentSession}
        onSelect={loadSession}
        onNew={newSession}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: '#1e293b', background: '#0f172a' }}>
          {(!sidebarOpen || isMobile) && (
            <button onClick={() => setSidebarOpen(true)}
                    className="p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors">
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <img src="/robot-logo.png" alt="Logo" className="w-10 h-10 object-contain rounded" />
            <span className="font-semibold text-sm">JinTai AI Agent</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 ml-1">金汰家具</span>
          </div>
          <div className="flex-1" />
          <button onClick={() => setShowModelSelect(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                             bg-[#1e293b] hover:bg-[#334155] transition-colors">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[#94a3b8]">{model.split('/').pop()}</span>
          </button>
          <button onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors">
            <Settings size={18} />
          </button>
        </header>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 && streamingText === '' && !isLoading ? (
            <Onboarding onClick={(q) => { setInput(q); setTimeout(() => sendMessage(), 100) }}
                        dark={dark} />
          ) : (
            <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-4xl mx-auto w-full">
              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} dark={dark} />
              ))}
              {toolsCalled.length > 0 && (
                <div className="space-y-2">
                  {toolsCalled.map(tool => (
                    <ToolCard key={tool.id} name={tool.name} status={tool.status} dark={dark} />
                  ))}
                </div>
              )}
              {streamingText && (
                <MessageBubble role="assistant" content={streamingText} dark={dark} streaming />
              )}
              {isLoading && !streamingText && (
                <div className="flex items-center gap-2 px-4 py-3 max-w-[70%] rounded-2xl rounded-bl-sm"
                     style={{ background: '#1e293b' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm animate-message"
                     style={{ background: '#450a0a', color: '#fca5a5', border: '1px solid #991b1b' }}>
                  ❌ {error}
                  <button onClick={sendMessage}
                          className="ml-3 underline hover:no-underline">Retry</button>
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="border-t px-4 py-3" style={{ borderColor: '#1e293b', background: '#0f172a' }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 rounded-xl px-4 py-2"
                   style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('input.placeholder')}
                  rows={1}
                  className="flex-1 bg-transparent outline-none resize-none text-sm py-1.5 max-h-[150px]"
                  style={{ color: '#e2e8f0', minHeight: '24px' }}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-lg transition-colors disabled:opacity-40"
                  style={{ background: input.trim() && !isLoading ? '#2563eb' : '#334155' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <div className="text-[10px]" style={{ color: '#64748b' }}>
                  {model.split('/').pop()} · {provider}
                </div>
                <div className="text-[10px]" style={{ color: '#475569' }}>
                  {t('input.new_line_hint')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Page */}
      {showSettings && (
        <div className="fixed inset-0 z-50" style={{ background: '#0b1121' }}>
          <div className="absolute top-4 right-4">
            <button onClick={() => setShowSettings(false)}
                    className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
                    style={{ color: '#94a3b8' }}>
              ✕
            </button>
          </div>
          <SettingsPage dark={dark} />
        </div>
      )}

      {/* Model Selector Modal */}
      {showModelSelect && (
        <ModelSelector
          currentModel={model}
          currentProvider={provider}
          onSelect={(m, p) => {
            setModel(m)
            setProvider(p)
            localStorage.setItem('jintai-model', m)
            localStorage.setItem('jintai-provider', p)
            setShowModelSelect(false)
          }}
          onClose={() => setShowModelSelect(false)}
          dark={dark}
        />
      )}
    </div>
  )
}