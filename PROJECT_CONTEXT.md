# 🤖 JinTai AI Agent — Project Context

## Overview
Web UI chatbot for Jintai Furniture (金汰家具) factory. Built for Du Tuấn An (俞俊安) — Kaggle Capstone project.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI (Python 3.14 on Windows)
- **LLM:** OpenRouter owl-alpha (free, tool calling)
- **Tools:** bom_parser.py, comparator.py
- **Data:** 22 LGS products (BOM CSV files)

## Project Location
```
D:\JinTai_AI_Agent\
├── start.bat              ← Double-click to run server
├── setup.bat              ← Auto-install for new machines
├── README.md              ← User guide
├── requirements.txt       ← Python dependencies
├── web/
│   ├── backend/server.py  ← FastAPI (all-in-one)
│   ├── frontend/          ← React + Vite
│   ├── config.json        ← Settings (API keys, language)
│   ├── sessions.json      ← Chat history (auto-created)
│   └── memory.json        ← Auto-learning memory (auto-created)
├── tools/
│   ├── bom_parser.py      ← Parse BOM CSV → structured data
│   └── comparator.py      ← Compare 2 BOMs → differences
└── data/
    └── sample_bom/        ← 22 BOM CSV files (VI + 中文)
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
9. ✅ Auto-start on boot (Startup folder)
10. ✅ Windows deployment (Python + setup.bat)

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
- `web/frontend/src/components/` — UI components

## Domain Knowledge
- 9 TV Stand products: LGS031, LGS032, LGS043, LGS131, LGS132, LGS231, LGS232, LGS420, LGS421
- 11 Drawer Dresser products: LGS033, LGS133, LGS233, LGS333, LGS334, LGS433, LGS434, LGS723, LGS733, LGS833, LGS834
- 2 End Table products: LGS101 (single), LGS111 (double pack)
- 铁件 = iron parts (Q195 material)
- 物料编码 = material code, 部件编号 = component code

## How to Run
```bash
cd D:\JinTai_AI_Agent
python web\backend\server.py
# Open http://localhost:8001
```

## Current Issues / TODO
- None critical — all features working

## Author
- Du Tuấn An (俞俊安)
- GitHub: dutuanan96
- Company: Jintai Furniture (金汰家具)
- Kaggle Capstone 2026
