# Deployment & Operations Guide 🚀

## 1. Prerequisites

- Node.js 18.18+ or Node.js 20+ / 24+
- npm, pnpm, or yarn

---

## 2. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Server listening at http://localhost:3000
```

---

## 3. Production Build & Deployment

```bash
# Run TypeScript strict checks
npm run typecheck

# Run test suite
npm run test

# Compile production bundle
npm run build

# Start production server
npm start
```

### Deploying to Vercel
1. Push repository to GitHub (`manas0306-ops/NIHONGO`).
2. Import project in Vercel.
3. Configure environment variables from `.env.example` if connecting to external Supabase instance.
4. Deploy with automatic Next.js detection.
