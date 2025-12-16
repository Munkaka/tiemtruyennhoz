# YOUWARE - TiệmTruyệnNhỏ Project Guide

This project is a dynamic web application for reading stories, featuring a React frontend and a Cloudflare Worker backend with D1 Database.

## Project Structure

### Frontend (`src/`)
React + TypeScript + Vite + Tailwind CSS application.
- **Entry Point**: `src/main.tsx`
- **Routing**: `src/App.tsx` (React Router)
- **State Management**: React Context / Local State (implied)
- **Key Components**:
  - `src/components/Layout.tsx`: Main layout including Header (Login button) and Sidebar.
  - `src/components/LoginModal.tsx`: Login/Register form.
  - `src/pages/Profile.tsx`: User profile and Author Registration.
  - `src/pages/StoryDetail.tsx`: Story reading interface.
  - `src/pages/Admin.tsx`: Admin dashboard for managing transactions and requests.

### Backend (`backend/`)
Cloudflare Workers + D1 Database.
- **Entry Point**: `backend/src/index.ts` (TypeScript source)
- **Production Code**: `backend/worker.js` (Pure JS for manual deployment)
- **Configuration**: `backend/wrangler.toml`
- **Database Schema**: `backend/schema.sql`

## Development Commands

### Frontend
- **Install Dependencies**: `npm install`
- **Start Dev Server**: `npm run dev` (Runs on localhost:5173)
- **Build for Production**: `npm run build` (Outputs to `dist/`)
- **Lint**: `npm run lint`

### Backend
- **Install Dependencies**: `cd backend && npm install`
- **Deploy**: `cd backend && npm run deploy`
- **Local Development**: `cd backend && npm run dev`
- **Update Database Schema**: `wrangler d1 execute tiem-truyen-nho-db --file=backend/schema.sql --remote`

## Database Schema (D1)

The project uses a SQLite-compatible D1 database with the following key tables:

- **users**: Stores user info, roles (reader, author, admin), wallet balance, and earnings.
- **stories**: Story metadata (title, author, genres, status).
- **chapters**: Story content, pricing, and lock status.
- **unlocked_chapters**: Tracks which users have purchased which chapters.
- **transactions**: Records deposits, withdrawals, and earnings.
- **author_requests**: Requests from users to become authors.
- **favorites**: User favorite stories.
- **comments**: User comments on stories.

## Deployment Guide (iPad/Manual Workflow)

### 1. Frontend (Netlify) - AUTOMATIC
- **Process**: Push code to GitHub -> Netlify detects change -> Netlify builds and deploys.
- **Important**: Do NOT try to deploy manually (drag-and-drop) from iPad, as you cannot run `npm run build` to generate the `dist` folder. Always rely on the Git integration.
- **Troubleshooting**: If build fails, check Netlify logs. Ensure `npm run build` passes locally (ask Youware Agent to verify).

### 2. Backend (Cloudflare Workers) - MANUAL
- **Process**: Copy code -> Paste into Cloudflare Dashboard.
- **File to Copy**: `backend/worker.js` (This file is pre-compiled/simplified for direct pasting).
- **Steps**:
    1. Go to Cloudflare Dashboard -> Workers.
    2. Select your Worker.
    3. Click "Edit Code".
    4. Paste content of `backend/worker.js`.
    5. Click "Deploy".
- **Database**: Ensure D1 database `tiem-truyen-nho-db` is created and bound to variable `DB`.

## Key Features & Implementation Details
- **Authentication**: Custom authentication using `encrypted_yw_id` passed via headers.
- **Role-Based Access**: Admin, Author, and Reader roles managed in the `users` table.
- **Monetization**: Coin-based system for unlocking chapters.
- **Admin Dashboard**: Located at `/admin`, allows approving deposits and author requests.
- **Assets**: Static assets like QR codes should be placed in `public/` for reliable serving.
