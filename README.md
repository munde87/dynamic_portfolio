# Dynamic Portfolio — Shubham Munde

Production-ready personal developer portfolio featuring interactive 3D WebGL graphics (Spider-Man 3D Model), Framer Motion micro-animations, MERN stack CMS backend, audio control system, and custom `.me` domain readiness.

---

## 🏗️ Project Architecture

```
portfolio/
├── frontend/             # React + Vite Single Page Application
│   ├── public/           # Static assets, sitemap.xml, robots.txt
│   │   ├── models/       # 3D Assets (spiderman.glb)
│   │   └── assets/       # Project graphics & resume PDF
│   ├── src/              # React components, Three.js engine, Data
│   ├── vercel.json       # Vercel SPA rewrite configuration
│   └── package.json
└── backend/              # Node.js + Express REST API Server
    ├── config/           # Database & Cloudinary config
    ├── controllers/      # Mongoose CRUD & auto-seeding controllers
    ├── models/           # Mongoose Data Schemas
    ├── routes/           # REST API Route handlers
    ├── uploads/          # Local static uploads fallback
    └── server.js         # Production Express server entrypoint
```

---

## ⚙️ Environment Variables Setup

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_token_key
CLIENT_URL=https://yourportfolio.vercel.app,https://yourdomain.me,http://localhost:5173
```

---

## 🚀 Production Deployment Guide

### 1. Backend Deployment (Render / Railway / Heroku)
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`.

### 2. Frontend Deployment (Vercel)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_API_URL` pointing to your deployed backend API URL (e.g. `https://your-backend.onrender.com/api`).

### 3. Custom Domain (.me Domain) Setup
1. Open your project dashboard in Vercel → **Settings** → **Domains**.
2. Add your custom domain (e.g. `yourdomain.me` and `www.yourdomain.me`).
3. Add the DNS CNAME/A records provided by Vercel in your domain registrar settings.
4. Update `CLIENT_URL` in your backend environment variables to include your `.me` domain.

---

## 🎮 3D Model Asset (`spiderman.glb`)
- **Location**: `frontend/public/models/spiderman.glb`
- **Route**: Served as a static public asset at `/models/spiderman.glb`.
- **Loading Component**: `frontend/src/components/Three/SpiderModel.jsx` via `@react-three/drei`'s `useGLTF`.
