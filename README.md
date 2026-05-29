# CraftNote

CraftNote is a lightweight monorepo combining a Node/Express backend and a Vite + React frontend. It provides user authentication, workspace-scoped note management, and small AI-powered helpers (title generation, content verification). This README explains what the project does, how to run it locally, the folder layout, and how the pieces interact to deliver each major feature.

**Prerequisites:**
- **Node.js**: v18+ recommended
- **npm** or **yarn**
- **MongoDB**: a local or hosted MongoDB instance (connection via `MONGO_URI`)
- Optional: **Gemini API key** for AI features (`GEMINI_API_KEY`)

**Quick Setup (development)**
- Backend: install dependencies, provide env, run server

```bash
cd backend
npm install
# create backend/.env with at least JWT_SECRET and MONGO_URI
npm run start
```

- Frontend: install and start Vite dev server

```bash
cd frontend
npm install
npm run dev
```

**Required environment variables** (see `backend/config/env.js`)
- **JWT_SECRET**: secret used to sign authentication tokens
- **MONGO_URI** (or `MONGODB_URI`): MongoDB connection string
- **GEMINI_API_KEY** (optional): enables AI features if present

**Project Structure (high level)**
- **`backend/`**: Express API server
  - **`index.js`**: app bootstrap and server start
  - **`controllers/`**: request handlers (auth, notes, workspaces, AI)
  - **`models/`**: Mongoose models (`User`, `Note`, `Workspace`)
  - **`routes/`**: API route definitions
  - **`services/`**: integrations and encapsulated logic (e.g., `geminiService.js`)
  - **`middleware/`**: `authMiddleware.js` for protecting routes
  - **`config/env.js`**: environment loading and validations
- **`frontend/`**: Vite + React application
  - **`src/components/`**: UI components (notes UI, auth modals, AI modals)
  - **`src/services/`**: client-side API wrappers (`authService.js`, `noteService.js`, `aiService.js`)
  - **`public/`** and **`index.html`**: static assets and app entry

**Major functionalities and how they interact**

- **Authentication (sign up / sign in)**:
  - Frontend collects credentials in `SigninModal` / `SignupModal` and calls `authService` which sends HTTP requests to backend auth routes.
  - Backend `authController` validates credentials, uses the `User` model to read/write users, and responds with a JWT.
  - Frontend stores the JWT (in memory or localStorage via `authService`) and attaches it to subsequent API requests; `authMiddleware` on the backend validates the token and injects the user context for controllers.

- **Notes CRUD**:
  - The UI components (`CreateNote`, `NoteList`, `NoteEditorPage`) call `noteService` methods which POST/GET/PUT/DELETE to backend note endpoints.
  - Backend `noteController` orchestrates operations: it authenticates via `authMiddleware`, uses the `Note` model to persist data in MongoDB, and enforces workspace scoping by checking the `Workspace` association.
  - The frontend reflects backend state by re-fetching lists after mutations or updating local state based on responses.

- **Workspaces**:
  - Workspaces group notes and provide separation of user content. The frontend `Workspace` components call `workspaceService` to create, list, and select workspaces.
  - Backend `workspaceController` persists workspaces via the `Workspace` model and ensures ownership and membership rules; selected workspace id is passed with note requests so the backend can scope queries.

- **AI helpers (title generation, verification, writing help)**:
  - On the frontend, components like `GenerateTitleModal` and `WritingHelpModal` call `aiService` endpoints when the user asks for assistance.
  - Backend `aiController` receives these requests and delegates to `services/geminiService.js` which wraps the external Gemini/AI API using the `GEMINI_API_KEY` configured in `backend/config/env.js`.
  - The AI service returns suggestions which the controller forwards to the frontend; the user may accept a suggestion and save it as a note via the normal Notes flow.

- **Shared behaviors and cross-cutting pieces**:
  - **`authMiddleware`**: enforces authentication for protected routes and attaches user identity to requests, so controllers don't need to re-implement auth checks.
  - **Client-side `services/` modules**: centralize API calls and error handling for the frontend, keeping components focused on UI and state.
  - **Controllers vs Services**: controllers translate HTTP requests into domain-level operations and validation, while services encapsulate external integrations (AI) or complex processes; models are the source of truth for persistence.

**Running production build**
- Build frontend and serve static assets with any static host or integrate into the backend's static middleware:

```bash
cd frontend
npm run build
# serve frontend/dist from a static host or copy into backend's public folder
```

**Where to look in the codebase**
- Authentication flow: `backend/controllers/authController.js`, `backend/middleware/authMiddleware.js`, `frontend/src/services/authService.js`
- Notes and workspace flow: `backend/controllers/noteController.js`, `backend/controllers/workspaceController.js`, `frontend/src/services/noteService.js`, `frontend/src/components/Workspace.jsx`
- AI integration: `backend/services/geminiService.js`, `backend/controllers/aiController.js`, `frontend/src/components/ai/*` and `frontend/src/services/aiService.js`




