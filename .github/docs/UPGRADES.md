# Hospitality Sites - Upgrade Recommendations

> **Last Updated:** July 2025
> **Priority Scale:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

This document outlines recommended upgrades and improvements for the hospitality-sites project, prioritized by impact and effort.

---

## Executive Summary

The project is currently behind on several major dependencies:
- **Next.js**: 13.5.6 → 16.0.5 (3 major versions behind)
- **NX**: 17.2.8 → 22.1.3 (5 major versions behind)
- **React**: Using canary build → Should move to stable 19.x

---

## 🔴 Critical Priority

### 1. Upgrade React from Canary to Stable

**Current:** `^18.3.0-canary-0ac3ea471-20240111`
**Target:** `^19.2.0` (stable)

**Why Critical:**
- Canary builds are not production-ready
- Security patches may not be backported
- Can cause unpredictable behavior
- Next.js 16 requires React 19.2

**Effort:** Medium
**Risk:** Low-Medium (some API changes in React 19)

**Steps:**
```bash
# Update package.json
yarn add react@^19.2.0 react-dom@^19.2.0
yarn add -D @types/react@^19.0.0 @types/react-dom@^19.0.0

# Test all components for breaking changes
yarn nx run-many --target=test --all
```

**Breaking Changes to Watch:**
- `useEffect` timing changes
- Stricter hooks rules
- Server Components refinements

---

### 2. Upgrade Next.js 13.5.6 → 16.x

**Current:** `13.5.6`
**Target:** `16.0.5`

**Why Critical:**
- 3 major versions behind
- Missing security patches
- Missing performance improvements (Turbopack)
- App Router improvements and bug fixes

**Effort:** High
**Risk:** Medium-High (breaking changes across 3 versions)

**Migration Path:**
1. **13.5.6 → 14.x** (first milestone)
2. **14.x → 15.x** (second milestone)
3. **15.x → 16.x** (final milestone)

**Key Breaking Changes:**

| Version | Change | Action Required |
|---------|--------|-----------------|
| 14.x | `images.domains` deprecated | Replace with `remotePatterns` |
| 15.x | Async request APIs | Update `params` usage in routes |
| 15.x | Caching defaults changed | Review caching strategy |
| 16.x | Turbopack default | Test build with Turbopack |
| 16.x | React Compiler support | Review memoization patterns |

**Immediate Fix (before full upgrade):**
```javascript
// next.config.js - Replace deprecated images.domains
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};
```

**Steps:**
```bash
# Use Next.js codemod CLI for automated migration
npx @next/codemod@latest

# Test incrementally
yarn nx run tastebeer.eu:build
yarn nx run tastebeer.eu:serve
```

---

## 🟠 High Priority

### 3. Upgrade NX 17.2.8 → 22.x

**Current:** `17.2.8`
**Target:** `22.1.3`

**Why High:**
- 5 major versions behind
- Missing task caching improvements
- Missing CI/CD optimizations
- Better monorepo performance

**Effort:** Medium
**Risk:** Medium

**Steps:**
```bash
# NX provides migration command
npx nx migrate latest

# Apply migrations
yarn install
npx nx migrate --run-migrations

# Verify workspace
yarn nx run-many --target=build --all
```

**Key Changes:**
- Project graph improvements
- Task pipeline enhancements
- Better caching strategies
- Improved error messages

---

### 4. Fix Deprecated Next.js Image Configuration

**Current Issue:**
```javascript
images: {
  domains: ['cdn.sanity.io'], // DEPRECATED
}
```

**Target Fix:**
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
      pathname: '/images/**',
    },
  ],
}
```

**Effort:** Low
**Risk:** Low

**Files to Update:**
- `apps/tastebeer.eu/next.config.js`
- `apps/tastecoffee.eu/next.config.js`

---

### 5. Add Proper TypeScript Strict Mode

**Current:** Partial strict mode
**Target:** Full strict mode with noUncheckedIndexedAccess

**Why High:**
- Better type safety
- Catch more bugs at compile time
- Better developer experience

**Effort:** Medium-High (may require fixing type errors)
**Risk:** Low

**Update tsconfig.base.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 🟡 Medium Priority

### 6. Clean Up Strapi Experiment

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

### 7. Add Proper Error Boundaries

**Current:** No error boundaries in apps
**Target:** Error boundaries for graceful error handling

**Why Medium:**
- Better user experience on errors
- Prevents full page crashes
- Required for production apps

**Effort:** Medium
**Risk:** Low

**Implementation:**
```tsx
// libs/ui-kit/src/lib/components/error-boundary/error-boundary.tsx
'use client';

export function ErrorBoundary({ children, fallback }) {
  // Implementation
}
```

---

### 8. Add Loading States

**Current:** Limited loading states
**Target:** Suspense boundaries with loading.tsx files

**Why Medium:**
- Better perceived performance
- Smoother user experience
- Next.js App Router best practice

**Effort:** Low-Medium
**Risk:** Low

**Files to Add:**
- `apps/tastebeer.eu/app/loading.tsx`
- `apps/tastebeer.eu/app/places/loading.tsx`
- `apps/tastecoffee.eu/app/loading.tsx`
- `apps/tastecoffee.eu/app/places/loading.tsx`

---

### 9. Implement Proper SEO Metadata

**Current:** Basic metadata in config
**Target:** Dynamic metadata with generateMetadata

**Why Medium:**
- Better SEO
- Social sharing previews
- Open Graph images

**Effort:** Medium
**Risk:** Low

---

### 10. Add Authentication System

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

### Phase 1: Critical Updates (Week 1-2)
1. ⬜ Fix deprecated `images.domains` configuration
2. ⬜ Upgrade React from canary to stable 19.x
3. ⬜ Upgrade Next.js 13.5.6 → 14.x

### Phase 2: Core Infrastructure (Week 3-4)
4. ⬜ Upgrade Next.js 14.x → 15.x
5. ⬜ Upgrade NX 17.x → 20.x
6. ⬜ Clean up Strapi experiment

### Phase 3: Stabilization (Week 5-6)
7. ⬜ Upgrade Next.js 15.x → 16.x
8. ⬜ Upgrade NX 20.x → 22.x
9. ⬜ Add error boundaries and loading states

### Phase 4: Enhancements (Week 7+)
10. ⬜ Enable TypeScript strict mode
11. ⬜ Implement proper SEO metadata
12. ⬜ Add E2E testing
13. ⬜ Consider authentication system

---

## Dependency Version Reference

| Package | Current | Latest | Gap |
|---------|---------|--------|-----|
| next | 13.5.6 | 16.0.5 | 3 major |
| react | 18.3.0-canary | 19.2.0 | 1 major + canary |
| nx | 17.2.8 | 22.1.3 | 5 major |
| sanity | 4.19.0 | 4.19.0 | ✅ Current |
| typescript | 5.2.2 | 5.7.x | 5 minor |
| tailwindcss | 3.4.1 | 4.0.x | 1 major |
| eslint | 8.48.0 | 9.x | 1 major |
| jest | 29.4.1 | 29.7.0 | 3 minor |
| @testing-library/react | 14.0.0 | 16.x | 2 major |

---

## Resources

- [Next.js Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [NX Migration Guide](https://nx.dev/features/automate-updating-dependencies)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Next.js Codemod](https://nextjs.org/docs/app/building-your-application/upgrading/codemods)

---

*This document should be updated as upgrades are completed. Check off items in the roadmap as they're finished.*
