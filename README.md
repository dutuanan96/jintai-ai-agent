# 🤖 JinTai AI Agent

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> B2B AI Chatbot for Furniture Manufacturing — Built for [Jintai Furniture](https://jintai.com) factory workers to query BOM data, compare products, and translate technical documents.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **BOM Query** | Query Bill of Materials for 22 LGS products with real-time data |
| ⚖️ **Product Comparison** | Compare two products side-by-side with similarity scoring |
| 🌐 **Multi-language** | Vietnamese, English, Chinese support with auto-detection |
| 📊 **Excel Export** | Export BOM data to styled Excel files |
| 🧠 **Auto-learning** | AI remembers user preferences across sessions |
| 🤖 **Tool Calling** | AI autonomously decides which tools to use |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  App.jsx → Sidebar | MessageBubble | ToolCard       │
│  ModelSelector | SettingsPage | Onboarding           │
│  i18n (vi/en/zh)                                    │
├─────────────────────────────────────────────────────┤
│                   SSE Stream (HTTP)                  │
├─────────────────────────────────────────────────────┤
│               Backend (FastAPI/Python)               │
│  server.py — Tool Calling Loop (max 3 rounds)       │
│  Session Management | Config Management             │
├─────────────────────────────────────────────────────┤
│                   Tools Layer                        │
│  bom_parser.py | comparator.py | translate_bom.py   │
├─────────────────────────────────────────────────────┤
│                  Data Layer (CSV)                    │
│  44 BOM files (22 SKUs × 2 languages)               │
│  terms_zh_vi.json (172 translation terms)           │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.14+ ([Download](https://www.python.org/downloads/))
- Git ([Download](https://git-scm.com/download/win))

### Installation

```bash
# Clone the repository
git clone https://github.com/dutuanan96/jintai-ai-agent.git D:\JinTai_AI_Agent
cd D:\JinTai_AI_Agent

# Install dependencies
pip install -r requirements.txt

# Start the server
python web\backend\server.py
```

Open [http://localhost:8001](http://localhost:8001) in your browser.

### Auto-Start on Boot (Recommended)

```bash
# Press Windows + R, type: shell:startup
# Copy jintai-agent.vbs to the Startup folder
```

## ⚙️ Configuration

### API Key Setup

1. Open [http://localhost:8001](http://localhost:8001)
2. Click ⚙️ **Settings** in the header
3. Enter your OpenRouter API key ([Get free key](https://openrouter.ai/keys))
4. Click **Save**

### Supported Models

| Model | Provider | Cost |
|-------|----------|------|
| OWL Alpha | OpenRouter | Free |
| MiMo V2.5 | OpenRouter | $0.013/1M tokens |
| DeepSeek V4 | OpenRouter | $0.068/1M tokens |
| Gemini 2.5 Flash | Google | Free |
| Gemini 2.5 Pro | Google | Tiered |

## 📦 Supported Products

| Category | Products |
|----------|----------|
| **TV Stands** | LGS031, LGS032, LGS043, LGS131, LGS132, LGS231, LGS232, LGS420, LGS421 |
| **Drawer Dressers** | LGS033, LGS133, LGS233, LGS333, LGS334, LGS433, LGS434, LGS723, LGS733, LGS833, LGS834 |
| **End Tables** | LGS101 (single), LGS111 (double pack) |

## 🔄 Updates

```bash
# Double-click update.bat
# Or manually:
git pull
pip install -r requirements.txt
```

User data (sessions, memory, config) is preserved during updates.

## 🛠️ Tech Stack

- **Backend**: FastAPI + uvicorn + litellm
- **Frontend**: React 18 + Vite + Tailwind CSS
- **LLM**: OpenRouter (owl-alpha, free tier)
- **Data**: CSV-based BOM storage
- **i18n**: Custom translation engine (VI/EN/ZH)

## 📁 Project Structure

```
JinTai_AI_Agent/
├── web/
│   ├── backend/server.py      # FastAPI backend (~800 lines)
│   └── frontend/              # React + Vite app
│       ├── src/App.jsx        # Main component
│       └── src/components/    # UI components
├── tools/
│   ├── bom_parser.py          # BOM CSV parser
│   ├── comparator.py          # Product comparator
│   └── translate_bom.py       # ZH→VI translator
├── data/
│   └── sample_bom/            # 44 BOM CSV files
├── setup.bat                  # Auto-install
├── update.bat                 # Auto-update
└── requirements.txt           # Python dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Du Tuấn An (俞俊安)**
- GitHub: [@dutuanan96](https://github.com/dutuanan96)
- Kaggle Capstone 2026

---

<p align="center">
  Built with ❤️ for <strong>Jintai Furniture (金汰家具)</strong> factory
</p>
