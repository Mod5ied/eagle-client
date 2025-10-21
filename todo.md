# Frontend (Client) Execution Plan

## Goal
Build a Next.js (TypeScript) frontend that provides:
- Auth (login) page with JWT stored in httpOnly cookie (received from backend)
- Protected Product Management page with real-time Firestore-backed table (TanStack Table)
- Product CRUD (Add/Edit/Delete/Toggle Status) via modals using Shadcn UI + React Hook Form validation
- Analytics page with 2–3 charts (Shadcn Charts) fed by live Firestore data (listen in real time)
- State management + data fetching using Redux Toolkit + RTK Query (for backend auth + any server-side operations) while Firestore real-time listeners populate product slice

## Architectural Overview
- Framework: Next.js (App Router) with TypeScript
- Styling/UI: Shadcn UI (Radix primitives) + Tailwind CSS
- State: Redux Toolkit store configured with:
  - auth slice (user/session token state; hydrated from cookie via server action or API route on load)
  - products slice (entity adapter for products, sourced from Firestore listener)
  - RTK Query API slice for backend endpoints (auth, perhaps server-driven analytics fallback)
- Firestore: Direct client SDK for real-time product collection subscription (secured via Firestore security rules to require valid token claims if needed; for assignment may be permissive or use emulator). Products: { id, name, sku, price, quantity, status ("active"|"inactive"), category, createdAt, updatedAt }
- Forms: React Hook Form + Zod schema validation
- Table: TanStack React Table with column definitions, sorting, filtering, pagination (client-side initially), row actions dropdown
- Charts: Minimal abstraction layer pulling derived selectors from products slice
- Auth Flow: Login form -> POST /auth/login (backend) -> backend sets httpOnly cookie; frontend triggers refetch of auth/me endpoint or uses server-side route protection; protected routes redirect to /login if no valid session

## Data Flow
1. Login: user submits credentials -> RTK Query mutation -> success triggers invalidateTags(['Auth']) + redirects.
2. Protected Page Load: Layout server component checks cookie (via backend endpoint or edge middleware) -> if unauthorized redirect.
3. Product Management:
   - On mount, dispatch initProductsListener() thunk that attaches Firestore onSnapshot listener.
   - Listener diffs changes (added/modified/removed) and dispatches entity adapter upserts/removals; table re-renders automatically.
   - Add/Edit/Delete/Status actions invoke Firestore write operations via a small abstraction (or via backend if required—assignment allows direct Firestore usage from frontend). On success Firestore listener updates state (avoid manual optimistic update unless latency visible).
4. Analytics: Use memoized selectors over products slice (e.g., total count, active vs inactive breakdown, inventory valuation, category distribution) feeding chart components.

## Security & Auth Considerations
- httpOnly cookie set only by backend. Frontend cannot read it; use a /auth/me endpoint to get current user. RTK Query baseQuery includes credentials for cookie.
- Protect pages using Next.js middleware (check for session cookie) OR server components calling backend /auth/me.
- Avoid storing raw token in Redux (store minimal user info + boolean authenticated).

## Detailed Task Breakdown

### 1. Project Bootstrap
- [ ] Initialize Next.js (TS) project (manual or create-next-app) inside `client`.
- [ ] Configure Tailwind CSS + Shadcn UI (install CLI, init, add base components: button, dialog, input, form, table primitives, chart components).
- [ ] Install deps: react-redux, @reduxjs/toolkit, @tanstack/react-table, firebase, react-hook-form, zod, @hookform/resolvers, recharts or use Shadcn Charts package, date-fns, clsx, lucide-react.
- [ ] Setup absolute imports / path aliases in tsconfig.

### 2. Redux Store Setup
- [ ] Create store.ts with configureStore.
- [ ] Create api slice (RTK Query) with baseQuery fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials:'include' }).
- [ ] Tags: Auth.
- [ ] authApi endpoints: login (mutation), me (query).
- [ ] auth slice: state { user: User|null, status:'idle'|'authenticating'|'authenticated'|'error' }. ExtraReducers listening for me endpoint fulfilled.
- [ ] products slice: entity adapter; actions for productsListenerStarted, productUpsertedMany, productRemoved.

### 3. Firebase Integration
- [ ] Create firebaseConfig.ts reading env vars (apiKey, authDomain, projectId, etc.).
- [ ] Initialize app + getFirestore.
- [ ] Utility: subscribeToProducts(dispatch) returns unsubscribe; inside uses onSnapshot(collection(db,'products'), (snapshot)=> handle docChanges). Map changes to adapter actions.
- [ ] CRUD helpers: addProduct(data), updateProduct(id,data), deleteProduct(id), toggleStatus(id,newStatus) using doc/ set/ update/ delete.

