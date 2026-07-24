# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KettlePal is a full-stack PWA for tracking kettlebell workouts. Users design workouts, track sets, and save the activity. The app then provides analytics (work capacity, personal records, trends over time) and an EMOM timer.

**Live deploy:** https://kettlepal.netlify.app/ (Neon DB / Render API / Netlify FE)
**Local stack:** Docker Compose — frontend on `:3000`, backend on `:4000/graphql`, Postgres on `:5433`.

## Tech Stack

- **Frontend:** TypeScript, React 18 (Create React App), Apollo Client 3, Chakra UI 2, D3.js, react-router-dom 6, dayjs. PWA enabled.
- **Backend:** TypeScript, Apollo Server 4, Express, Knex, PostgreSQL (pg), JWT auth via `jsonwebtoken`, bcrypt. ESM module type.
- **Tooling:** GraphQL Code Generator (typescript, typescript-operations, typescript-react-apollo on FE; typescript-resolvers on BE), Jest (both repos), tsx (BE dev), Docker.

## Repository Layout

```
kettlepal/
├── compose.yaml                 # Postgres + backend + frontend + db-migrate
├── .env / .env.example          # Root envs (NODE_ENV, ACCESS/REFRESH_TOKEN_SECRET)
├── backend/graphql-server/
│   ├── src/
│   │   ├── index.ts             # Apollo + Express bootstrap, JWT cookie middleware
│   │   ├── schema.graphql       # The single source of truth for the GQL schema
│   │   ├── resolvers.ts         # All query/mutation resolvers (large file)
│   │   ├── knexfile.ts          # DB connection (prod vs. local) + migration/seed dirs
│   │   ├── db/
│   │   │   ├── migrations/      # Knex migrations
│   │   │   └── seeds/development/
│   │   ├── utils/               # auth, urls, trend math, validators, fuzzy search
│   │   ├── bin/                 # parseWorkouts.ts / writeParsedWorkoutsToDB.ts (data import)
│   │   └── generated/backend-types.ts   # Codegen output — do not hand-edit
│   ├── knexfile.js, jest.config.cjs, tsconfig.json, codegen.yml
│   └── Dockerfile
└── frontend/kettlepal-fe/
    ├── src/
    │   ├── index.tsx            # Apollo client (InMemoryCache with offset merge), BrowserRouter
    │   ├── App.tsx              # ChakraProvider + UserProvider + Routes + Tray
    │   ├── Pages/               # Greeting, PastWorkouts, NewWorkout, Profile, Settings
    │   ├── Components/
    │   │   ├── Auth/            # PrivateRoute, SessionChecker
    │   │   ├── NewWorkouts/     # Exercise form, create-workout form
    │   │   ├── ViewWorkouts/    # Past-workout list/edit views
    │   │   ├── Settings/        # Template & body weight editors
    │   │   ├── Emom/            # EMOM timer UI
    │   │   ├── Visualizations/  # D3-based trend charts
    │   │   └── * (shared widgets: CalendarWidget, ExerciseTrends, Tray, etc.)
    │   ├── Hooks/               # Feature hooks — useCreateWorkoutForm, useEmomTimer, useWakeLock, etc.
    │   ├── Contexts/UserContext.tsx
    │   ├── Constants/           # theme.ts, ExercisesOptions.ts
    │   ├── graphql/             # queries.tsx, mutations.tsx (gql tag sources)
    │   ├── utils/               # urls, audio, time/exercise helpers
    │   └── generated/frontend-types.ts   # Codegen output
    └── Dockerfile
```

## Common Commands

Run everything (Postgres + migrations + backend + frontend):

```bash
cp ./.env.example ./.env
cp ./backend/graphql-server/.env.example ./backend/graphql-server/.env
# fill in the secrets in both .env files
docker compose up
```

Per-service shortcuts:

```bash
docker compose up frontend       # FE only
docker compose up backend        # BE only (auto-runs migrations first time)
docker compose logs -f backend
docker compose logs -f frontend
docker compose down
```

### Backend (`backend/graphql-server/`)

```bash
npm run dev               # tsx watch on src/index.ts → :4000
npm run build             # tsc → dist/
npm start                 # compile + run dist/index.js
npm test                  # jest (uses ts-jest ESM preset)
npm run knex migrate:make <name>   # new migration → src/db/migrations
npm run knex migrate:latest        # apply pending
npm run knex migrate:list
npm run knex seed:make <table>     # new seed (WARNING: overwrites same-name files)
npm run knex seed:run
npm run db:setup          # migrate + seed
npm run db:replicate-prod-db-to-local   # pg_dump prod → rebuild dev
npm run generate-types    # graphql-codegen → src/generated/backend-types.ts
```

Run a single backend test:

```bash
cd backend/graphql-server
npx jest path/to/file.test.ts
# or filter by name
npx jest -t "verifySettings"
```

### Frontend (`frontend/kettlepal-fe/`)

```bash
npm start                 # react-scripts start → :3000
npm run build             # production build → build/
npm test                  # react-scripts test (jsdom)
npm run generate-types    # graphql-codegen → src/generated/frontend-types.ts
```

Run a single frontend test:

```bash
cd frontend/kettlepal-fe
npx jest src/Components/timer.test.ts --watchAll=false
```

## Architecture & Conventions

