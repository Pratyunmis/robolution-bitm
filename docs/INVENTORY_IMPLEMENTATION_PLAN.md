# Robolution Inventory Management - Implementation Plan

Audit date: 2026-08-13
Workspace: `/home/salillakra/robolution-bitm`

## Goal

Add a practical inventory management system to the existing Robolution BIT Mesra
website without disrupting the current public CMS site. The system should track
robotics components, stock movements, locations, issue/return workflows, and an
audit trail for club members.

The current repo does not contain inventory code yet. This plan is written for
the actual stack in this project:

- Next.js 16 App Router
- React 19
- Payload 3.85
- Payload Postgres adapter
- Vercel Blob-backed `media`
- Tailwind 4
- Existing Payload admin at `/admin`
- Existing public frontend under `src/app/(frontend)`

## Before starting inventory work

Fix the repo foundation first. Inventory will rely on auth, database reliability,
tests, and contributor setup, so these items should happen before new feature
work:

1. Lock down `src/collections/Newsletter.ts` so subscriber emails are not public.
2. Harden `src/app/api/newsletter/route.ts`.
3. Replace Mongo-based Docker Compose with Postgres.
4. Add `.env.example`.
5. Fix `vitest.setup.ts` or remove it from `vitest.config.mts`.
6. Update the stale Playwright homepage test.
7. Decide package manager and lockfile policy.

## Product scope

The first version should serve club inventory operations, not warehouse-scale
ERP. Build enough structure to be reliable and auditable, then expand.

Primary users:

- `intern`: can view stock and create requests.
- `member`: can view stock, request checkout, record returns for their own
  issues, and see their own history.
- `admin`: can manage items, categories, stock adjustments, approvals, and all
  transaction history.

Primary workflows:

- Search components by name, SKU, category, tags, and location.
- See available, reserved, checked-out, damaged, and total quantities.
- Request checkout for a project.
- Approve or reject a request.
- Return components with condition notes.
- Adjust stock with a required reason.
- See low-stock items.
- Import/export inventory CSV.

## Data model

### Extend Users

File: `src/collections/Users.ts`

Add a role field:

- `role`: select, required, default `intern`
- values: `intern`, `member`, `admin`

Also create shared access helpers:

File: `src/access/roles.ts`

- `isAuthenticated`
- `isAdmin`
- `isMemberOrAdmin`
- `isInternOrAbove`
- `isSelfOrAdmin`

Keep this small and typed. Many collections will reuse these helpers.

### Inventory Categories

File: `src/collections/InventoryCategories.ts`

Slug: `inventory-categories`

Fields:

- `name`: text, required, unique
- `slug`: text, required, unique
- `description`: textarea
- `parent`: relationship to `inventory-categories`
- `icon`: text, optional lucide icon name
- `color`: text, optional hex color
- `sortOrder`: number, default `0`
- `active`: checkbox, default `true`

Access:

- read: authenticated users
- create/update/delete: admin only

Hooks:

- Generate `slug` from `name` if omitted.
- Prevent category self-parenting.

### Inventory Items

File: `src/collections/InventoryItems.ts`

Slug: `inventory-items`

Fields:

- `name`: text, required
- `slug`: text, required, unique
- `sku`: text, required, unique
- `category`: relationship to `inventory-categories`, required
- `description`: richText
- `datasheet`: upload to `media`
- `images`: array of uploads to `media`
- `specifications`: json
- `tags`: array with `label` text
- `location`: group with `room`, `cabinet`, `shelf`, `bin`
- `unitCost`: number, optional
- `currency`: select, default `INR`
- `totalQuantity`: number, required, min `0`
- `reservedQuantity`: number, required, default `0`, min `0`
- `checkedOutQuantity`: number, required, default `0`, min `0`
- `damagedQuantity`: number, required, default `0`, min `0`
- `availableQuantity`: number, admin read-only, computed
- `minStockLevel`: number, default `1`
- `status`: select, computed from quantities
- `consumable`: checkbox, default `false`
- `active`: checkbox, default `true`
- `internalNotes`: textarea, admin only

Quantity rule:

```txt
availableQuantity =
  totalQuantity - reservedQuantity - checkedOutQuantity - damagedQuantity
```

Status rule:

- `out_of_stock`: available is `0`
- `low_stock`: available is above `0` and at or below `minStockLevel`
- `in_stock`: available is above `minStockLevel`
- `inactive`: active is false

Access:

