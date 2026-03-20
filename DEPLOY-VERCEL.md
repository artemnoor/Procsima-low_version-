# Deploy To Vercel

## What Is Already Prepared

- Static pages are served directly from the project root and `/proftest`.
- API endpoints for Vercel are placed in `/api`.
- Vercel runtime config is in `/vercel.json`.
- Unnecessary local-only files are excluded by `/.vercelignore`.

## Endpoints

- `/api/health`
- `/api/bootstrap`
- `/api/programs`
- `/api/programs/[slug]`

## How To Deploy

1. Import the project into Vercel or upload the repository/folder.
2. Keep the project as a regular Vercel project without a custom build command.
3. Framework preset:
   Use `Other`.
4. Build command:
   Leave empty.
5. Output directory:
   Leave empty.
6. Install command:
   Default is fine.

## Important

- The site reads data from `bmstu_final_schema_20260320_005704.json` in the project root.
- If you later add a newer file named like `bmstu_final_schema*.json`, the backend will pick the newest one automatically.
- Local Express server in `/server/index.js` is only for local development and is not needed on Vercel.
