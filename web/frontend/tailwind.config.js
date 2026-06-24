/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#334155',
          text: '#94a3b8',
          'text-active': '#f1f5f9',
        },
        chat: {
          bg: '#0b1121',
          'bg-secondary': '#111827',
          bubble: {
            user: '#2563eb',
            'user-text': '#ffffff',
            ai: '#1e293b',
            'ai-text': '#e2e8f0',
          },
        },
        accent: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          success: '#22c55e',
          error: '#ef4444',
          warning: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
