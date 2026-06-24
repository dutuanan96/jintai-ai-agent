import { useState } from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { t } from '../i18n'

const SESSIONS_PER_PAGE = 20

export default function Sidebar({ open, sessions, currentSession, onSelect, onNew, onClose }) {
  const [showAll, setShowAll] = useState(false)
  if (!open) return null

  const displayedSessions = showAll ? sessions : sessions.slice(0, SESSIONS_PER_PAGE)
  const hasMore = sessions.length > SESSIONS_PER_PAGE

  return (
    <div className="flex flex-col h-full border-r shrink-0"
         style={{
           width: '280px',
           background: '#0f172a',
           borderColor: '#1e293b',
         }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: '#1e293b' }}>
        <button onClick={onNew}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                           hover:bg-[#1e293b] active:scale-95"
                style={{ color: '#e2e8f0' }}>
          <Plus size={18} />
          {t('sidebar.new_chat')}
        </button>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors"
                style={{ color: '#64748b' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {displayedSessions.length === 0 ? (
          <div className="text-center py-8 text-xs" style={{ color: '#475569' }}>
            {t('sidebar.no_conversations')}
          </div>
        ) : (
          <>
            {displayedSessions.map(s => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-start gap-2.5"
                style={{
                  background: s.id === currentSession ? '#1e293b' : 'transparent',
                  color: s.id === currentSession ? '#f1f5f9' : '#94a3b8',
                }}
                onMouseEnter={e => { if (s.id !== currentSession) e.currentTarget.style.background = '#1e293b55' }}
                onMouseLeave={e => { if (s.id !== currentSession) e.currentTarget.style.background = 'transparent' }}
              >
                <MessageSquare size={16} className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium">{s.title}</div>
                  <div className="text-[10px] mt-0.5 truncate" style={{ color: '#475569' }}>
                    {s.preview || `${s.message_count} messages`}
                  </div>
                </div>
              </button>
            ))}
            {hasMore && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-center py-2 text-xs rounded-lg transition-colors hover:bg-[#1e293b]"
                style={{ color: '#64748b' }}
              >
                {t('sidebar.show_more', { count: sessions.length - SESSIONS_PER_PAGE })}
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-center" style={{ borderColor: '#1e293b' }}>
        <div className="text-xs font-medium" style={{ color: '#e2e8f0' }}>
          JinTai AI Agent · 金汰家具
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: '#f1f5f9' }}>
          Du Tuấn An（俞俊安）
        </div>
      </div>
    </div>
  )
}