### Single GQL schema source of truth
`backend/graphql-server/src/schema.graphql` is the canonical schema. After editing it, run `npm run generate-types` in **both** `backend/graphql-server` and `frontend/kettlepal-fe` to refresh the codegen output. Backend resolvers live in one large `resolvers.ts`; types use `src/generated/backend-types.ts`.

### Auth flow
- `src/index.ts` (BE) mounts a JWT middleware that reads `access-token` and `refresh-token` cookies. On every request it (a) verifies the access token, (b) auto-refreshes when missing, (c) validates the refresh token against `users.tokenCount` to support logout-everywhere, and (d) attaches `userUid` to the GraphQL context.
- Token generation, cookie setting, and `refreshTokens()` live in `src/utils/auth.ts`. Access tokens last 15m, refresh tokens 30d; both are `httpOnly` cookies with `secure` + `sameSite: "none"` in prod.
- On the FE, `Contexts/UserContext.tsx` calls the `checkSession` query on mount to hydrate user state and persists the user object to `sessionStorage` under the `user` key. `Components/Auth/PrivateRoute.tsx` guards authenticated routes.

### Database
- Knex migrations in `src/db/migrations` (timestamps are filenames). Tables: `users`, `workouts`, `exercises`, `templates`. Relations: `users 1-M workouts`, `workouts 1-M exercises`, `users 1-M templates`.
- `exercises.reps_display` controls how the UI renders reps (`std`, `l/r`, `(1,2,3,4,5)`, etc.). `exercises.multiplier` is the constant for work-capacity math (e.g., 0.9 × body weight for pull-ups). `templates.isBodyWeight` causes the exercise row to inherit weight/unit from `users.bodyWeight*`.
- `knexfile.ts` switches connection strings by `NODE_ENV` (production → `NEON_PROD_*`, development → `KNEX_LOCAL_*`). SSL is enabled only in prod.
- Seed order is Users → Workouts → Exercises. Some seeds are present as `.skip` and must be renamed to opt in.

### Trends & work capacity
- `User.workoutTrends(grain, range)` and `User.exerciseTrends(exerciseTitle)` are computed in the resolvers and helpers under `utils/`. `grain` is one of `DAY | WEEK | MONTH | YEAR`. `User.userStats` aggregates lifetime totals (longest workout, top exercises, largest work capacity, etc.).
- `utils/exerciseTrends.ts` and `utils/verifyWorkoutTrends.ts` contain the bucketing logic — update tests alongside any change there.

### Frontend data layer
- Apollo Client (`src/index.tsx`) uses an `InMemoryCache` with custom merge functions for `User.workouts` and `Query.pastWorkouts` so paginated offset fetches accumulate correctly. Default fetch policy is `network-only`.
- GraphQL operations live in `src/graphql/queries.tsx` and `src/graphql/mutations.tsx`. The codegen plugin `typescript-react-apollo` produces typed hooks (`usePastWorkoutsQuery`, `useLoginMutation`, etc.) — call those hooks rather than hand-rolling `useQuery`/`useMutation`.
- `utils/urls.ts` exposes `frontendURL()` and `backendURL()`. In prod the FE calls `/api/graphql` (proxied by Netlify to Render); in dev it calls `http://localhost:4000/graphql` with `credentials: "include"` so the auth cookies flow.

### Feature hooks
Complex forms are extracted into `Hooks/`: `useCreateWorkoutForm`, `useUpdateWorkoutWithExercisesForm`, `useCreateExerciseForm`, `useEditSettings`, `useEditTemplate`, `useEmomTimer`, `useWakeLock` (Cook Mode keeps the screen on). Prefer composing these hooks over duplicating state logic in pages.

### PWA
`src/serviceWorker.ts` is registered as `unregister()`. A "Cook Mode" toggle (see `Hooks/useWakeLock.ts`) keeps the device awake during live workout tracking.

## Environment Variables

Root `.env` (consumed by both services via `env_file`):
- `NODE_ENV`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

`backend/graphql-server/.env`:
- `KNEX_LOCAL_DB_*` (host/name/user/password) for local Postgres
- `NEON_PROD_DB_*` + `NEON_PROD_CONNECTION_STRING` for production
- `PUBLIC_URL` (used for CORS allowlist via `utils/urls.ts`)

## Testing Notes

- BE: Jest with `ts-jest/presets/default-esm`. Tests live alongside source as `*.test.ts` (e.g. `utils/verifySettings.test.ts`) and are excluded from the `tsc` build via the `exclude` field in `package.json`.
- FE: Jest with `ts-jest` + `jsdom`. Setup at `src/setupTests.ts` (testing-library/jest-dom). Most pure-logic tests are for EMOM timer (`Components/timer.test.ts`); component tests use the `test-utils.tsx` wrapper.

## Local Development Tips

- The local Postgres is exposed on host port `5433` (container `5432`) so it doesn't clash with anything else.
- `db-migrate` is a one-shot compose service that runs `npm run db:migrate && npm run db:seed` before `backend` starts. If you change migrations, re-run with `docker compose up db-migrate`.
- After editing `schema.graphql`, always regenerate types in both packages before running the app.
- `parseWorkouts.ts` / `writeParsedWorkoutsToDB.ts` under `src/bin/` are one-off import scripts for migrating historical workout CSVs/JSON into Postgres — see `npm run parseAndUploadWorkouts`.
