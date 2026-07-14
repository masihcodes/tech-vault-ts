# ⚡ TechVault (DevStack Vault) — Enterprise Full-Stack Tech Radar

<div align="left">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face" />
  <img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Zustand-430098?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

**TechVault** is an enterprise-grade, fully typed Full-Stack web application engineered to discover, bookmark, and manage developer tools and libraries. It serves as an interactive "Tech Radar" where developers can document solutions, save CLI installation commands, and attach personal engineering notes to their favorite packages.

Built with the latest **Next.js 15 App Router** and **React 19**, this repository represents the **TypeScript implementation** of the project. It features a **Stateless Dual-Token JWT Authentication**, **End-to-End Type Safety**, **Secure-by-Default Architecture (DTO Pattern)**, **runtime payload validation with Zod**, **automated AI icon generation**, and relational database modeling using **Drizzle ORM** with **Neon Serverless Postgres**.

---

### Live Demo: https://tech-vault-ts.vercel.app/

---

### 🏗️ Engineering & Architectural Highlights

This project was built following strict software engineering principles, prioritizing security, scalability, data integrity, and optimal User Experience (UX):

### 1. 🛡️ Advanced Security & Stateless Authentication (JWT)

- **Dual-Token Rotation:** Implements a highly secure authentication flow using short-lived `Access Tokens` and long-lived `Refresh Tokens` encoded via `jsonwebtoken`.
- **Bcrypt Password Hashing:** Protects user credentials by hashing passwords using `bcrypt` before database persistence.
- **Secure Cookie Storage:** Tokens are strictly managed via encrypted HTTP-only, SameSite, and secure browser cookies to prevent XSS and CSRF attacks.
- **Stripped Session Payloads:** Enforces a strict DTO pattern on session queries (`UserWithPassword` vs. `User`), guaranteeing sensitive password hashes are stripped at the ORM layer before reaching client sessions.

### 2. 🧱 Secure-by-Default Architecture & DTO Pattern

- **Data Transfer Objects (DTO):** Enforces strict serialization boundaries between the Server and Client Components.
- **Zero Data Leaks:** Database queries are explicitly selected (`.select({ id, name, email })`) at the ORM level, ensuring sensitive information never leaves the database layer or reaches the React frontend.

### 3. 🔐 Role-Based Access Control (RBAC) & Zod Validation

- **User Role:** Can create libraries (defaulting to `pending` status) and can only edit or delete non-protected libraries that they originally created.
- **Admin Role:** Possesses full override capabilities, including updating any library, toggling protection locks (`isProtected`), managing visibility badges (`public`, `private`, `pending`), and exclusive permissions to upload custom images or trigger automated AI icon generation.
- **Zod Runtime Parsing:** Bridges client-side form submissions and server-side mutations safely, utilizing native transformations (`nullish().transform(...)`) to map multipart form payloads and JSON validation errors elegantly into UI toast notifications.

### 4. 🤖 AI-Powered Content & Cloud Object Storage

- **Automated AI Icon Generation:** Integrates the `@huggingface/inference` API (utilizing models like **FLUX.1-schnell** and **SDXL**) to dynamically generate custom sci-fi vector icons whenever libraries are created without a custom logo.
- **On-the-Fly Cloud Processing:** Leverages **Cloudinary** for secure multipart image uploads, automatic center-gravity cropping (`200x200`), and lightweight WebP compression.
- **Zero-Leaked Cloud Resources (Orphan Cleanup):** Features an automated cloud garbage-collection pipeline that immediately destroys orphaned Cloudinary blobs when libraries are removed or custom icons are updated.

### 5. 🗄️ Relational Database Modeling via Drizzle ORM

