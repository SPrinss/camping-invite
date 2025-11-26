# Task 1: Project Setup & Config - Outcome

## Status: Complete

## Files Created

| File | Purpose |
|------|---------|
| `package.json` | Vite + TypeScript project configuration with scripts |
| `vite.config.js` | Build configuration with multi-page support |
| `firebase.json` | Firebase Hosting configuration |
| `.firebaserc` | Firebase project alias |
| `src/config/firebase.ts` | Firebase config and type definitions |
| `tsconfig.json` | TypeScript compiler configuration |
| `firestore.rules` | Firestore security rules |

## Details

### package.json
- Project name: `camping-invite`
- Type: ES modules
- Scripts: `dev`, `build`, `preview`, `deploy`
- Dependencies: `vite`, `typescript`

### vite.config.js
- Multi-page app setup with two entry points:
  - `index.html` (main RSVP page)
  - `src/admin/index.html` (admin panel)
- Path alias: `@` → `src/`
- Output directory: `dist`

### firebase.json
- Hosting from `dist` folder
- Rewrites configured for:
  - `/admin` and `/admin/**` → admin SPA
  - `**` → main SPA
- References `firestore.rules`

### src/config/firebase.ts
Exports for other tasks to use:
```typescript
// Config
export const firebaseConfig = { projectId: 'camping-invite', projectNumber: '40575021624' }

// REST API URLs
export const FIRESTORE_BASE_URL = 'https://firestore.googleapis.com/v1/projects/camping-invite/databases/(default)/documents'
export const AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1'

// Constants
export const COLLECTIONS = { RSVPS: 'rsvps' }
export const ATTENDANCE_OPTIONS = {
  TWO_NIGHTS: '2-nachten',
  ONE_NIGHT: '1-nacht',
  FRIDAY_ONLY: 'alleen-vrijdag',
  NOT_COMING: 'niet',
}

// Types
export type AttendanceOption = '2-nachten' | '1-nacht' | 'alleen-vrijdag' | 'niet'
export interface RSVPData { naam, email, aanwezigheid, extraPersonen[], timestamp? }
```

### firestore.rules
From PRD:
- `create`: Anyone (public RSVP submission)
- `read`: Authenticated users only (admin view)
- `update/delete`: Denied

## Integration Points

Other tasks should import from `@/config/firebase`:
- **Task 4 (Form)**: Use `ATTENDANCE_OPTIONS`, `RSVPData` interface
- **Task 5 (Firebase)**: Use `FIRESTORE_BASE_URL`, `AUTH_BASE_URL`, `COLLECTIONS`, `firebaseConfig`
- **Task 6 (Admin)**: Use types and constants

## Next Steps for Integration

Run `npm install` to install dependencies, then `npm run dev` to start development server.
