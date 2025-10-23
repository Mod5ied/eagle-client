# Frontend Task - Real-Time Product Management Dashboard

## Overview
Next.js (App Router, TypeScript) frontend for the Real-Time Product Management Dashboard. Implements:

- JWT auth (hard-coded demo credentials) with httpOnly cookie via backend
- Protected routes (`/products`, `/analytics`) guarded by middleware
- Real-time Firestore product subscription (listener) with Redux Toolkit entity adapter
- Product CRUD (create/edit/delete/status toggle) using Shadcn UI dialogs + React Hook Form + Zod validation
- Responsive product table (TanStack React Table) with sorting, filtering, pagination + mobile stacked card view
- Analytics page with 3 Shadcn-styled Recharts visualizations (pie, bar, line) sourced from live product data
- Toast notifications + skeleton loading states

## Demo Credentials
- Email: patrick@demo.com
- Password: demopass123

## Prerequisites
- Node.js 18+
- pnpm (recommended)

## Environment Variables (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID # optional if using analytics
```

## Firebase Setup
For real-time updates to work, configure Firestore security rules to allow client access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read, write: if true; // Allow all access for demo
    }
  }
}
```

Note: In production, implement proper authentication-based rules instead of `if true`.

## Scripts
- `pnpm dev` - start dev server
- `pnpm build` - build production
- `pnpm start` - start production build
- `pnpm test` - run integration tests (to be added)

## Install
```bash
pnpm install
```

## Run
```bash
pnpm dev
```

## Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS + Shadcn UI components
- Redux Toolkit (products slice entity adapter) + RTK Query (auth + products backend CRUD)
- Firebase Firestore (real-time listener for products)
- React Hook Form + Zod (form validation)
- TanStack React Table (desktop view)
- Recharts + Shadcn chart container components (analytics)

## Shadcn Setup (after install)
```bash
pnpm dlx shadcn-ui init
# add components as needed, e.g.
pnpm dlx shadcn-ui add button dialog input table
```

## Features Implemented
- Auth login + redirect
- Protected routes middleware
- Products subscription (real-time updates without manual refresh)
- Product CRUD dialogs (create/edit/delete/status toggle)
- Toast feedback & skeleton loaders
- Responsive table + mobile stacked cards
- Analytics charts (status distribution, category counts, inventory value over time)

## Acceptance Criteria Verification
| Criterion | Status |
| --------- | ------ |
| Login sets httpOnly JWT cookie; unauthorized redirected | COMPLETE Middleware + backend cookie |
| Real-time table updates from Firestore | COMPLETE Listener updates entity adapter instantly |
| CRUD reflects without manual refresh | COMPLETE Firestore listener + RTK Query invalidation |
| 2-3 meaningful charts from Firestore | COMPLETE 3 charts implemented |
| Clean responsive UI with Shadcn components | COMPLETE Desktop + mobile card layout |
| README with setup steps | COMPLETE This document |

## Running Locally
1. Clone backend & start it (ensure `NEXT_PUBLIC_API_URL` points to backend host).
2. Create `.env.local` using example file.
3. Configure Firebase Firestore security rules as shown above.
4. Install dependencies:
```bash
pnpm install
```
5. Start dev:
```bash
pnpm dev
```
6. Open http://localhost:3000 and login with demo credentials.

## .env.example
See `.env.example` file (create if missing) with required Firebase and API variables.

## Scripts
```bash
pnpm dev      # start development server
pnpm build    # production build
pnpm start    # run built app
```

## Folder Structure
```
src/
	app/                 # App Router pages
	components/          # UI + feature components
	store/               # Redux slices & RTK Query APIs
	firebase/            # Firestore subscription helpers
	libs/hooks/          # Custom hooks (auth, products subscription)
	schemas/             # Zod schemas
```

## Troubleshooting
- 401 redirects: Confirm backend running & cookie domain matches.
- Firestore not updating: Check Firebase config and network console for permission errors.
- Charts empty: Ensure products have `createdAt` and categories set.
