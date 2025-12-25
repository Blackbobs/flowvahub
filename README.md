# FlowvaHub — Rewards Page (Assessment)

This repository contains the implementation for the FlowvaHub Rewards page (React + Next.js) and demonstrates integration with Supabase (database + storage). The README below describes how to set up, run, and verify the project locally and in a deployed environment, plus important assumptions and a submission checklist for the assessment.

---

## Quick Summary

- Purpose: Recreate the Rewards page and fulfillment flows (daily streak, claim screenshots) using React and Supabase.
- Stack: Next.js (React + TypeScript), Tailwind CSS utilities, Supabase (auth, database, storage).

Key files

- `src/components/earn-points.tsx` — Main Rewards page UI.
- `src/components/ClaimModal.tsx` — Claim modal UI.
- `src/hooks/useClaim.tsx` — Claim logic (validation, upload, DB insert/upsert).
- `src/hooks/useRewards.ts` — Data fetching hooks for rewards (React Query usage).
- `src/utils/supabase.ts` — Supabase client initialization and helpers.
- `src/icons/*` — Centralized SVG icon components.
- `supabase-schema.sql` — SQL schema used by the project (tables and storage expectations).

---

## Prerequisites

- Node.js 18+ (recommended) or an LTS version.
- `pnpm` (preferred) or `npm`/`yarn` (commands below use `pnpm`).
- A Supabase project (free tier OK). You will need the project URL and anon key.

---

## Local Setup

1. Clone the repo:

```bash
git clone <your-repo-url>
cd flowvahub
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment variables.
   Create a `.env.local` file in the project root with the following (fill values):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
# Optional demo user id used by some demo flows
NEXT_PUBLIC_DUMMY_USER_ID=user-123
```

Do NOT commit real keys.

4. Apply Supabase schema and storage setup.

### Apply SQL schema

Use the SQL script included in the repository: `supabase-schema.sql`.

- Option A — Supabase SQL editor:

  - Open Supabase dashboard → SQL Editor → paste and run `supabase-schema.sql`.

- Option B — psql/CLI (advanced):
  - Use your DB credentials and run: `psql -h <host> -U <user> -d <db> -f supabase-schema.sql`.

### Create storage bucket

- Create a bucket named `claims` in Supabase Storage (the claim flow uploads screenshots to this bucket). If you prefer another bucket name, update the bucket name in `src/hooks/useClaim.tsx`.

5. Run the dev server:

```bash
pnpm dev
# app runs at http://localhost:3000
```

---

## Type Checking & Linting

Run type checks and linting locally:

```bash
pnpm -w tsc --noEmit
pnpm -w eslint . --ext .ts,.tsx
```

Address issues the tools report before submitting to ensure code cleanliness.

---

## How the Core Flows Work

- Daily Streak

  - Clicking the daily claim button calls the daily streak hook which upserts `daily_streaks` and increments `user_points`.
  - On success, the UI shows a Level Up modal.

- Claim 50 pts (screenshot upload)
  - The Claim modal collects an email and a screenshot file.
  - On submit: the file is uploaded to the `claims` bucket; a `tool_claims` row is inserted referencing the file; `user_points` is upserted/updated (adds points).

Data locations

- Storage: `claims` bucket (uploaded screenshot files)
- Tables: `tool_claims`, `user_points`, `daily_streaks` (see `supabase-schema.sql`)

---

## Testing & Verification

- Daily streak test

  1. Start the app and click the daily claim button.
  2. Confirm the Level Up modal appears and the `user_points` row increments by the expected amount.

- Claim flow test
  1. Open the Claim modal, enter an email and upload an image.
  2. Submit and confirm:
     - A file appears in the `claims` storage bucket.
     - A `tool_claims` row has been inserted with a reference to the uploaded file.
     - `user_points` has been updated/upserted.

Use the Supabase dashboard to inspect Storage and Tables.

---


## Assumptions & Trade-offs

- This project uses client-side Supabase operations for ease of demo. In production, prefer server-side verification and secure RLS policies.
- The claim flow currently awards points immediately upon upload/insert for demonstration purposes — a real release should add a verification/approval workflow.
- The repo includes a `supabase-schema.sql` expected to be applied to the project; if it isn't applied, the app will return DB errors.

---



