import { Bot, CheckCircle, XCircle, Loader } from 'lucide-react'

const TOOL_ICONS = {
  bom_parser: '📋',
  comparator: '🔍',
  validator: '✅',
  file_search: '📁',
}

const TOOL_LABELS = {
  bom_parser: 'BOM Parser',
  comparator: 'Product Comparator',
  validator: 'SOP Validator',
  file_search: 'File Search',
}

export default function ToolCard({ name, status, dark }) {
  const icon = TOOL_ICONS[name] || '⚙️'
  const label = TOOL_LABELS[name] || name
  const isDone = status === 'done'
  const isError = status === 'error'

  return (
    <div className="animate-tool-card">
      <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs"
           style={{
             background: '#0f172a',
             border: '1px solid #1e293b',
           }}>
        <span className="text-base">{icon}</span>
        <span className="font-medium" style={{ color: '#e2e8f0' }}>{label}</span>
        <span className="text-[10px]" style={{ color: '#64748b' }}>·</span>
        {isDone ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : isError ? (
          <XCircle size={14} className="text-red-500" />
        ) : (
          <Loader size={14} className="text-blue-400 animate-spin" />
        )}
      </div>
    </div>
  )
}