- read: authenticated users
- create: admin only for v1
- update: admin only for v1
- delete: admin only

Keep member writes out of item records. Members should mutate inventory through
transactions so the audit trail stays complete.

### Inventory Transactions

File: `src/collections/InventoryTransactions.ts`

Slug: `inventory-transactions`

Fields:

- `item`: relationship to `inventory-items`, required
- `type`: select, required
  - `checkout_request`
  - `checkout`
  - `return`
  - `reservation`
  - `adjustment`
  - `damage_report`
  - `transfer`
- `status`: select, required
  - `pending`
  - `approved`
  - `rejected`
  - `completed`
  - `cancelled`
- `quantity`: number, required, min `1`
- `requestedBy`: relationship to `users`, required
- `performedBy`: relationship to `users`
- `approvedBy`: relationship to `users`
- `project`: text
- `reason`: textarea, required
- `conditionNotes`: textarea
- `locationFrom`: text
- `locationTo`: text
- `metadata`: json
- `completedAt`: date

Access:

- read: admin can read all; members/interns can read their own transactions.
- create: authenticated users for request-style records.
- update: admin only.
- delete: admin only.

Hooks:

- On create, default `requestedBy` from `req.user`.
- On status transition to `completed`, apply the quantity change to the related
  item.
- Store `completedAt`.
- Reject completion if the item does not have enough available quantity.

Important implementation note:

The item quantity update must be reliable. For v1, keep mutation logic in a
single server-side helper called by Payload hooks and server actions. Do not
spread quantity math across UI components.

### Optional later collections

Add only after the core workflow is stable:

- `inventory-suppliers`
- `inventory-purchase-requests`
- `inventory-kits`
- `inventory-maintenance-logs`

## Application routes

Add inventory routes under the existing frontend group:

- `src/app/(frontend)/inventory/page.tsx`
- `src/app/(frontend)/inventory/InventoryDashboardClient.tsx`
- `src/app/(frontend)/inventory/items/[id]/page.tsx`
- `src/app/(frontend)/inventory/requests/page.tsx`
- `src/app/(frontend)/inventory/admin/page.tsx`

The public marketing pages can keep their current layout. Inventory pages should
feel more like an internal tool: denser layout, clear tables, compact controls,
and less decorative animation.

## Server actions and library code

Create:

- `src/lib/inventory/access.ts`
- `src/lib/inventory/quantity.ts`
- `src/lib/inventory/actions.ts`
- `src/lib/inventory/validation.ts`
- `src/lib/inventory/csv.ts`

Server actions:

- `requestCheckout(itemId, quantity, reason, project)`
- `approveTransaction(transactionId)`
- `rejectTransaction(transactionId, reason)`
- `returnItem(itemId, quantity, conditionNotes)`
- `adjustStock(itemId, quantityDelta, reason)`
- `markDamaged(itemId, quantity, conditionNotes)`
- `createInventoryItem(data)`
- `updateInventoryItem(id, data)`

Validation:

- Use narrow schemas at the action boundary.
- Validate positive quantities.
- Validate transaction type/status transitions.
- Do not accept `availableQuantity` from the client.

## Real-time strategy

Do not start with a complex distributed real-time system. Payload admin and the
frontend can ship with reliable revalidation first.

V1:

- Use server actions.
- Use `router.refresh()` after successful mutations.
- Add cache tags or route revalidation where useful.
- Use low polling only on dashboard pages if the team really needs it.

V2:

- Add a Server-Sent Events endpoint at `src/app/api/inventory/events/route.ts`.
- Emit from inventory item/transaction hooks.
- Keep an in-memory broadcaster only for local/single-instance development.
- Use Redis pub/sub or another external channel before depending on SSE in a
  multi-instance deployment.

## Frontend components

Create inventory-specific components instead of stretching marketing components:

- `InventoryShell`
- `InventoryStats`
- `InventoryFilters`
- `InventoryTable`
- `InventoryItemDrawer`
- `CheckoutRequestDialog`
- `ReturnDialog`
- `AdjustmentDialog`
- `LowStockList`
- `TransactionTimeline`

Expected dashboard controls:

- Search input
- Category select
- Status segmented control
- Low-stock toggle
- Sort menu
- Pagination
- Role-gated action buttons

Avoid running `DarkVeil` on internal inventory pages. Inventory should be fast,
readable, and calm.

## Payload admin

The new collections will appear in `/admin`. Configure them deliberately:

