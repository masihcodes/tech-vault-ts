# ⚡ TechVault (DevStack Vault)

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

<br>

### 🏗️ Architectural Highlights

This project isn't just a basic CRUD app. It follows strict software engineering standards to handle real-world challenges:

- **🔒 Secure by Default (JWT & DTOs):** Uses stateless Dual-Token JWT authentication stored in encrypted HTTP-only cookies. Strict Data Transfer Objects (DTOs) guarantee sensitive data—like password hashes—never leak to the frontend.
- **🤖 Built-in AI Agent & Auto-Fill:** Integrated with Hugging Face (Qwen / LLM models) to act as a coding assistant. Type a library name, click "AI Agent Help ✨", and the app automatically researches and fills in the description, npm install command, and official docs URL.
- **🎨 AI Icon Generator & Cloud Storage:** Automatically generates sleek vector logos for tools without icons using Stable Diffusion / FLUX. Images are uploaded to **Cloudinary** for WebP compression, with an automated cleanup system that deletes orphaned cloud files.
- **⚡ Bleeding-Edge Next.js & React 19:** Replaces traditional REST APIs with Next.js Server Actions. It uses React 19's native `use()` hook, `useTransition`, and `useActionState` for fast, optimistic UI updates without freezing the screen.
- **🗄️ Type-Safe Database & RBAC:** Powered by **Drizzle ORM** and **Neon Serverless Postgres** with clean relational joins, Role-Based Access Control (Admin vs. User permissions), and Zod runtime validation for all form inputs.

<br>

### ✨ Key Features

- **🪄 Smart AI Auto-Fill:** Type any tool name and let the AI coding assistant automatically fetch its description, installation CLI command, and docs URL.
- **🤖 AI Icon Generator:** Automatically generates sleek, cyberpunk-themed vector logos for tools using Hugging Face models if no custom image is uploaded.
- **☁️ Optimized Cloud Media:** Fast image delivery and automatic WebP compression powered by Cloudinary, backed by automated orphan file cleanup.
- **🔍 Real-Time Explore & Filter:** Search through libraries instantly with debounced inputs and sort by alphabetical order, newest additions, or oldest entries.
- **📡 Personal Tech Radar:** Bookmark critical libraries into a dedicated, authenticated vault (`/mylib`) for rapid access during production development.
- **📝 Custom Engineering Notes:** Attach, edit, and persist personal usage notes or caveats to any bookmarked library.
- **🛡️ Protected & Badge Statuses:** Visual badges indicating library visibility (`Public`, `Private`, `Pending`) and admin-enforced protection shields.
- **💻 One-Click Command Copy:** Instantly copy package installation commands (`npm install ...`) with visual clipboard feedback.
- **🎨 Dark Sci-Fi Aesthetic:** Designed with **Tailwind CSS** using a sleek slate/cyan glowing palette, JetBrains Mono typography, and Lucide iconography.

---

### Live Demo: https://tech-vault-ts.vercel.app/

---

<br>

### 🛠️ Quick Start & Setup

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
│   │   ├── action.ts             # Global Server Actions with Zod validation, RBAC checks, & Agent delegation
│   │   ├── error.tsx             # Next.js native Global Error Boundary UI
│   │   ├── layout.tsx            # Root Layout (JetBrains Mono font setup, Navbar, Footer, Sonner Toaster)
│   │   ├── loading.tsx           # Global Suspense Loading fallback animation
│   │   └── page.tsx              # Explore Page (Server Component parsing URL searchParams & data fetching)
│   │
│   ├── components/
│   │   ├── AddButton.tsx         # Client Component button triggering modals based on Auth state
│   │   ├── agentService.ts       # AI Agent logic utilizing LLMs (Qwen/Llama) and robust Regex JSON extraction
│   │   ├── BadgeModal.tsx        # Admin-only controlled dialog for updating library status and protection
│   │   ├── FilterBar.tsx         # URL-driven debounced Search input and Sorting dropdown
│   │   ├── Footer.tsx            # Sticky responsive application footer
│   │   ├── imageService.ts       # Cloudinary upload/deletion & Hugging Face AI text-to-image logic
│   │   ├── LibCard.tsx           # Individual Library Card UI featuring status badges & bookmark triggers
│   │   ├── LibList.tsx           # React 19 Client Component utilizing native `use(libPromise)` hook
│   │   ├── Modal.tsx             # Controlled CRUD Dialog powered by React 19 hooks & AI Auto-fill trigger
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
└── tailwind.config.js            # Tailwind CSS and custom styling design system
```
