import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

const API_BASE = '/api'

export default function ModelSelector({ currentModel, currentProvider, onSelect, onClose, dark }) {
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(currentProvider)
  const [selectedModel, setSelectedModel] = useState(currentModel)

  useEffect(() => {
    fetch(`${API_BASE}/models`)
      .then(res => res.json())
      .then(data => setProviders(data.providers || []))
      .catch(() => {})
  }, [])

  const handleSelect = () => {
    onSelect(selectedModel, selectedProvider)
  }

  const currentProviderData = providers.find(p => p.id === selectedProvider)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-[400px] max-w-[90vw] rounded-2xl p-5"
           style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h2 className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>Select Model</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1e293b] transition-colors"
                  style={{ color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Provider list */}
        <div className="space-y-2 mb-4">
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProvider(p.id)
                setSelectedModel(p.models[0]?.id || currentModel)
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: selectedProvider === p.id ? '#1e293b' : 'transparent',
                color: '#f1f5f9',
                border: selectedProvider === p.id ? '1px solid #334155' : '1px solid transparent',
              }}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>
                {p.models.length} models available
              </div>
            </button>
          ))}
        </div>

        {/* Model list for selected provider */}
        {currentProviderData && (
          <div className="space-y-1 mb-5">
            <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: '#475569' }}>
              Models
            </div>
            {currentProviderData.models.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between"
                style={{
                  background: selectedModel === m.id ? '#1e293b' : 'transparent',
                  color: selectedModel === m.id ? '#f1f5f9' : '#94a3b8',
                }}
              >
                <span>{m.name}</span>
                <span className="text-[10px]" style={{ color: '#64748b' }}>{m.cost}</span>
              </button>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={onClose}
                  className="flex-1 px-3 py-2 rounded-xl text-xs"
                  style={{ background: '#1e293b', color: '#94a3b8' }}>
            Cancel
          </button>
          <button onClick={handleSelect}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:opacity-90"
                  style={{ background: '#2563eb', color: 'white' }}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}