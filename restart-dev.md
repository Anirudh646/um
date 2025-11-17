# Fix for 401 Error - Restart Instructions

## The issue
The browser is using cached JavaScript code. The fixes are applied but need a fresh reload.

## Solution Steps:

### 1. Stop the Frontend Dev Server
- Press `Ctrl + C` in the terminal where `npm run dev` is running
- Or close the terminal window

### 2. Clear Browser Cache Completely
- Press `F12` to open Developer Tools
- Right-click the refresh button
- Select **"Empty Cache and Hard Reload"**
- OR go to Application tab → Clear storage → Clear site data

### 3. Restart the Dev Server
```bash
cd frontend
npm run dev
```

### 4. Test Student Login
- Click "Login" button
- Click "Student Login"  
- Enter: ID `2335000001`, Password `student001`
- Enter CAPTCHA
- Click Login

The 401 error should be gone!

