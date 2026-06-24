# 🤖 JinTai AI Agent — Project Context

## Overview
B2B AI Chatbot for Jintai Furniture (金汰家具) factory. Built for Du Tuấn An (俞俊安) — Kaggle Capstone 2026.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI (Python 3.14 on Windows)
- **LLM:** OpenRouter owl-alpha (free, tool calling)
- **Tools:** bom_parser.py, comparator.py, translate_bom.py
- **Data:** 22 LGS products (44 BOM CSV files: VI + 中文)

## Project Location
```
D:\JinTai_AI_Agent\
├── setup.bat              ← Auto-install (double-click on new machine)
├── update.bat             ← Auto-update from GitHub
├── README.md              ← User guide (English)
├── PROJECT_CONTEXT.md     ← This file
├── requirements.txt       ← Python dependencies (6 packages)
├── LICENSE                ← MIT License
├── JinTai AI Agent.lnk    ← Desktop shortcut (opens Web UI)
├── jintai-agent.vbs       ← Auto-start on boot (copy to Startup)
├── robot-logo.ico         ← App icon
├── web/
│   ├── backend/server.py  ← FastAPI backend (~800 lines)
│   ├── frontend/          ← React + Vite
│   ├── config.json        ← Settings (API keys, language) [gitignored]
│   ├── sessions.json      ← Chat history (auto-created) [gitignored]
│   └── memory.json        ← Auto-learning memory (auto-created) [gitignored]
├── tools/
│   ├── bom_parser.py      ← Parse BOM CSV → structured data
│   ├── comparator.py      ← Compare 2 BOMs → differences
│   └── translate_bom.py   ← Translate BOM from 中文 to VI
└── data/
    ├── sample_bom/        ← 44 BOM CSV files (22 SKUs × 2 languages)
    ├── bom_database.json  ← Combined BOM database
    ├── terms_zh_vi.json   ← Chinese-Vietnamese dictionary
    └── terms_zh_vi_en.json← Chinese-Vietnamese-English dictionary
```

## Features Completed
1. ✅ Chat UI (dark mode, streaming responses)
2. ✅ Tool calling (bom_parser, comparator, memory, export_excel)
3. ✅ Auto-learning memory (AI saves user preferences)
4. ✅ Session persistence (JSON file)
5. ✅ i18n (Vietnamese/English/Chinese)
6. ✅ Export Excel (with copy to D:\)
7. ✅ Model selector (header button)
8. ✅ Settings page (API keys, language)
9. ✅ Auto-start on boot (VBScript + Startup folder)
10. ✅ Windows deployment (setup.bat auto-install)
11. ✅ 五金包 (hardware pack) codes in BOM data
12. ✅ GitHub repo with auto-update (update.bat)
13. ✅ Desktop shortcut with custom icon

## System Prompt (3 Layers)
- Layer 1: Core Instructions (language, safety, SKU, tools, domain knowledge)
- Layer 2: Persona (identity, tone)
- Layer 3: Memory (auto-learning)

## Key Code Files
- `web/backend/server.py` — FastAPI backend (~800 lines)
  - `/api/chat` — SSE streaming + tool calling loop
  - `/api/sessions` — Session management
  - `/api/settings` — Settings CRUD
  - `/api/download/{file}` — File download
- `web/frontend/src/App.jsx` — Main React app (~300 lines)
- `web/frontend/src/components/` — UI components (6 files)

## Domain Knowledge
- 9 TV Stand products: LGS031, LGS032, LGS043, LGS131, LGS132, LGS231, LGS232, LGS420, LGS421
- 11 Drawer Dresser products: LGS033, LGS133, LGS233, LGS333, LGS334, LGS433, LGS434, LGS723, LGS733, LGS833, LGS834
- 2 End Table products: LGS101 (single), LGS111 (double pack)
- 五金包 (hardware pack): Pre-packaged screws/bolts kit per product
  - WJBBH = for black/vintage wood colors
  - WJBWH = for white color
- 铁件 = iron parts (Q195 material)
- 物料编码 = material code, 部件编号 = component code

## How to Run
```bash
cd D:\JinTai_AI_Agent
python web\backend\server.py
# Open http://localhost:8001
```

## Deployment (New Machine)
1. Install Python 3.14+ (check "Add to PATH")
2. Copy D:\JinTai_AI_Agent to new machine
3. Double-click setup.bat
4. Restart computer → server auto-runs

## Current Issues / TODO
- None critical — all features working

## Author
- Du Tuấn An (俞俊安)
- GitHub: dutuanan96
- Company: Jintai Furniture (金汰家具)
- Kaggle Capstone 2026
