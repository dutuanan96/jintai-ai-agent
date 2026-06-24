import { t } from '../i18n'

export default function Onboarding({ onClick, dark }) {
  const suggestions = [
    { icon: '📋', label: t('onboarding.check_bom'), query: 'Kiểm tra BOM LGS031' },
    { icon: '🔄', label: t('onboarding.compare_sp'), query: 'So sánh LGS031 và LGS032' },
    { icon: '🌐', label: t('onboarding.translate_bom'), query: 'Dịch BOM LGS031 sang tiếng Việt' },
    { icon: '🏷️', label: t('onboarding.list_sp'), query: 'Liệt kê tất cả sản phẩm có sẵn' },
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden"
             style={{ background: 'transparent' }}>
          <img src="/logo.png" alt="JinTai AI Agent" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#f1f5f9' }}>
          JinTai AI Agent
        </h1>
        <p className="text-sm mb-8" style={{ color: '#64748b' }}>
          {t('onboarding.greeting')}
        </p>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onClick(s.query)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all
                         hover:scale-105 active:scale-95"
              style={{
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}