# Thenvyx Tech — Backend Setup Guide

## 📁 Folder Structure

```
thenvyx-backend/
├── server.js          ← Express server (main file)
├── script.js          ← Updated frontend script (API call பண்றது)
├── .env.example       ← Environment variables template
├── .gitignore         ← .env-ஐ Git-ல போகாம தடுக்கும்
├── package.json
└── README.md
```

---

## 🔧 Step 1 — Gmail App Password எடுக்கணும்

உங்க regular Gmail password வேலை செய்யாது. App Password வேணும்:

1. **Google Account** → [myaccount.google.com](https://myaccount.google.com) போங்க
2. **Security** → **2-Step Verification** ON பண்ணுங்க (இல்லன்னா App Password வராது)
3. **Security** → Search bar-ல **"App passwords"** type பண்ணுங்க
4. App name: `Thenvyx Website` → **Create** → **16-digit password** கிடைக்கும்
5. அந்த password-ஐ copy பண்ணுங்க (ஒரே ஒரு தடவைதான் காட்டும்!)

---

## 🔧 Step 2 — .env File Setup

```bash
# .env.example ஐ copy பண்ணி .env create பண்ணுங்க
cp .env.example .env
```

`.env` file-ஐ திறந்து fill பண்ணுங்க:

```env
GMAIL_USER=teamthenvyx@gmail.com
GMAIL_APP_PASS=abcd efgh ijkl mnop    ← உங்க 16-digit App Password
PORT=3000
```

---

## 🚀 Step 3 — Server Start பண்ணுங்க

```bash
# Dependencies install (first time மட்டும்)
npm install

# Server start
npm start

# Development mode (auto-restart)
npm run dev
```

Terminal-ல இது வந்தா சரியா இருக்கு:
```
🚀 Thenvyx Backend running at http://localhost:3000
```

---

## 🌐 Step 4 — Frontend Connect பண்ணுங்க

உங்க website folder-ல **script.js** ஐ இந்த backend-ல இருக்கற `script.js` கொண்டு replace பண்ணுங்க.

> **Note:** Production-ல deploy பண்ணும்போது `script.js`-ல URL மாத்துங்க:
> ```js
> // இப்போ:
> fetch('http://localhost:3000/api/contact', ...)
>
> // Production (உங்க server URL):
> fetch('https://your-domain.com/api/contact', ...)
> ```

---

## 📧 Email Flow

```
User fills form
      ↓
POST /api/contact
      ↓
    Backend validates
      ↓
  ┌───────────────────────┐
  │  Email 1: Admin alert │  → teamthenvyx@gmail.com
  │  Email 2: Auto-reply  │  → User's email
  └───────────────────────┘
      ↓
  JSON response → Frontend shows success/error
```

---

## 🌍 Free Deployment Options

| Platform   | Steps |
|------------|-------|
| **Railway** | `railway up` — Easiest, free tier available |
| **Render**  | GitHub connect, auto-deploy |
| **Fly.io**  | `fly launch` |

### Railway Deployment (Easiest):
```bash
# Railway CLI install
npm install -g @railway/cli

# Login & deploy
railway login
railway init
railway up

# Environment variables Railway dashboard-ல add பண்ணுங்க
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `Invalid login` error | App Password சரியா இருக்கா check பண்ணுங்க |
| `Connection refused` | Server running-ஆ? `npm start` பண்ணுங்க |
| CORS error | `server.js`-ல origin update பண்ணுங்க |
| Email not received | Spam folder check பண்ணுங்க |

---

© 2026 Thenvyx Tech
