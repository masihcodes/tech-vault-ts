# ⚡ TechVault (DevStack Vault) — Enterprise Full-Stack Tech Radar

<div align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Zustand-430098?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

**TechVault** is an enterprise-grade, fully typed Full-Stack web application engineered to discover, bookmark, and manage developer tools and libraries. It serves as an interactive "Tech Radar" where developers can document solutions, save CLI installation commands, and attach personal engineering notes to their favorite packages.

Built with the latest **Next.js 15 App Router** and **React 19**, this repository represents the **TypeScript implementation** of the project. It features a **Stateless Dual-Token JWT Authentication**, **End-to-End Type Safety**, **Secure-by-Default Architecture (DTO Pattern)**, **runtime payload validation with Zod**, and relational database modeling using **Drizzle ORM** with **Neon Serverless Postgres**.

---

# Live Demo: https://tech-vault-ts.vercel.app/

### 🏗️ Engineering & Architectural Highlights

This project was built following strict software engineering principles, prioritizing security, scalability, data integrity, and optimal User Experience (UX):

### 1. 🛡️ Advanced Security & Stateless Authentication (JWT)

- **Dual-Token Rotation:** Implements a highly secure authentication flow using short-lived `Access Tokens` and long-lived `Refresh Tokens` encoded via `jsonwebtoken`.
- **Bcrypt Password Hashing:** Protects user credentials by hashing passwords using `bcrypt` before database persistence.
- **Secure Cookie Storage:** Tokens are strictly managed via encrypted HTTP-only, SameSite, and secure browser cookies to prevent XSS and CSRF attacks.

### 2. 🧱 Secure-by-Default Architecture & DTO Pattern

- **Data Transfer Objects (DTO):** Enforces strict serialization boundaries between the Server and Client Components.
- **Zero Data Leaks:** Database queries are explicitly selected (`.select({ id, name, email })`) at the ORM level, ensuring sensitive information like password hashes never leaves the database layer or reaches the React frontend.

### 3. 🔐 Role-Based Access Control (RBAC) & Zod Validation

- **User Role:** Can create libraries (defaulting to `pending` status) and can only edit or delete non-protected libraries that they originally created.
- **Admin Role:** Possess full override capabilities, including updating any library, toggling protection locks (`isProtected`), and managing visibility badges (`public`, `private`, `pending`).
- **Zod Runtime Parsing:** Bridges client-side form submissions and server-side mutations safely, mapping JSON validation errors elegantly into UI toast notifications.

### 4. 🗄️ Relational Database Modeling via Drizzle ORM

- **Modern ORM Architecture:** Replaces raw SQL queries with **Drizzle ORM** (`drizzle-orm/neon-http`) for type-safe database queries, migrations, and zero-cold-start serverless execution on **Neon Postgres**.
- **Relational Schema Design:** Cleanly defines tables, enums (`userRole`, `status`), and cascading foreign-key relationships (`users` ↔ `libraries` ↔ `bookmarks`). Utilizes advanced SQL joins (`leftJoin`, `innerJoin`) to fetch user-specific bookmark states in a single optimized query.

### 5. ⚡ Bleeding-Edge Next.js 15 & React 19 Patterns

- **Server Actions & Cache Revalidation:** Bypasses traditional REST APIs by utilizing Next.js Server Actions (`"use server"`) combined with granular cache invalidation (`revalidatePath`) for instant UI synchronization.
- **React 19 Async Hooks:** Leverages React 19's native `use(libPromise)` hook inside Client Components (`LibList.tsx`) to unwrap server-fetched data streams, paired with `useActionState` and `useTransition` for non-blocking, optimistic UI form mutations.

### 6. 🎛️ Hybrid State Management (URL + Client Store)

- **URL-Driven Search & Sort:** Synchronizes search queries and sorting filters (`/?q=...&sort=...`) directly with URL parameters using debounced routing (`useRef` + `router.replace`), enabling shareable links and efficient server-side filtering.
- **Client UI Store:** Utilizes **Zustand** for lightweight, predictable client-side modal toggling, user auth prompts, and active-target state management.

---

## ✨ Key Features

