# Task 6: Admin View - Outcome

## Status: Complete

## Files Created

| File | Description |
|------|-------------|
| `src/admin/index.html` | Admin page HTML with embedded styles |
| `src/admin/admin.ts` | Main admin app entry point and state management |
| `src/components/LoginForm.ts` | Login form component with Firebase auth |
| `src/components/RSVPList.ts` | RSVP list/table component with statistics |

## Features Implemented

### Login Form (`LoginForm.ts`)
- Email and password input fields
- Form validation (required fields, email format)
- Loading state during authentication
- Dutch error messages for common Firebase auth errors:
  - Invalid credentials
  - Too many attempts
  - Network errors
- Callbacks for success and error handling

### RSVP List (`RSVPList.ts`)
- Fetches RSVPs using authenticated REST call
- **Statistics section** showing:
  - Total RSVPs
  - Breakdown by attendance type (2 nights, 1 night, Friday only, not coming)
  - Total number of people attending
- **Table view** with columns:
  - Naam (Name)
  - E-mail
  - Aanwezigheid (Attendance) - with color-coded badges
  - Extra personen (Extra persons)
  - Datum (Date submitted)
- Sorted by submission date (newest first)
- Responsive design (card layout on mobile)
- Empty state when no RSVPs
- Error handling with user-friendly messages
- Logout button

### Admin App (`admin.ts`)
- Session storage for auth token persistence
- Automatic login if token exists in session
- View routing between login and RSVP list
- Logout functionality (clears token)
- Auto-redirect to login on 401/unauthorized errors

### Styling (embedded in `index.html`)
- Consistent with main site design variables
- Login container with form styling
- RSVP table with hover states
- Attendance badges with semantic colors:
  - Green: 2 nights
  - Blue: 1 night
  - Orange: Friday only
  - Red: Not coming
- Statistics cards
- Loading spinner animation
- Fully responsive (mobile-friendly table)

## Dependencies on Other Tasks

### Task 5 (Firebase Integration) - Required
The following functions are imported from `../services/api`:

```typescript
// Login function
login(email: string, password: string): Promise<string>
// Returns: auth token

// Get RSVPs function
getRSVPs(token: string): Promise<RSVP[]>
// Returns: array of RSVP objects
```

### Task 2 (CSS/Styling) - Optional
The admin page includes its own embedded styles but references CSS variables from the main stylesheet if available:
- `--color-primary`
- `--color-text`
- `--color-border`
- `--font-heading`
- etc.

## RSVP Type Interface

```typescript
interface RSVP {
  id?: string;
  naam: string;
  email: string;
  aanwezigheid: '2-nachten' | '1-nacht' | 'alleen-vrijdag' | 'niet';
  extraPersonen: Array<{ naam: string; email?: string }>;
  timestamp: string | { _seconds: number; _nanoseconds: number };
}
```

## How to Access

Navigate to `/admin` or `/admin/index.html` to access the admin panel.

## Notes

- Uses `sessionStorage` for token (cleared on browser close for security)
- XSS protection via HTML escaping on all user-provided content
- No edit/delete functionality (per PRD: users should email Sam or Martina)
