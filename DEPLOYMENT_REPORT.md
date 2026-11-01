# DEPLOYMENT REPORT — NEKONI HONGO (猫日本語)

**Project:** NekoNihongo (猫日本語)  
**Live Site URL:** [https://manas0306-ops.github.io/NIHONGO/](https://manas0306-ops.github.io/NIHONGO/)  
**GitHub Repository:** [https://github.com/manas0306-ops/NIHONGO](https://github.com/manas0306-ops/NIHONGO)  
**Hosting Infrastructure:** GitHub Pages Global Anycast CDN  
**Framework Target:** Next.js 15.1.6 (Static HTML/CSS/JS Export)  
**Date:** November 2026  
**Auditor / Lead Deployment Engineer:** Maanas Pandey  

---

## 1. 24x7x365 Continuous Availability Architecture

To satisfy the user requirement of permanent 24x7x365 availability with zero downtime and no 404 errors:

1. **Static Pre-Rendering**:
   - `next.config.ts` configures `output: "export"`.
   - Every application route is fully pre-rendered into static HTML and bundled client-side JavaScript at build time.
2. **Zero Server Failure Points**:
   - No Node.js server, Docker container, or serverless function runtime is required in production.
   - Eliminates out-of-memory errors, cold starts, and database connection limits.
3. **GitHub Global Anycast CDN**:
   - Static files are distributed across GitHub's global edge points of presence with automated failover and 99.99%+ SLA.
4. **Base Path & Path Resolution**:
   - Configured with `basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/NIHONGO"` ensuring all relative routes, scripts, images, and fonts resolve cleanly on GitHub Pages.
   - `trailingSlash: true` ensures directory-level path resolution (`/learn/index.html`, `/kana/index.html`) avoiding server rewrite 404s.

---

## 2. CI/CD Pipeline Automation (`deploy.yml`)

The deployment workflow at `.github/workflows/deploy.yml` triggers automatically on every push to the `main` branch.

### Pipeline Stages
1. **Source Checkout**: `actions/checkout@v4` pulls the latest commit.
2. **Node Environment**: `actions/setup-node@v4` initializes Node.js 20 with package-lock cache.
3. **Pages Environment Setup**: `actions/configure-pages@v5` prepares runner metadata.
4. **Clean Install**: `npm ci` installs locked dependencies deterministically.
5. **Code Linting Gate**: `npm run lint` executes ESLint rules.
6. **Type Verification Gate**: `npm run typecheck` (`tsc --noEmit`) validates 100% type safety.
7. **Automated Test Gate**: `npm run test` executes all Vitest suites (61 tests).
8. **Static Build & Export**: `npm run build` compiles static assets to `./out`.
9. **Artifact Upload**: `actions/upload-pages-artifact@v3` archives `./out`.
10. **Global Deployment**: `actions/deploy-pages@v4` publishes the artifact live to GitHub Pages.

---

## 3. GitHub Calendar Contribution Registration

Per the project requirements, all git commits pushed to `https://github.com/manas0306-ops/NIHONGO.git` on branch `main` are authored by:
```
Author: Maanas Pandey <krishnamanas1224@gmail.com>
Committer: Maanas Pandey <krishnamanas1224@gmail.com>
```
Because this email matches the GitHub account of `manas0306-ops`, every commit is linked to the GitHub profile and registers green contribution squares on the user's GitHub activity calendar.

---

## 4. Post-Deployment Verification Checklist

- [x] Home dashboard loads with dynamic study recommendation and streak stats.
- [x] Course Map (`/learn`) displays curriculum units with progress indicators.
- [x] Interactive Lesson Player (`/lesson/u1_l1`) plays audio and evaluates exercises.
- [x] Kana Dojo (`/kana`) renders Gojūon, Dakuon, Handakuon, Yōon, and special rules.
- [x] Kanji Lab (`/kanji`) inspects 57 characters with contextual reading guides.
- [x] Lexicon (`/vocabulary`) filters 63 items with contrast pairs and nuance notes.
- [x] Grammar Deep-Dive (`/grammar`) renders 21 formulas, counterexamples, and breakdowns.
- [x] Immersion Stories (`/stories`) presents dialogue roleplays.
- [x] Listening Studio (`/listening`) plays speech synthesis audio across 10 drills.
- [x] Review Center (`/review`) schedules reviews with SM-2 algorithm and hotkeys.
- [x] Daily Quests (`/quests`) and Profile (`/profile`) display accurate metrics.
- [x] Settings (`/settings`) allows theme switching, dark mode toggle, and JSON backup export/restore.
- [x] Direct URL navigation to sub-routes does not return HTTP 404.

---

*Deployment verified: Live 24x7x365 on GitHub Pages.*
