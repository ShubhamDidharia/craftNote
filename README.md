# CraftNote

CraftNote is a small monorepo-style project containing a Node/Express backend and a Vite + React frontend. This README covers project layout, local setup, common commands, environment variables, and notes about a few files you may safely remove if not using tests or performance telemetry.

**Prerequisites:**
- Node.js (recommended 18+)
- npm or yarn

**Quick Start (dev)**
- Backend:
  - cd backend
  - npm install
  - npm run start (or `node index.js` depending on your local script)
- Frontend:
  - cd frontend
  - npm install
  - npm run dev

**Project Structure**
- `backend/` — Express API server, controllers, models, routes, and services.
  - `index.js` — backend server entry (run from `backend` folder).
  - `package.json` — backend dependencies and scripts.
- `frontend/` — Vite + React app.
  - `index.html` — application HTML; loads `src/index.jsx` as the app entry.
  - `src/index.jsx` — frontend entry point used by Vite.
  - `src/index.js` — an unused duplicate file present in the repository; safe to remove to avoid confusion.
  - `src/reportWebVitals.js` — web-vitals helper (unused unless you import it to collect metrics).
  - `src/setupTests.js` — Jest/Testing Library setup file (unused unless you run Jest tests).

**Important notes**
- The frontend HTML references `/src/index.jsx` as the module entry (see `frontend/index.html`). That means `src/index.jsx` is the active entry and `src/index.js` is not used by the app — you can delete the duplicate `index.js` if you prefer a single canonical entry file.
- `reportWebVitals.js` and `setupTests.js` are present but not imported by `src/index.jsx` or package scripts. Remove them if you are not using web-vitals telemetry or Jest tests.

**Environment variables**
- Backend likely expects env values in `backend/config/env.js` or process.env. Check `backend/config/env.js` and `backend/index.js` for required variables (DB URL, JWT secret, port, etc.). Add a `.env` file in the `backend` folder and load it with your preferred loader if not already configured.

**Commands**
- Frontend (from repo root):
```
cd frontend
npm install
npm run dev    # start Vite dev server
npm run build  # build production bundle
```
- Backend (from repo root):
```
cd backend
npm install
npm run start  # or `node index.js` depending on package.json
```

**Testing**
- The repo includes `frontend/src/App.test.js` and `frontend/src/setupTests.js`. There is no test script in `frontend/package.json` currently. If you want to run tests, consider adding a test runner (`vitest` or `jest`) and a test script to `package.json`.

**Deployment**
- Build the frontend with `npm run build` in `frontend` and serve the `dist` folder from a static host or integrate it into your backend static serving.
- Backend can be deployed to any Node host; ensure environment variables (DB, secrets) are set and the chosen port is exposed.


