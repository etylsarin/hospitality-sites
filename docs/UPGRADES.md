# Hospitality Sites - Upgrade Recommendations

> **Last Updated:** November 2025
> **Priority Scale:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

This document outlines recommended upgrades and improvements for the hospitality-sites project, prioritized by impact and effort.

---

## Executive Summary

✅ **COMPLETED**: Major upgrades completed in November 2025:
- **NX**: 17.2.8 → 22.1.3 ✅
- **Next.js**: 13.5.6 → 16.0.5 ✅
- **React**: Canary → 19.2.0 stable ✅
- **Framer Motion**: 11.0.6 → 12.23.24 ✅

---

## ✅ Completed Upgrades (November 2025)

### 1. NX Workspace Upgrade (17.2.8 → 22.1.3)
**Status:** ✅ Completed

Upgraded through all 5 major versions:
- 17.2.8 → 18.x → 19.x → 20.x → 21.x → 22.1.3
- Applied all migrations automatically via `nx migrate`

### 2. Next.js Upgrade (13.5.6 → 16.0.5)
**Status:** ✅ Completed

Migration path completed:
- 13.5.6 → 14.2.33 (via NX @nx/next upgrade)
- 14.2.33 → 15.1.0 (via @next/codemod)
- 15.1.0 → 16.0.5 (via @next/codemod)

**Changes made:**
- `images.domains` → `remotePatterns` configuration
- Viewport metadata moved to separate export
- `useSearchParams` wrapped in Suspense boundaries
- Pages using `useSearchParams` marked as `dynamic = 'force-dynamic'`

### 3. React Upgrade (Canary → 19.2.0)
**Status:** ✅ Completed

- Upgraded from `^18.3.0-canary-0ac3ea471-20240111` to `19.2.0`
- Installed `@types/react@^19.0.0` and `@types/react-dom@^19.0.0`
- Fixed RefObject type signatures for React 19 compatibility

### 4. Framer Motion Upgrade (11.0.6 → 12.23.24)
**Status:** ✅ Completed

- Upgraded to version with React 19 support
- Fixed transition type signatures (`type: 'easeInOut'` → `ease: 'easeInOut'`)

### 5. ESLint Upgrade (8.48.0 → 9.39.1)
**Status:** ✅ Completed

- Migrated from legacy `.eslintrc.json` to ESLint 9 flat config (`eslint.config.mjs`)
- Updated @typescript-eslint packages to v8.x
- Removed deprecated `@typescript-eslint/no-extra-semi` rule
- Added proper globals for Node.js and browser environments

### 6. Additional Fixes Applied
**Status:** ✅ Completed

- Fixed ESLint flat config duplicate imports
- Fixed clsx type issues with Boolean() wrapping
- Added `@types/lodash` for lodash/fp imports
- Fixed `useScrollingClass` hook (renamed from `addScrollingClass`) to accept nullable refs
- Added explicit `import React from 'react'` to all files using `React.*` types (React.FC, React.ReactNode, etc.)
- Split multi-component files (`hero-block.tsx`, `review-stat.tsx`) to comply with `react/no-multi-comp` rule
- Converted function declarations to arrow functions for component definitions
- Added explicit type annotation to `sanityClient` in queries library for Rollup compatibility

### 7. Export Target Removal
**Status:** ✅ Completed

**Background:**
- The `@nx/next:export` executor was removed in NX 22 because:
  - Next.js 13.3.0 deprecated `next export` in favor of `output: 'export'` in `next.config.js`
  - Next.js 14.0.0 completely removed the `next export` command
  - NX followed suit by removing the executor

**Changes Made:**
- Removed obsolete `export` targets from `apps/tastebeer.eu/project.json` and `apps/tastecoffee.eu/project.json`

**New Static Export Approach (if needed):**
If static HTML export is required in the future, add to `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  // Optional: trailingSlash: true,
  // Optional: distDir: 'dist',
};
```
Then simply run `build` - it will generate static HTML/CSS/JS in the `out` folder.

**Note:** Static export has limitations - no Server Actions, no dynamic routes without `generateStaticParams`, etc. See [Next.js Static Exports docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) for details.

### 8. TypeScript Strict Mode
**Status:** ✅ Completed

Enabled full strict mode in `tsconfig.base.json`:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

### 9. Error Boundaries and Loading States
**Status:** ✅ Completed

Added Next.js App Router error and loading conventions:
- `apps/tastebeer.eu/app/error.tsx`
- `apps/tastebeer.eu/app/loading.tsx`
- `apps/tastecoffee.eu/app/error.tsx`
- `apps/tastecoffee.eu/app/loading.tsx`

