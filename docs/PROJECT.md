# Hospitality Sites Project Documentation

> **Last Updated:** December 2025
> **Project Status:** Active Development
> **Node Version Required:** 22.x.x

## Overview

This is an NX monorepo containing hospitality venue discovery websites built with Next.js 13 (App Router) and Sanity CMS. The project enables users to discover breweries, cafes, pubs, roasters, and other hospitality venues across different domains.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Applications](#applications)
3. [Libraries](#libraries)
4. [Content Management (Sanity CMS)](#content-management-sanity-cms)
5. [Deployment](#deployment)
6. [Environment Variables](#environment-variables)
7. [Development Workflow](#development-workflow)
8. [Strapi Experiment Status](#strapi-experiment-status)

---

## Architecture

### Template Foundation: TripFinder

**This project is built on the TripFinder template** located at `../tripfinder/packages/boat` (sibling repository).

The template provides:
- **UI Component Library:** All components in `libs/ui-kit/` are derived from or inspired by the TripFinder template
- **Design System:** Tailwind CSS configuration, color schemes, typography, and spacing conventions
- **Layout Patterns:** PageWrapper, Section, Footer, TransparentHeader structures
- **Styling Conventions:** Gradient backgrounds, rounded corners, responsive grids, color-coded cards

When developing new features or components, **always reference the TripFinder template** to maintain design consistency and leverage existing patterns.

```
hospitality-sites/
├── apps/
│   ├── tastebeer.eu/     # Next.js app for beer venues
│   ├── tastecoffee.eu/   # Next.js app for coffee venues
│   ├── cms-studio/       # Sanity Studio CMS
│   ├── backend/          # Strapi experiment (inactive)
│   └── _backup/          # Strapi backup (inactive)
├── libs/
│   ├── ui-kit/           # Shared React components (50+)
│   └── queries/          # Sanity GROQ queries & data layer
├── .github/
│   ├── instructions/     # AI/Copilot instruction files
│   └── docs/             # Project documentation
└── .vscode/
    └── mcp.json          # Sanity MCP server configuration
```

### Tech Stack

| Category | Technology | Version |
|----------|-----------|--------|
| Monorepo | NX | 22.1.3 |
| Frontend | Next.js (App Router) | 16.0.5 |
| React | React | 19.2.0 |
| CMS | Sanity | 4.20.1 |
| Styling | Tailwind CSS + SCSS | 3.4.1 |
| State | Jotai | 2.6.4 |
| Forms | React Hook Form + Zod | 7.51.0 / 3.22.4 |
| Maps | Google Maps React | 2.19.2 |
| TypeScript | TypeScript | 5.9.3 |
| Testing | Jest + React Testing Library | 29.4.1 |
| Package Manager | Yarn | - |

---

## Applications

### tastebeer.eu

**Purpose:** Beer venue discovery website

**Domain Configuration:** `beer`

**Categories:**
- Breweries
- Pubs
- Beer gardens
- Shops

**Routes:**
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `page.tsx` | Homepage with HeroBanner and location search |
| `/places` | `places/page.tsx` | List of beer venues with filtering |
| `/places/[slug]` | `places/[slug]/page.tsx` | Venue detail page |
| `/tasting` | `tasting/` | Tasting experience (TBD) |

**Key Files:**
- `app/config.ts` - App configuration (domain, categories, metadata)
- `app/layout.tsx` - Root layout with PageWrapper
- `next.config.js` - NX Next.js configuration

---

### tastecoffee.eu

**Purpose:** Coffee venue discovery website

**Domain Configuration:** `coffee`

**Categories:**
- Roasters
- Cafes
- Bakeries

**Routes:** Identical structure to tastebeer.eu

**Note:** Both apps share the same codebase architecture, differentiated only by the `domain` configuration in `app/config.ts`. This enables code reuse while maintaining separate deployments.

---

### cms-studio

**Purpose:** Sanity Studio for content management

**Sanity Project:** `7m427qwh`
**Dataset:** `production`

**Plugins:**
- `sanity-plugin-tags` - Tag management
- `sanity-plugin-markdown` - Markdown content editing
- `deskTool` - Content editing interface
- `visionTool` - GROQ query testing
- `@sanity/google-maps-input` - Google Maps location picker

**URL Pattern:** Deployed at `/cms-studio` base path

---

## Libraries

### ui-kit

**Purpose:** Shared React component library

**Location:** `libs/ui-kit/`

**Component Categories:**

| Category | Components |
|----------|-----------|
| **Layout** | PageWrapper, Section, Footer, PageHeader, TransparentHeader |
| **Navigation** | Menu, SideNavButton, Logo |
| **Data Display** | ListCard, ListWrapper, DetailWrapper, ResultsList |
| **Media** | Gallery, GalleryBlock, Slider, HeroBanner, HeroBlock |
| **Maps** | MapView, LocationInput, LocationBlock, SearchAutocomplete |
| **Forms** | FormFields, SearchForm, SearchBox, SelectBox, CheckboxGroup |
| **Actions** | Button, ActionIcon, AddToWishlist, LoadMore, SeeMore |
| **Feedback** | Loader, Rating, ReviewCard, ReviewBlock, ReviewStat |
| **Modals** | Modals, Drawer, Drawers |
| **Content** | Text, DescriptionBlock, SpecificationBlock, RevelContent |
| **Icons** | Custom icon components |
| **Utilities** | AssetsProvider, Filter, FilterTopbar |

**Exports:** All components are exported from `libs/ui-kit/src/index.ts`

---

### queries

**Purpose:** Sanity data layer with GROQ queries

**Location:** `libs/queries/`

**Modules:**

| Module | Purpose |
|--------|---------|
| `client` | Sanity client factory with memoization |
| `list` | Query for venue listings with domain filtering |
| `detail` | Query for single venue details |
| `review` | Review type definitions |
| `location` | Location type definitions |
| `price` | Price type definitions |
| `category` | Category type definitions |
| `author` | Author type definitions |
| `geo-address` | Geocoding utilities |
| `maps` | Google Maps utilities |

**Key Types:**
- `ListItem`, `ListResponse` - Venue list data
- `DetailResponse` - Venue detail data
- `Review`, `Location`, `Price`, `Category` - Common types

---

## Content Management (Sanity CMS)

### Schema Overview

**Document Types:**

#### place (Primary Content Type)
| Field | Type | Description |
|-------|------|-------------|
| name | string | Venue name |
| slug | slug | URL-friendly identifier |
| domains | string[] | Associated domains (beer, coffee, vino, guide) |
| categories | tags | Venue categories (brewery, pub, cafe, etc.) |
| services | tags | Available services (kids area, outdoor seating, etc.) |
| payment_options | string[] | Accepted payment methods |
| location | geolocation | Google Maps location data |
| url | url | Venue website |
| price | string | Price range (low, average, high, very-high) |
| reviews | review[] | User reviews |
| established | string | Year established |
| images | image[] | Photo gallery |
| description | markdown | Detailed description |

#### person
| Field | Type |
|-------|------|
| name | string |
| slug | slug |
| image | image |

#### review (Object Type)
Embedded in place documents for user reviews.

#### rating (Object Type)
Numerical rating component.

#### geolocation (Object Type)
Google Maps integration with address and coordinates.

### Predefined Values

**Domains:** beer, coffee, vino, guide

**Categories:** brewery, pub, beer-garden, roaster, cafe, bakery, bistro, restaurant

**Services:** kids-play-area, outdoor-playground, outdoor-seating, wheelchair-access, dog-friendly, vegan-options

**Payment Options:** cash, card, qr-code

**Price Ranges:** low, average, high, very-high

---

## Deployment

### Platform: Vercel

The project is deployed to Vercel using **GitHub Integration** (not GitHub Actions).

### How It Works

1. **Repository Connection:** The GitHub repository `etylsarin/hospitality-sites` is connected to Vercel
2. **Automatic Deployments:** Vercel automatically builds and deploys on:
   - Push to `main` branch → Production deployment
   - Push to other branches → Preview deployment
3. **Build Configuration:** Vercel detects NX monorepo and builds each app

### Deployment URLs (Inferred)

| App | Production URL |
|-----|----------------|
| tastebeer.eu | `tastebeer.eu` or `tastebeer-eu.vercel.app` |
| tastecoffee.eu | `tastecoffee.eu` or `tastecoffee-eu.vercel.app` |
| cms-studio | `taste-guide.vercel.app` |

### No Custom CI/CD

There are **no GitHub Actions workflows** in this repository. Deployment is handled entirely by Vercel's native GitHub integration.

### Environment Variables

Environment variables must be configured in Vercel's dashboard:

| Variable | Purpose | Required For |
|----------|---------|--------------|
| `SANITY_STUDIO_PROJECT_ID` | Sanity project ID | All apps |
| `SANITY_STUDIO_DATASET` | Sanity dataset name | All apps |
| `SANITY_STUDIO_GMAPS_API_KEY` | Google Maps API (Studio) | cms-studio |
| `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` | Google Maps API (Frontend) | Next.js apps |

---

## Environment Variables

### Local Development

Create `.env.local` files in each app directory:

```bash
# apps/tastebeer.eu/.env.local
# apps/tastecoffee.eu/.env.local
SANITY_STUDIO_PROJECT_ID=7m427qwh
SANITY_STUDIO_DATASET=production
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_maps_key

# apps/cms-studio/.env.local
SANITY_STUDIO_PROJECT_ID=7m427qwh
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_GMAPS_API_KEY=your_google_maps_key
```

### Production

Set in Vercel dashboard under Project Settings → Environment Variables.

---

## Development Workflow

### Prerequisites

- Node.js 20.x.x (enforced by `.nvmrc` and `package.json` engines)
- Yarn package manager
- Sanity account with project access
- Google Maps API key

### Common Commands

```bash
# Install dependencies
yarn install

# Serve Next.js apps
yarn nx run tastebeer.eu:serve
yarn nx run tastecoffee.eu:serve

# Serve Sanity Studio
yarn nx run cms-studio:serve

# Build apps
yarn nx run tastebeer.eu:build
yarn nx run tastecoffee.eu:build

# Run tests
yarn nx run ui-kit:test
yarn nx run queries:test

# Lint code
yarn nx run tastebeer.eu:lint --fix

# Deploy Sanity schema
cd apps/cms-studio && npx sanity schema deploy
```

### MCP Server (AI Integration)

The Sanity MCP server is configured in `.vscode/mcp.json` for AI-assisted content management:

```json
{
  "servers": {
    "Sanity": {
      "url": "https://mcp.sanity.io",
      "type": "http"
    }
  }
}
```

---

## Strapi Experiment Status

### Location

- `apps/backend/` - Main Strapi application
- `apps/_backup/` - Backup of Strapi application

### Status: **Abandoned/Inactive**

The Strapi CMS was explored as an alternative to Sanity but was not adopted. The experiment includes:

- Basic `place` content type with Name, Slug, and Domains fields
- Location plugin (`@notum-cz/strapi-plugin-location`)
- Multi-select plugin for domains
- PostgreSQL database configuration

### Reason for Abandonment

Per project owner: "It didn't seem to work as expected." Sanity CMS is the production content management solution.

### Recommendation

The `apps/backend/` and `apps/_backup/` directories can be safely removed to clean up the repository, as they are not connected to the production applications and contain no unique content.

---

## Project Dependencies Summary

### Production Dependencies
- **Core:** Next.js 16.0.5, React 19.2.0, TypeScript 5.9.3
- **CMS:** Sanity 4.20.1, next-sanity 9.8.28
- **UI:** Tailwind CSS 3.4.1, Headless UI, Heroicons
- **Maps:** @react-google-maps/api, react-geocode
- **Forms:** react-hook-form, zod, react-datepicker
- **State:** Jotai 2.6.4
- **Utils:** lodash, clsx, swiper

### Dev Dependencies
- **Build:** NX 22.1.3, @nx/next, @swc/core 1.15.3
- **Testing:** Jest 29.4.1, @testing-library/react
- **Linting:** ESLint 9.39.1, Prettier 2.6.2
- **Styling:** Sass 1.94.2, postcss, autoprefixer

---

## Future Considerations

### Planned Domains
The schema supports additional domains beyond beer and coffee:
- `vino` - Wine venues
- `guide` - General hospitality guide

### Potential Improvements
1. Add authentication for user reviews
2. Remove inactive Strapi directories (`apps/backend/`, `apps/_backup/`)

---

*This documentation is maintained for AI assistants and developers. Update as the project evolves.*
