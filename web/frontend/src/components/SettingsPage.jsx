import { useState, useEffect } from 'react'
import { Settings, Save, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage({ dark }) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showKeys, setShowKeys] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      setMessage('Settings saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error saving settings')
    }
    setSaving(false)
  }

  const updateApiKey = (provider, value) => {
    setConfig(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: { ...prev.providers[provider], api_key: value.trim() }
      }
    }))
  }

  if (loading) return <div className="p-8 text-center" style={{ color: '#64748b' }}>Loading...</div>
  if (!config) return <div className="p-8 text-center" style={{ color: '#ef4444' }}>Failed to load settings</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={24} style={{ color: '#e2e8f0' }} />
        <h1 className="text-xl font-semibold" style={{ color: '#f1f5f9' }}>Settings</h1>
      </div>

      {/* API Keys */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-4" style={{ color: '#94a3b8' }}>API Keys</h2>
        {Object.entries(config.providers || {}).map(([provider, data]) => (
          <div key={provider} className="mb-4 p-4 rounded-xl" style={{ background: '#1e293b' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{provider}</span>
              <span className="text-xs" style={{ color: '#64748b' }}>
                {data.models?.length || 0} models
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showKeys[provider] ? 'text' : 'password'}
                value={data.api_key || ''}
                onChange={(e) => updateApiKey(provider, e.target.value)}
                placeholder={`Enter ${provider} API key...`}
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: '#0f172a',
                  color: '#e2e8f0',
                  border: '1px solid #334155'
                }}
              />
              <button
                onClick={() => setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))}
                className="p-2 rounded-lg"
                style={{ color: '#64748b' }}
              >
                {showKeys[provider] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Language */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-4" style={{ color: '#94a3b8' }}>Language / Ngôn ngữ / 语言</h2>
        <select
          value={config.language || 'auto'}
          onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #334155'
          }}
        >
          <option value="auto">Auto (theo user) / Tự động / 自动</option>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
          <option value="zh">中文 (Tiếng Trung)</option>
        </select>
        <p className="text-xs mt-2" style={{ color: '#64748b' }}>
          {config.language === 'auto' && "AI sẽ trả lời bằng ngôn ngữ bạn viết"}
          {config.language === 'vi' && "AI luôn trả lời bằng tiếng Việt"}
          {config.language === 'en' && "AI always replies in English"}
          {config.language === 'zh' && "AI 总是用中文回复"}
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: saving ? '#334155' : '#2563eb',
            color: '#ffffff'
          }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {message && (
          <span className="text-sm" style={{ color: message.includes('Error') ? '#ef4444' : '#22c55e' }}>
            {message}
          </span>
        )}
      </div>
    </div>
  )
}