### 10. SEO Metadata
**Status:** ✅ Completed

Implemented proper SEO metadata using Next.js Metadata API:
- Static `metadata` exports on main pages
- Dynamic `generateMetadata` for place detail pages (`/places/[slug]`)
- Metadata includes titles, descriptions, and OpenGraph data

---

## 🟡 Medium Priority

### 1. Clean Up Strapi Experiment

**Action:** Remove inactive `apps/backend/` and `apps/_backup/` directories

**Why:**
- No longer in use
- Adds confusion to codebase
- Unused dependencies in workspace

**Effort:** Low
**Risk:** None

**Steps:**
```bash
# Remove directories
rm -rf apps/backend
rm -rf apps/_backup

# Update nx.json if needed
# Commit changes
```

---

### 2. Add Authentication System

**Current:** No authentication
**Target:** User authentication for reviews

**Why Medium:**
- Currently reviews are embedded in CMS
- User-generated reviews need auth
- Wishlist feature needs user accounts

**Effort:** High
**Risk:** Medium

**Options:**
- NextAuth.js / Auth.js
- Clerk
- Supabase Auth

---

## 🟢 Low Priority

### 11. Add E2E Testing with Playwright

**Current:** Only Jest unit tests
**Target:** E2E tests for critical flows

**Effort:** Medium
**Risk:** Low

---

### 12. Implement PWA Features

**Current:** Standard web app
**Target:** Progressive Web App

**Features:**
- Offline support
- Push notifications
- App install prompt

**Effort:** Medium
**Risk:** Low

---

### 13. Add Analytics and Monitoring

**Current:** Basic @vercel/speed-insights
**Target:** Comprehensive monitoring

**Options:**
- Sentry for error tracking
- PostHog for analytics
- Vercel Analytics Pro

**Effort:** Low-Medium
**Risk:** Low

---

### 14. Implement i18n Support

**Current:** English only
**Target:** Multi-language support

**Why:** European audience, multiple languages

**Effort:** High
**Risk:** Medium

**Options:**
- next-intl
- next-i18next

---

### 15. Add Storybook for UI Components

**Current:** No component documentation
**Target:** Storybook for ui-kit library

**Effort:** Medium
**Risk:** Low

---

## Upgrade Roadmap

### Phase 1: Critical Updates ✅ COMPLETED
1. ✅ Fix deprecated `images.domains` configuration
2. ✅ Upgrade React from canary to stable 19.x
3. ✅ Upgrade Next.js 13.5.6 → 14.x

### Phase 2: Core Infrastructure ✅ COMPLETED
4. ✅ Upgrade Next.js 14.x → 15.x
5. ✅ Upgrade NX 17.x → 22.x
6. ⬜ Clean up Strapi experiment

### Phase 3: Stabilization ✅ COMPLETED
7. ✅ Upgrade Next.js 15.x → 16.x
8. ✅ Fix type compatibility issues
9. ✅ Add error boundaries and loading states
10. ✅ Enable TypeScript strict mode
11. ✅ Implement proper SEO metadata

### Phase 4: Enhancements (Future)
12. ⬜ Clean up Strapi experiment
13. ⬜ Add E2E testing
14. ⬜ Consider authentication system

---

## Dependency Version Reference

| Package | Previous | Current | Status |
|---------|----------|---------|--------|
| next | 13.5.6 | 16.0.5 | ✅ Updated |
| react | 18.3.0-canary | 19.2.0 | ✅ Updated |
| nx | 17.2.8 | 22.1.3 | ✅ Updated |
| framer-motion | 11.0.6 | 12.23.24 | ✅ Updated |
| eslint | 8.48.0 | 9.39.1 | ✅ Updated |
| @types/lodash | - | 4.17.21 | ✅ Added |
| globals | - | 16.5.0 | ✅ Added |
| sanity | 4.19.0 | 4.19.0 | ✅ Current |
| typescript | 5.2.2 | 5.2.2 | 🟡 Consider updating |
| tailwindcss | 3.4.1 | 3.4.1 | 🟡 v4 available |
| jest | 29.4.1 | 29.4.1 | ✅ Current |
| @testing-library/react | 14.0.0 | 16.1.0 | ✅ Updated |

---

## Resources

- [Next.js Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [NX Migration Guide](https://nx.dev/features/automate-updating-dependencies)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Next.js Codemod](https://nextjs.org/docs/app/building-your-application/upgrading/codemods)

---

*This document should be updated as upgrades are completed. Check off items in the roadmap as they're finished.*
