# Unfazed — Practice Management Platform for Therapists in India

**Unfazed** is a premium, calm, privacy-first SaaS platform designed specifically for therapists in India to manage their practice, streamline client bookings, and maintain confidential clinical workflows.

---

## 🏗 Project Architecture

```text
unfazed/
├── unfazed-backend/              # Node.js + Express + MongoDB REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Mongoose connection with dev fallback
│   │   ├── controllers/
│   │   │   ├── authController.js       # Register, Login, Me handlers
│   │   │   └── therapistController.js  # Profile get/update, Public slug profile
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT protection middleware
│   │   │   └── errorMiddleware.js      # Centralized error handler & 404
│   │   ├── models/
│   │   │   └── Therapist.js            # Mongoose Schema for therapist practices
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # /api/auth routes
│   │   │   └── therapistRoutes.js      # /api/therapists routes
│   │   ├── services/
│   │   │   └── therapistService.js     # Data layer with MongoDB + resilient dev fallback
│   │   ├── utils/
│   │   │   └── generateSlug.js         # URL-friendly slug generator (e.g. dr-ananya-sharma)
│   │   ├── app.js                      # Express application configuration & CORS
│   │   ├── server.js                   # Server bootstrap & listener
│   │   ├── seed.js                     # Seed script for Dr. Ananya Sharma
│   │   └── test_api.js                 # Automated API test suite
│   ├── .env.example
│   ├── .env
│   └── package.json
│
└── unfazed-frontend/             # React + Vite + Tailwind CSS Client
    ├── src/
    │   ├── api/
    │   │   └── axios.js                # Axios client with Bearer token interceptor
    │   ├── components/
    │   │   └── common/
    │   │       ├── Button.jsx          # Reusable Button (Primary, Secondary, Danger, Icon)
    │   │       ├── Input.jsx           # Reusable Input with label, errors & password toggle
    │   │       ├── Loader.jsx          # Accessible spinner
    │   │       ├── Toast.jsx           # Timed floating toast notifications
    │   │       ├── Sidebar.jsx         # 252px desktop sidebar & mobile drawer
    │   │       └── Topbar.jsx          # Topbar with title, search, notifications & avatar
    │   ├── context/
    │   │   └── AuthContext.jsx         # User auth provider, token storage & methods
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx           # Split-screen login with demo credentials autofill
    │   │   │   └── Register.jsx        # Therapist registration with validation & terms
    │   │   ├── therapist/
    │   │   │   └── Dashboard.jsx       # Overview, public URL copy card, profile editor
    │   │   └── public/
    │   │       └── PublicProfile.jsx   # /:slug public profile (Hero, About, Services, FAQ)
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx      # Unauthenticated redirect to /login
    │   ├── App.jsx                     # Router declaration
    │   ├── index.css                   # Tailwind v4 @theme design tokens
    │   └── main.jsx                    # React entrypoint
    ├── index.html                      # Includes Inter & DM Serif Display Google Fonts
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🎨 Design Tokens & Visual Language

- **Primary Indigo:** `#3730A3` (CTAs, active links)
- **Primary Hover:** `#312E81`
- **Sage Green:** `#84A98C` (Healing & positive accents)
- **Soft Sage:** `#EAF3EC` (Supportive badges)
- **Warm Ivory:** `#FAF9F6` (Global page background)
- **Surface White:** `#FFFFFF` (Cards, inputs, modals)
- **Ink Text:** `#1F2937`
- **Slate Text:** `#6B7280`
- **Border:** `#E5E7EB`
- **Typography:** `Inter` for UI, `DM Serif Display` for therapist public profile headings

---

## 🚀 Quickstart & Setup Commands

### 1. Prerequisites
- Node.js (v18+) & npm

### 2. Backend Setup (`unfazed-backend`)

```bash
cd unfazed-backend

# Install dependencies
npm install

# Run database seed (Creates Dr. Ananya Sharma)
npm run seed

# Start development server (Port 5000)
npm run dev   # or: npm start
```

Backend will run at: `http://localhost:5000`

### 3. Frontend Setup (`unfazed-frontend`)

```bash
cd unfazed-frontend

# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🔑 Demo Account Credentials

- **Email:** `ananya@unfazed.care`
- **Password:** `Password123!`
- **Public Profile Slug:** `/dr-ananya-sharma`
- *(Tip: On the `/login` screen, click the "Fill Demo" button to auto-populate)*

---

## 🧪 Verified Features in Module 1

| Feature | Description | Status |
|---|---|---|
| **Health API** | `GET /api/health` returns operational status | ✅ Verified |
| **Authentication** | Registration, Login, bcrypt password hashing, JWT tokens | ✅ Verified |
| **Therapist Profile** | `GET /api/therapists/me` and `PUT /api/therapists/me` | ✅ Verified |
| **Public Slug Page** | `GET /api/therapists/public/:slug` and dynamic client page `/:slug` | ✅ Verified |
| **Slug Generation** | Automatically generates clean URL slugs like `dr-ananya-sharma` | ✅ Verified |
| **Protected Routes** | Unauthenticated `/dashboard` attempts redirect to `/login` | ✅ Verified |
| **Dashboard Shell** | Responsive sidebar, topbar, public link card with copy-to-clipboard | ✅ Verified |
| **Profile Editor** | Instant inline updates for bio, fees, duration, and languages | ✅ Verified |
