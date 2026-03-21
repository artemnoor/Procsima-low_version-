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

- The site now reads data from `new.json` in the project root first.
- If `new.json` is missing, the backend falls back to the newest file named like `bmstu_final_schema*.json`.
- Vercel is configured to include root JSON files in the serverless bundle, so schema updates must be committed and redeployed.
- Local Express server in `/server/index.js` is only for local development and is not needed on Vercel.
