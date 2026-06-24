# 🤖 JinTai AI Agent

Trợ lý AI cho nhà máy nội thất 金汰家具 (Jintai Furniture)

## ✨ Tính năng
- Kiểm tra BOM (Bill of Materials)
- So sánh sản phẩm
- Dịch thuật tiếng Việt - Trung - Anh
- Xuất file Excel
- Chat với AI (OpenRouter owl-alpha - miễn phí)

## 📥 Cài đặt (3 bước)

### Bước 1: Cài Python
```
1. Tải Python: https://www.python.org/downloads/
2. Chạy file installer
3. ✅ QUAN TRỌNG: Check "Add Python to PATH"
4. Bấm "Install Now"
5. Restart máy
```

### Bước 2: Setup
```
Giải nén project ra D:\
Double-click setup.bat
```

### Bước 3: Tự động chạy khi mở máy
```
1. Nhấn Windows + R
2. Gõ: shell:startup
3. Copy file jintai-agent.vbs từ D:\JinTai_AI_Agent vào thư mục vừa mở
4. Restart máy
5. Server tự chạy nền, mở browser: http://localhost:8001
```

Đường dẫn Startup folder:
```
C:\Users\<tên_user>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```
(`<tên_user>` = tên đăng nhập Windows của người đó)

## ⚙️ Cài đặt API Key
```
1. Mở http://localhost:8001
2. Bấm nút ⚙️ Settings
3. Nhập OpenRouter API Key (miễn phí)
   - Đăng ký: https://openrouter.ai/
   - Lấy key: https://openrouter.ai/keys
4. Bấm Save
```

## 🔄 Tự động chạy khi mở máy
```
File jintai-agent.vbs trong Startup folder sẽ tự chạy server
khi đăng nhập Windows.
Server chạy nền, KHÔNG hiện terminal.
```

## 🛑 Dừng server
```
Mở Task Manager → tìm "python.exe" → End Task
```

## ❓ Lỗi thường gặp

**"Python not found":**
```
Cài Python + check "Add to PATH" + restart máy
```

**"No module named 'litellm'":**
```
Chạy lại: pip install -r requirements.txt
```

**"Port 8001 already in use":**
```
Task Manager → tìm "python.exe" → End Task
Rồi restart máy
```

**"API Error":**
```
Settings → kiểm tra API Key đã đúng chưa
```

## 📞 Liên hệ
- Tác giả: Du Tuấn An (俞俊安)
- GitHub: dutuanan96