- **🔍 Real-Time Explore & Filter:** Search through libraries instantly with debounced inputs and sort by alphabetical order, newest additions, or oldest entries.
- **📡 Personal Tech Radar:** Bookmark critical libraries into a dedicated, authenticated vault (`/mylib`) for rapid access during production development.
- **📝 Custom Engineering Notes:** Attach, edit, and persist personal usage notes or caveats to any bookmarked library.
- **🛡️ Protected & Badge Statuses:** Visual badges indicating library visibility (`Public`, `Private`, `Pending`) and admin-enforced protection shields.
- **💻 One-Click Command Copy:** Instantly copy package installation commands (`npm install ...`) with visual clipboard feedback.
- **🎨 Dark Sci-Fi Aesthetic:** Designed with **Tailwind CSS** using a sleek slate/cyan glowing palette, JetBrains Mono typography, and Lucide iconography.

---

## 🛠️ Quick Start & Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/masihcodes/tech-vault-ts.git
cd techVault-ts
npm install
```

### 2. Configure Environment Variables

Create a .env.local file in the root directory and add your Neon Serverless Postgres connection string:

```bash
DATABASE_URL="postgresql://user:password@ep-silent-shadow-a2xxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
ACCESS_JWT_SECRET="your_super_secret_access_key_here"
REFRESH_JWT_SECRET="your_super_secret_refresh_key_here"
ACCESS_TOKEN_TTL=3600 # 60 * 60 -> 1hour
REFRESH_TOKEN_TTL=604800 # 7 * 24 * 60 * 60 1week

HUG_ACC_TOK= ...
CLOUD_NAME= ...
CLOUD_API_KEY= ...
CLOUD_SECRET= ...
CLOUDINARY_URL= ...
```

### 3. Run Database Migrations / Push Schema

```bash
npx drizzle-kit push
```

### 4. Start the App

```bash
npm run dev
```

### 📁 Complete Project Architecture & File Structure

```bash
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── action.ts         # Secure JWT generation, bcrypt hashing, and Auth Server Actions
│   │   ├── mylib/
│   │   │   ├── action.ts         # Dedicated Server Actions for Tech Radar (Notes update, remove bookmark)
│   │   │   └── page.tsx          # My Tech Radar Route (Server Component enforcing Auth & bookmark joins)
│   │   ├── action.ts             # Global Server Actions with Zod validation & RBAC permission checks
│   │   ├── error.tsx             # Next.js native Global Error Boundary UI
│   │   ├── layout.tsx            # Root Layout (JetBrains Mono font setup, Navbar, Footer, Sonner Toaster)
│   │   ├── loading.tsx           # Global Suspense Loading fallback animation
│   │   └── page.tsx              # Explore Page (Server Component parsing URL searchParams & data fetching)
│   │
│   ├── components/
│   │   ├── AddButton.tsx         # Client Component button triggering modals based on Auth state
│   │   ├── BadgeModal.tsx        # Admin-only controlled dialog for updating library status and protection
│   │   ├── FilterBar.tsx         # URL-driven debounced Search input and Sorting dropdown
│   │   ├── Footer.tsx            # Sticky responsive application footer
│   │   ├── LibCard.tsx           # Individual Library Card UI featuring status badges & bookmark triggers
│   │   ├── LibList.tsx           # React 19 Client Component utilizing native `use(libPromise)` hook
│   │   ├── Modal.tsx             # Controlled CRUD Dialog powered by React 19 `useActionState`
│   │   ├── MyLibCard.tsx         # Dedicated Card UI for saved items featuring inline Note Editing
│   │   ├── MyLibs.tsx            # Grid layout wrapper managing initial Sonner toast notifications
│   │   ├── Navbar.tsx            # Top navigation bar displaying user role badges and Auth triggers
│   │   ├── SignInModal.tsx       # User Login modal integrating JSON Zod parsing
│   │   ├── SignUpModal.tsx       # User Registration modal with automated JWT cookie session creation
│   │   ├── myTypes.ts            # Centralized TypeScript interfaces, types, and Zod validation schemas
│   │   ├── neon.ts               # Drizzle queries, Dual-Token refresh logic, and DTO implementation
│   │   └── useLibStore.ts        # Zustand store managing UI modals, active targets, and user prompts
│   │
│   └── db/
│       └── schema.ts             # Drizzle ORM PostgreSQL schema definitions (Tables, Enums, Foreign Keys)
│
├── .env.local                    # Environment variables (Neon DB, JWT Secrets, TTLs)
├── drizzle.config.ts             # Drizzle Kit migration and database tooling configuration
├── next.config.mjs               # Next.js project configuration
├── package.json                  # Project dependencies and npm scripts
├── tsconfig.json                 # TypeScript compiler options and strict typing rules
└── tailwind.config.js            # Tailwind CSS and custom styling design system# Tailwind CSS and custom styling design system
```
