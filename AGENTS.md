# 🕷️ SHUBHAM MUNDE DYNAMIC PORTFOLIO — AGENT KNOWLEDGE BASE

> **CRITICAL FOR AI ASSISTANTS**: Read this file first upon opening this workspace to instantly understand the complete architecture, deployed URLs, components, database schemas, and CI/CD workflow.

---

## 📌 Project Overview
- **Owner**: Shubham Munde
- **Email**: `mundeshubham002@gmail.com`
- **Role**: Software Engineer / Full Stack Developer
- **GitHub**: [munde87/dynamic_portfolio](https://github.com/munde87/dynamic_portfolio)

---

## 🌐 Live Production Infrastructure & Deployment URLs

| Service | Hosting Platform | Live URL / Target | CI/CD Trigger |
| :--- | :--- | :--- | :--- |
| **Frontend SPA** | **Vercel** | [https://dynamic-portfolio-bice.vercel.app](https://dynamic-portfolio-bice.vercel.app/) | Auto-deploys on `git push origin main` |
| **Backend API** | **Render** | [https://dynamic-portfolio-w1r4.onrender.com](https://dynamic-portfolio-w1r4.onrender.com/) | Auto-deploys on `git push origin main` |
| **Database** | **MongoDB Atlas** | Connected via `MONGO_URI` | Live Production Cluster |
| **Source Code** | **GitHub** | [https://github.com/munde87/dynamic_portfolio.git](https://github.com/munde87/dynamic_portfolio.git) | `main` branch |

---

## 🛠️ Technology Stack

### Frontend Architecture (`/frontend`)
- **Core**: React 18 (Vite SPA build)
- **Styling**: Tailwind CSS with custom Spider-Man color tokens (`spider-red`, `spider-blue`, `spider-night`)
- **Animations**: Framer Motion (page transitions, spring reveals, scroll triggers) & Lenis (smooth inertial scrolling)
- **3D Graphics**: Three.js + React Three Fiber + `@react-three/drei` (Spider-Man 3D GLB model with 360° `OrbitControls` drag/touch rotation)
- **Icons & UI**: Lucide React + Canvas Confetti + Custom Cursor & HUD Overlay

### Backend Architecture (`/backend`)
- **Core**: Node.js + Express.js (RESTful API architecture)
- **Database**: MongoDB Atlas via Mongoose ORM
- **Authentication**: JWT & Cookie-parser (Admin Panel authentication)
- **File Uploads**: Cloudinary + Multer (Image & 3D Model uploads)
- **Email Delivery**: Dual-engine dispatch (Formspree HTTPS relay + Nodemailer SMTP to `mundeshubham002@gmail.com`)

---

## 📁 Key File Map

```
portfolio/
├── frontend/
│   ├── public/
│   │   ├── models/spiderman.glb    # 18.6 MB High-poly 3D Character Model
│   │   ├── robots.txt              # Search Engine Crawling Directive
│   │   └── sitemap.xml             # Google Sitemap Specification
│   ├── src/
│   │   ├── components/
│   │   │   ├── Three/
│   │   │   │   ├── Scene.jsx       # R3F Canvas, OrbitControls, 60 FPS DPR scaling
│   │   │   │   └── SpiderModel.jsx # Memoized GLTF loader & floating animation
│   │   │   ├── Navbar.jsx          # Mobile centered capsule header & menu drawer
│   │   │   ├── Hero.jsx            # Headline reveal, CTA buttons, social links
│   │   │   ├── Skills.jsx          # Arsenal grid & mobile filter chips
│   │   │   ├── Projects.jsx        # Project showcase (Acadex & Tumhara Arogya)
│   │   │   ├── Experience.jsx      # Hackathon collage grid & full-screen Lightbox
│   │   │   ├── Contact.jsx         # Non-blocking form & break-all email card
│   │   │   └── HUDOverlay.jsx      # Telemetry floating widget
│   │   ├── data/profile.js         # Core profile details, skills & project links
│   │   └── utils/api.js            # Axios client configured with VITE_API_URL
│   └── vercel.json                 # Vercel SPA rewrite rules
├── backend/
│   ├── config/db.js                # MongoDB Atlas connection pool
│   ├── controllers/
│   │   ├── contactController.js    # Non-blocking instant form API & email dispatch
│   │   ├── heroController.js       # Auto-migration for subRole tagline
│   │   └── projectController.js    # Acadex & Tumhara Arogya project endpoints
│   ├── models/
│   │   ├── ContactMessage.js       # Customer inquiry schema (no unique index)
│   │   ├── Visitor.js              # Visitor tracking schema
│   │   └── Hero.js                 # Hero section dynamic data
│   ├── server.js                   # Express server, CORS, security & health check
│   └── package.json                # Dependencies with legacy-peer-deps configured
└── AGENTS.md                       # Master AI Knowledge Base
```

---

## ⚡ Automated CI/CD & Deployment Instructions

### How to Make & Deploy Any Code Changes
To modify the website and automatically update both live production servers (Vercel and Render), run the following standard Git sequence:

```bash
# 1. Stage all changes
git add .

# 2. Commit with descriptive message
git commit -m "Update feature or fix layout"

# 3. Push to GitHub main branch
git push origin main
```

Upon `git push origin main`:
1. **Vercel** automatically detects the push and rebuilds the frontend at [https://dynamic-portfolio-bice.vercel.app](https://dynamic-portfolio-bice.vercel.app/).
2. **Render** automatically detects the push and rebuilds the backend API at [https://dynamic-portfolio-w1r4.onrender.com](https://dynamic-portfolio-w1r4.onrender.com/).

---

## 🔒 Key Rules for AI Assistants Working on this Workspace
1. **Preserve Visual Theme**: Do NOT alter Spider-Man visual elements, color scheme (`#E62429`, `#2563EB`, `#0B1120`), 3D Canvas, or Framer Motion animations.
2. **Mobile First Responsiveness**: Always test header capsule centering, button width (`w-full sm:w-auto`), and font sizing (`text-3xl sm:text-7xl break-words`) for narrow mobile screens.
3. **Fail-Safe Email Dispatch**: Ensure contact form requests in `contactController.js` always respond with HTTP 200 in `< 200ms` and handle background mail dispatch without blocking the UI.
4. **Clean Builds**: Always verify `npm run build` in `frontend` executes cleanly with zero syntax or bundling errors.
