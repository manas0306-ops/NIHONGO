# Deployment & Operations Guide 🚀

## 1. 24x7x365 Live Production Deployment (GitHub Pages Edge)

The application is deployed live 24/7/365 on GitHub Pages:
- **Live URL**: [https://manas0306-ops.github.io/NIHONGO/](https://manas0306-ops.github.io/NIHONGO/)
- **Infrastructure**: GitHub Pages globally distributed CDN (Fastly edge network)
- **Availability**: 99.99% uptime, zero server downtime, SSL/TLS HTTPS certificate enforced.
- **Continuous Deployment**: Automated on every push to `main` via `.github/workflows/deploy.yml`.

### Zero 404 Error Guarantee Architecture:
1. **Static HTML Export**: Built using `output: 'export'` with `trailingSlash: true`. Every route generates a standalone `index.html` directory structure (e.g. `kana/index.html`, `kanji/index.html`), preventing direct link 404s.
2. **Jekyll Processing Bypass (`.nojekyll`)**: Prevents GitHub Pages from ignoring Next.js `_next/` static chunk directories.
3. **Smart 404 Route Recovery (`not-found.tsx` -> `404.html`)**: Automatically inspects deep navigation paths and seamlessly mounts the target route or provides a graceful return to the learning dashboard.

---

## 2. Prerequisites

- Node.js 18.18+ or Node.js 20+ / 24+
- npm, pnpm, or yarn

---

## 3. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Server listening at http://localhost:3000
```

---

## 4. Production Build & Verification

```bash
# Run TypeScript strict checks
npm run typecheck

# Run test suite
npm run test

# Compile production bundle
npm run build

# Start local preview server
npx serve out
```

### Alternative: Deploying to Vercel
1. Import repository `manas0306-ops/NIHONGO` in Vercel.
2. Configure environment variables from `.env.example` if connecting to external Supabase instance.
3. Deploy with automatic Next.js detection.