- Group inventory collections under `Inventory`.
- Use helpful `defaultColumns`.
- Use `useAsTitle`.
- Mark computed quantity fields as read-only in admin UI.
- Hide admin-only notes from non-admin roles.

## CSV import/export

V1 export:

- Export item list with category, SKU, quantities, status, location, and tags.

V1 import:

- Admin only.
- Parse CSV server-side.
- Validate all rows before writing any data.
- Report row-level errors.
- Use SKU as the stable upsert key.

Do not import transactions in v1 unless there is a migration need.

## Tests

Fix the current test foundation first, then add focused inventory coverage.

Unit/integration targets:

- role helper behavior
- item quantity calculation
- status calculation
- slug generation
- checkout approval updates item quantities
- insufficient stock rejects completion
- users can only see their own transactions
- admin can see all transactions
- CSV parser rejects invalid rows

E2E targets:

- unauthenticated users cannot open inventory pages
- intern can search inventory and request checkout
- admin can approve checkout
- item availability changes after approval
- low-stock filter shows expected rows

## Implementation sequence

### Phase 0 - Foundation cleanup

1. Fix newsletter privacy and validation.
2. Fix README, `.env.example`, Docker Compose, and lockfile policy.
3. Fix Vitest setup and stale Playwright test.
4. Run type generation and baseline tests.

### Phase 1 - Roles and access

1. Add `role` to `Users`.
2. Add `src/access/roles.ts`.
3. Regenerate Payload types.
4. Add tests for access helpers.

### Phase 2 - Collections

1. Add `InventoryCategories`.
2. Add `InventoryItems`.
3. Add `InventoryTransactions`.
4. Register all three in `src/payload.config.ts`.
5. Regenerate Payload types.
6. Add integration tests for create/read/update permissions.

### Phase 3 - Quantity workflow

1. Implement `src/lib/inventory/quantity.ts`.
2. Implement transaction completion hooks.
3. Add tests for checkout, return, adjustment, and damage flows.
4. Add admin-only safeguards around direct item quantity edits.

### Phase 4 - Internal UI

1. Build `/inventory` dashboard.
2. Build item detail page.
3. Build checkout/return dialogs.
4. Build admin transaction approval page.
5. Add loading, empty, and error states.
6. Add E2E tests for the main workflow.

### Phase 5 - Import/export and operations

1. Add CSV export.
2. Add validated CSV import.
3. Add seed data for common robotics components.
4. Document admin operating procedures.

### Phase 6 - Real-time refresh

1. Measure whether `router.refresh()` and short polling are enough.
2. If needed, add SSE.
3. If deploying across multiple instances, back events with Redis or another
   external pub/sub system.

## Suggested first inventory seed categories

- Microcontrollers
- Single-board computers
- Sensors
- Motor drivers
- Motors
- Batteries
- Power modules
- Communication modules
- ICs
- Wires and connectors
- Mechanical hardware
- Tools
- Consumables

## Suggested first inventory seed items

- Arduino Uno
- Arduino Nano
- ESP32 DevKit
- Raspberry Pi 4
- Raspberry Pi Pico
- L298N motor driver
- TB6612FNG motor driver
- MPU6050 IMU
- HC-SR04 ultrasonic sensor
- IR sensor module
- Buck converter module
- Li-ion battery pack
- Jumper wires
- Breadboards
- Resistor kit
- Capacitor kit

## Acceptance criteria for v1

- Admins can create categories and items from Payload admin.
- Authenticated users can view inventory from `/inventory`.
- Interns and members can request checkout.
- Admins can approve/reject transactions.
- Completing transactions updates item quantities consistently.
- Low-stock and out-of-stock states are computed server-side.
- Every stock change has an audit transaction.
- Tests cover the main quantity and access paths.
- The public marketing site continues to work.

## Risks and decisions

| Risk | Decision |
| --- | --- |
| Direct item edits bypass audit history | Keep member stock changes transaction-only; admin direct edits should create adjustment records. |
| Real-time implementation gets too complex | Ship with server refresh/polling first; add SSE after workflow correctness. |
| Existing auth only has email users | Add role field first and make inventory pages auth-gated. |
| Quantity math diverges between hooks/actions/UI | Put all math in `src/lib/inventory/quantity.ts`. |
| `annoucement` rename collides with feature work | Decide before adding inventory migrations. |
| Docker/local DB remains unreliable | Fix Postgres Compose before inventory development. |