### 4. Auth Pages & Middleware
- [ ] /login page: Client component with React Hook Form (fields: email, password). Hard-coded credentials: demo@demo.com / DemoPass123 (document in README). Submit triggers login mutation.
- [ ] On success: push('/products'); trigger me refetch.
- [ ] Middleware: check for presence of session cookie (e.g., 'token') else redirect /login for /products and /analytics.
- [ ] Layout: ProtectedLayout wraps product & analytics pages, dispatch me query (or use server component fetch) to hydrate.

### 5. Product Management Page (/products)
- [ ] Page-level component dispatches initProductsListener on mount (useEffect). Cleanup unsubscribe on unmount.
- [ ] Add Product Button -> opens Dialog (Shadcn Dialog) with form fields: name (required, min 2), sku (required, unique client-side check), price (number>0), quantity (int >=0), category (select), status (default 'active').
- [ ] Form validation via Zod + RHF.
- [ ] Submit calls addProduct; handle loading state; close dialog.
- [ ] Table columns: Name, SKU, Category, Price, Quantity, Status (badge), UpdatedAt (relative time), Actions (dropdown menu: Edit, Toggle Status, Delete).
- [ ] Edit reuses the same dialog; initialize form with product data; on submit calls updateProduct.
- [ ] Delete -> confirmation dialog (destructive variant) then deleteProduct.
- [ ] Toggle Status -> updateProduct partial field.
- [ ] Sorting & Filtering: Enable column sorting; global search (client-side) by name/SKU using derived filtered array.

### 6. Analytics Page (/analytics)
- [ ] Subscribe to same products slice (mount ensures listener if not active—can track a refcount or central ensureSubscribed).
- [ ] Derive metrics selectors: totalProducts, activeCount, inactiveCount, inventoryValue = sum(price*quantity), categoryDistribution (map category->count), statusRatio.
- [ ] Charts (2-3): Pie (categoryDistribution), Bar (inventory value per category or status counts), Line or Area (products added over time by day/week using createdAt grouping).
- [ ] Components: <AnalyticsCard metric label>, <ProductsAddedChart>, etc.

### 7. Reusable UI Components
- [ ] Modal/Dialog wrapper (Shadcn Dialog already; create FormDialog component handling form + actions).
- [ ] ProductForm (props: defaultValues?, onSubmit, mode:'create'|'edit').
- [ ] StatusBadge.
- [ ] ConfirmDialog (title, description, onConfirm, loading).
- [ ] DataTable wrapper around TanStack table with generic types, renders toolbar (global filter, add button slot), pagination controls.

### 8. Types & Validation
- [ ] Zod schema ProductSchema for form create/update (without id timestamps). Infer ProductFormValues.
- [ ] Firestore Product type extends with id, createdAt (Timestamp), updatedAt (Timestamp).

### 9. Real-Time Sync Edge Cases
- [ ] Handle doc removal.
- [ ] Ensure duplicate listeners not attached (track flag in slice or module-level singleton).
- [ ] Convert Firestore Timestamps to JS Date in adapter.
- [ ] Resilience: if listener errors (permission), dispatch error state; show toast.

### 10. Error & Loading States
- [ ] Toast notifications (Shadcn) for CRUD success/failure.
- [ ] Skeleton or spinner while establishing initial snapshot (products slice 'initializing' flag until first snapshot event).

### 11. Theming & Responsiveness
- [ ] Mobile: Table transforms to stacked cards or horizontal scroll.
- [ ] Use dark mode toggle (optional nice-to-have).

### 12. Testing (Stretch)
- [ ] Unit test products slice reducers.
- [ ] Integration test: simulate Firestore listener payload -> state transitions.

### 13. Env & Config
- [ ] .env.local example: NEXT_PUBLIC_FIREBASE_API_KEY=, NEXT_PUBLIC_API_URL=http://localhost:4000.
- [ ] README docs for setup, running dev, building, environment variables, demo credentials.

### 14. Accessibility & UX
- [ ] Focus management when dialogs open/close.
- [ ] ARIA labels for action buttons.

### 15. Performance Considerations
- [ ] Use React.memo for row components if heavy.
- [ ] Incremental static regeneration not needed; all real-time.

### 16. Deployment Notes
- [ ] Provide build script and instructions (Vercel recommended). Ensure FIREBASE config present.

## Milestones & Order
1. Bootstrap + UI system
2. Auth baseline (login + protected route skeleton)
3. Redux store + Firestore listener baseline (log changes)
4. Product table (read-only)
5. Add Product flow
6. Edit/Delete/Status actions
7. Analytics charts
8. Polish (loading, errors, toasts, responsiveness)
9. README & cleanup

## Acceptance Criteria Checklist
- [ ] Login sets httpOnly JWT cookie; unauthorized users redirected.
- [ ] Product table updates instantly after Firestore changes (tested via Firebase console or second tab).
- [ ] CRUD operations reflected without manual refresh.
- [ ] At least 2 charts show meaningful metrics from live data.
- [ ] Clean responsive UI using Shadcn components.
- [ ] README clear with setup steps.