- **Modern ORM Architecture:** Replaces raw SQL queries with **Drizzle ORM** (`drizzle-orm/neon-http`) for type-safe database queries, migrations, and zero-cold-start serverless execution on **Neon Postgres**.
- **Relational Schema Design:** Cleanly defines tables, enums (`userRole`, `status`), and cascading foreign-key relationships (`users` ↔ `libraries` ↔ `bookmarks`). Utilizes advanced SQL joins (`leftJoin`, `innerJoin`) to fetch user-specific bookmark states in a single optimized query.

### 6. ⚡ Bleeding-Edge Next.js 15 & React 19 Patterns

- **Server Actions & Cache Revalidation:** Bypasses traditional REST APIs by utilizing Next.js Server Actions (`"use server"`) combined with granular cache invalidation (`revalidatePath`) for instant UI synchronization.
- **React 19 Async Hooks:** Leverages React 19's native `use(libPromise)` hook inside Client Components (`LibList.tsx`) to unwrap server-fetched data streams, paired with `useActionState` and `useTransition` for non-blocking, optimistic UI form mutations.

### 7. 🎛️ Hybrid State Management (URL + Client Store)

- **URL-Driven Search & Sort:** Synchronizes search queries and sorting filters (`/?q=...&sort=...`) directly with URL parameters using debounced routing (`useRef` + `router.replace`), enabling shareable links and efficient server-side filtering.
- **Client UI Store:** Utilizes **Zustand** for lightweight, predictable client-side modal toggling, user auth prompts, and active-target state management.

---

### ✨ Key Features

- **🤖 AI Icon Generator:** Automatically generates sleek, cyberpunk-themed vector logos for tools using Hugging Face models if no custom image is uploaded.
- **☁️ Optimized Cloud Media:** Fast image delivery and automatic WebP compression powered by Cloudinary, backed by automated orphan file cleanup.
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

HUG_ACC_TOK="your_huggingface_access_token"
CLOUD_NAME="your_cloudinary_cloud_name"
CLOUD_API_KEY="your_cloudinary_api_key"
CLOUD_SECRET="your_cloudinary_api_secret"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
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
│   │   ├── action.ts             # Global Server Actions with Zod validation, RBAC checks, & Cloudinary cleanup
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
│   │   ├── imageService.ts       # Cloudinary upload/deletion & Hugging Face AI text-to-image logic
│   │   ├── LibCard.tsx           # Individual Library Card UI featuring status badges & bookmark triggers
│   │   ├── LibList.tsx           # React 19 Client Component utilizing native `use(libPromise)` hook
│   │   ├── Modal.tsx             # Controlled CRUD Dialog powered by React 19 `useActionState` & RBAC inputs
│   │   ├── MyLibCard.tsx         # Dedicated Card UI for saved items featuring inline Note Editing
│   │   ├── MyLibs.tsx            # Grid layout wrapper managing initial Sonner toast notifications
│   │   ├── Navbar.tsx            # Top navigation bar displaying user role badges and Auth triggers
│   │   ├── SignInModal.tsx       # User Login modal integrating JSON Zod parsing
│   │   ├── SignUpModal.tsx       # User Registration modal with automated JWT cookie session creation
│   │   ├── myTypes.ts            # Centralized TypeScript interfaces, types, and Zod validation schemas
│   │   ├── neon.ts               # Drizzle queries, Dual-Token refresh logic, and stripped session payloads
│   │   └── useLibStore.ts        # Zustand store managing UI modals, active targets, and user prompts
│   │
│   └── db/
│       └── schema.ts             # Drizzle ORM PostgreSQL schema definitions (Tables, Enums, Foreign Keys)
│
├── .env.local                    # Environment variables (Neon DB, JWT Secrets, Cloudinary, Hugging Face)
├── drizzle.config.ts             # Drizzle Kit migration and database tooling configuration
├── next.config.mjs               # Next.js project configuration
├── package.json                  # Project dependencies and npm scripts
├── tsconfig.json                 # TypeScript compiler options and strict typing rules
└── tailwind.config.js            # Tailwind CSS and custom styling design system and custom styling design system# Tailwind CSS and custom styling design system
```
