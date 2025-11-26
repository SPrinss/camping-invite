# Task 5: Firebase Integration - Outcome

## Status: Complete

## Files Created

### `src/services/firebase.ts`
Firebase configuration and TypeScript types:
- Firebase project config (`projectId: 'camping-invite'`)
- REST API base URLs for Firestore and Firebase Auth
- Collection constants
- TypeScript interfaces:
  - `ExtraPerson` - extra person with naam and optional email
  - `RSVPData` - form submission data structure
  - `RSVP` - full RSVP record including id and timestamp
  - `AuthToken` - Firebase auth token response

### `src/services/api.ts`
API functions using Firebase REST APIs:

| Function | Signature | Description |
|----------|-----------|-------------|
| `submitRSVP` | `(data: RSVPData) => Promise<void>` | Creates new RSVP in Firestore |
| `login` | `(email: string, password: string) => Promise<AuthToken>` | Firebase Auth sign-in |
| `getRSVPs` | `(token: string) => Promise<RSVP[]>` | Fetch all RSVPs (authenticated) |

## Integration Points

### For Task 4 (RSVP Form):
```typescript
import { submitRSVP } from '../services/api';
import { RSVPData } from '../services/firebase';

// Submit form data
await submitRSVP({
  naam: 'Jan',
  email: 'jan@example.com',
  aanwezigheid: '2-nachten',
  extraPersonen: [{ naam: 'Piet', email: 'piet@example.com' }]
});
```

### For Task 6 (Admin View):
```typescript
import { login, getRSVPs } from '../services/api';
import { RSVP, AuthToken } from '../services/firebase';

// Login
const auth = await login('admin@example.com', 'password');

// Fetch RSVPs
const rsvps = await getRSVPs(auth.idToken);
```

## Notes

- Uses Firebase REST APIs (no SDK) for simplicity
- Error messages are in Dutch for user-facing errors
- The API key in `firebase.ts` is a placeholder - needs to be replaced with actual key before deployment
- Firestore document format is properly converted to/from TypeScript objects
