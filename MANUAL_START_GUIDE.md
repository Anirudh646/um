# Manual Start Guide - UMS Application

## 📋 Prerequisites

### Backend Requirements:
- Python 3.12+ installed
- Virtual environment (venv) created and activated
- Flask and dependencies installed

### Frontend Requirements:
- Node.js and npm installed
- Frontend dependencies installed (`node_modules` folder exists)

---

## 🚀 Method 1: Using Batch Scripts (Easiest)

### Option A: Start Both Servers
1. Double-click **`start_servers.bat`** in the project root (`F:\ums`)
2. Two command windows will open automatically:
   - Backend server window
   - Frontend server window

### Option B: Start Backend Only
1. Double-click **`start_backend.bat`** in the project root
2. Backend will start at `http://127.0.0.1:5000`

---

## 🔧 Method 2: Manual Startup (Step-by-Step)

### **Step 1: Start Backend Server**

#### Open Command Prompt/Terminal and run:

```bash
# Navigate to project root
cd F:\ums

# Activate virtual environment
venv\Scripts\activate.bat

# Navigate to backend directory
cd backend

# Start Flask server
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**✅ Backend is running at:** `http://127.0.0.1:5000`

---

### **Step 2: Start Frontend Server**

#### Open a NEW Command Prompt/Terminal window and run:

```bash
# Navigate to frontend directory
cd F:\ums\frontend

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Frontend is running at:** `http://localhost:5173`

---

## 📝 Quick Command Reference

### **Backend Commands:**

```bash
# Navigate and activate venv
cd F:\ums
venv\Scripts\activate.bat
cd backend

# Run backend
python app.py
```

### **Frontend Commands:**

```bash
# Navigate to frontend
cd F:\ums\frontend

# Start dev server
npm run dev

# OR if you need to install dependencies first:
npm install
npm run dev
```

---

## 🔍 Verification Steps

1. **Check Backend:**
   - Open browser: `http://127.0.0.1:5000`
   - Should see Flask API response or JSON

2. **Check Frontend:**
   - Open browser: `http://localhost:5173`
   - Should see the UMS application homepage

---

## ⚠️ Troubleshooting

### **Backend Issues:**

#### Problem: `python: command not found`
**Solution:** Use full Python path or add Python to PATH
```bash
# Use full path (check your Python installation)
C:\Users\YourName\AppData\Local\Programs\Python\Python313\python.exe app.py
```

#### Problem: `No module named 'flask'`
**Solution:** Install dependencies
```bash
cd F:\ums
venv\Scripts\activate.bat
cd backend
pip install -r requirements.txt
```

#### Problem: `venv\Scripts\activate.bat` not found
**Solution:** Create virtual environment
```bash
cd F:\ums
python -m venv venv
venv\Scripts\activate.bat
cd backend
pip install -r requirements.txt
```

### **Frontend Issues:**

#### Problem: `npm: command not found`
**Solution:** Install Node.js from https://nodejs.org/

#### Problem: `node_modules` folder missing
**Solution:** Install dependencies
```bash
cd F:\ums\frontend
npm install
npm run dev
```

#### Problem: Port 5173 already in use
**Solution:** Use a different port
```bash
npm run dev -- --port 3000
```

---

## 🎯 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://127.0.0.1:5000
- **Backend Test:** http://127.0.0.1:5000/api/students

---

## 📌 Important Notes

1. **Keep Both Servers Running:**
   - Backend and Frontend must run simultaneously
   - Keep both terminal windows open
   - Don't close the terminal windows

2. **Order Matters:**
   - You can start backend and frontend in any order
   - But both must be running for full functionality

3. **Hot Reload:**
   - Frontend: Auto-refreshes on code changes (Vite)
   - Backend: Auto-reloads on code changes (Flask debug mode)

4. **Stopping Servers:**
   - Press `Ctrl + C` in each terminal window to stop

---

## 🔄 Restart Instructions

If you need to restart:

1. **Stop servers:** Press `Ctrl + C` in both terminal windows
2. **Restart Backend:** Follow Step 1 above
3. **Restart Frontend:** Follow Step 2 above

---

## 📞 Quick Start Summary

**Terminal 1 (Backend):**
```bash
cd F:\ums
venv\Scripts\activate.bat
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd F:\ums\frontend
npm run dev
```

**That's it! Your application is running! 🎉**

