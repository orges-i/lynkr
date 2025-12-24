# LYNKR

LYNKR is a link-in-bio web app with a public profile page and a private
dashboard. It uses Supabase for auth, database, and storage.

## Features
- Public profiles at `/:username` with theme and link display
- Auth flows: sign up, email confirmation, login, password reset
- Dashboard: create/update/reorder links, edit appearance settings, update
  profile info, upload avatar/cover, manage contact info
- Link click tracking (stored in Supabase)
- Superadmin area at `/superadmin` for user management, pricing plans, tickets,
  reports, and platform settings
- Maintenance mode and registration toggles (global settings)

## Tech
- React + Vite + TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- React Router, @dnd-kit, react-hot-toast

## Setup
1. Install deps:
```bash
npm install
```
2. Create `.env.local` with:
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
3. Run:
```bash
npm run dev
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`

## Notes
- The dashboard analytics tab is a placeholder UI.
- No automated tests are configured.
