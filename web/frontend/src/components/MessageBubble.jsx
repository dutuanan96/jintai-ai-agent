export default function MessageBubble({ role, content, dark, streaming }) {
  const isUser = role === 'user'
  const isMarkdown = role === 'assistant' && !streaming

  // Simple markdown-like rendering for assistant messages
  const renderContent = () => {
    if (!isMarkdown) return content

    let html = content
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const langLabel = lang ? `<span class="text-[10px] uppercase tracking-wider opacity-60 mb-1 block">${lang}</span>` : ''
        return `<div class="rounded-lg my-2 overflow-hidden" style="background:#0f172a">
          <div class="flex items-center justify-between px-3 py-1.5" style="background:#1e293b">
            ${langLabel}
            <button onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)"
                    class="text-[10px] px-2 py-0.5 rounded hover:bg-[#334155] transition-colors"
                    style="color:#64748b">Copy</button>
          </div>
          <pre class="p-3 text-sm overflow-x-auto"><code>${escapeHtml(code)}</code></pre>
        </div>`
      })
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-sm" style="background:#1e293b">$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="underline" style="color:#60a5fa">$1</a>')
      // Lists
      .replace(/^- (.+)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4 list-decimal">$2</li>')
      // New lines
      .replace(/\n/g, '<br>')

    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-message`}>
      <div
        className="max-w-[75%] px-4 py-2.5 text-sm leading-relaxed"
        style={{
          background: isUser ? '#2563eb' : '#1e293b',
          color: isUser ? '#ffffff' : '#e2e8f0',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          ...(streaming ? { borderRight: '2px solid #3b82f6' } : {}),
        }}
      >
        {isUser ? (
          <span>{content}</span>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  )
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}