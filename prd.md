# PRD: Het Grote Vrienden Kampeerfeest - RSVP Website

## Overview
A simple, quirky RSVP website for a camping weekend with friends and family (7-9 August 2026).

---

## Event Details

- **Event**: Het grote vrienden kampeerfeest
- **Dates**: 7-9 August 2026
- **Location**: Groepskampeerterrein de Banken ([Google Maps](https://maps.app.goo.gl/kMApXo5gtzp6ixB39))
- **Main event**: Friday potluck dinner (most attendees expected)
- **Language**: Dutch
- **RSVP Deadline**: None

---

## Pricing Information (2025 rates, display on site)

| Item | Price |
|------|-------|
| Overnachting per persoon per nacht | � 8,85 |
| Toeristenbelasting per persoonfix  per nacht (alle leeftijden) | � 1,33 |
| Dagactiviteit per persoon per dag | � 6,44 |
| Kinderen 0 t/m 2 jaar | Gratis |
| Huur blokhut veld 1 (ongemeubileerd, niet om in te overnachten) | � 29,50 per dag/nacht |
| Elektra per dag | � 3,92 |
| Hond per dag | � 2,62 |
| Schoonmaakkosten per toiletgebouw | � 37,50 |
| Reserveringskosten per boeking | � 17,50 |
| Tientje voor de natuur | � 10,00 |

---

## Page Structure

### Header
**Title**: "Het grote vrienden kampeerfeest: 7-9 aug 2026"

### Body Text
Tone: Warm, casual, similar to 2021 invite:

> "Hoi! Omdat we (ons (oorspronkelijk) Amsterdamse vriendengroepje) elkaar inmiddels al talloze gelegenheden misgelopen zijn, wordt het weer eens tijd om even goed bij te kletsen!
>
> Wie is er ook alweer waarheen verhuisd? Welk kind is van wie (en hoe ziet die er eigenlijk uit)? Hoe gaat het eigenlijk met... etc etc
>
> Nog leuker wordt het als we elkaars ouders, broers/zussen kunnen zien en spreken en zij elkaar (weer) eens ontmoeten, dus stuur de uitnodiging vooral aan hen door :-)
>
> Vrijdagavond is er een potluck - dit wordt het hoofdmoment waar de meeste mensen zullen zijn. Het kamperen zelf is voor wie langer wil blijven hangen."

### Form (see below)

---

## RSVP Form

### Attendance Options (radio buttons)
1. Ik kom 2 nachten kamperen (vrijdag + zaterdag)
2. Ik kom 1 nacht kamperen (vrijdag)
3. Ik kom alleen naar het eten op vrijdag (niet overnachten)
4. Ik kan helaas niet komen

### Main Person Fields
- **Naam** (required)
- **Email** (required)

### Extra Persons (expandable list)
- Button: "+ Persoon toevoegen"
- Per extra person:
  - Naam (required)
  - Email (optional)
- Max 10 extra persons
- Each item has a remove button

### Submit
- Button: "Verstuur"
- On success: Show success message + confetti <�
- Include note: "Wil je je aanmelding wijzigen? Stuur een mailtje naar Sam of Martina."

### Validation
- Client-side only (no server validation)
- Required fields: main person name, main person email, attendance choice
- Email format validation
- Extra person names required if added

---

## Design

### Style
- **Quirky & friendly**
- Playful typography
- Warm colors (camping/nature vibes)

### Images
- Partial/see-through images (not full photos)
- Use specific photos from previous camping event (user will provide)
- Decorative elements: tents, campfire, trees, stars

### Responsive
- Works on both mobile and desktop

---

## Technical Implementation

### Stack
- Static site (HTML/CSS/JS or simple framework)
- Firebase Firestore for data storage (REST calls)
- Firebase Hosting (*.web.app domain)

### Firebase Config
- **Project ID**: camping-invite
- **Project Number**: 40575021624
- *(Full config to be added)*

### Firestore Structure
```
Collection: rsvps
Document: {auto-generated-id}
  - naam: string
  - email: string
  - aanwezigheid: string ("2-nachten" | "1-nacht" | "alleen-vrijdag" | "niet")
  - extraPersonen: array of { naam: string, email?: string }
  - timestamp: timestamp
```

### Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{document} {
      allow create: if true;  // Anyone can submit
      allow read: if request.auth != null;  // Only authenticated users can read
      allow update, delete: if false;  // No modifications
    }
  }
}
```

---

## Admin View

### Access
- Firebase Authentication (email + password)
- Users created manually in Firebase Console
- Read access controlled by Firestore security rules (check auth)

### Features
- Simple list/table of all RSVPs
- REST call to fetch data (only works when authenticated)
- Route: /admin (or similar)

---

## Out of Scope
- L Edit/update responses (email Sam/Martina instead)
- L Duplicate email detection
- L Server-side validation
- L Confirmation emails
- L CSV export
- L Custom domain

---

## Resolved Questions

1. **1 nacht option**: Always Friday night
2. **Photos**: User will provide specific photos from previous camping event
3. **Colors**: Warm earthy tones (greens, oranges, browns) - camping vibes
4. **Contact**: Just "Sam of Martina" - guests will know how to reach them

---

## Parallel Task Breakdown

These tasks are designed to be worked on independently by separate agents:

### Task 1: Project Setup & Config
**Files**: `package.json`, `vite.config.js`, `firebase.json`, `.firebaserc`, `src/config/firebase.ts`
- Initialize project (Vite + vanilla TS or simple framework)
- Set up Firebase config file with project details
- Configure Firebase Hosting settings
- Set up build scripts

### Task 2: CSS/Styling System
**Files**: `src/styles/` (all files), `public/images/`
- Create CSS variables for color palette (earthy greens, oranges, browns)
- Typography styles (quirky, playful fonts)
- Layout system (responsive grid)
- Image styling (partial/see-through effects, masks)
- Confetti animation styles
- **Note**: Use placeholder image references; actual images added later

### Task 3: Static Content & Layout
**Files**: `index.html`, `src/components/Header.ts`, `src/components/PricingTable.ts`, `src/components/EventInfo.ts`
- HTML structure
- Header component with title
- Body text component
- Pricing table component
- Location link
- **Note**: Import styles from Task 2, but can use placeholder classes

### Task 4: RSVP Form Component
**Files**: `src/components/Form.ts`, `src/components/ExtraPersons.ts`, `src/utils/validation.ts`
- Form with radio buttons for attendance
- Name + email fields
- Expandable extra persons list (add/remove, max 10)
- Client-side validation
- Form state management
- **Note**: Form submission calls a function from Task 5

### Task 5: Firebase Integration
**Files**: `src/services/firebase.ts`, `src/services/api.ts`
- Firestore REST API calls for creating RSVP
- Firebase Auth REST API calls for admin login
- Fetch all RSVPs function (authenticated)
- Error handling
- **Note**: Exports functions that Task 4 and Task 6 will import

### Task 6: Admin View
**Files**: `src/admin/index.html`, `src/admin/admin.ts`, `src/components/LoginForm.ts`, `src/components/RSVPList.ts`
- Login form (email + password)
- Authenticated REST call to fetch RSVPs
- Table/list display of all responses
- **Note**: Uses Firebase functions from Task 5

### Task 7: Success State & Confetti
**Files**: `src/components/SuccessMessage.ts`, `src/utils/confetti.ts`
- Success message component
- Confetti animation (canvas or CSS)
- "Mail Sam of Martina" note
- Transition from form to success state

---

## Integration Points (for reference)

| From | To | Interface |
|------|----|-----------|
| Task 4 (Form) | Task 5 (Firebase) | `submitRSVP(data): Promise<void>` |
| Task 6 (Admin) | Task 5 (Firebase) | `login(email, pw): Promise<token>`, `getRSVPs(token): Promise<RSVP[]>` |
| Task 3 (Layout) | Task 2 (Styles) | CSS classes |
| Task 4 (Form) | Task 7 (Success) | `onSuccess()` callback |
| All components | Task 1 (Setup) | Build config, entry points |

---

## Suggested Execution Order

**Phase 1** (can run in parallel):
- Task 1: Project Setup
- Task 2: CSS/Styling
- Task 5: Firebase Integration

**Phase 2** (after Phase 1):
- Task 3: Static Content
- Task 4: RSVP Form
- Task 6: Admin View
- Task 7: Success State

**Phase 3**:
- Integration & testing
- Add actual photos
- Deploy
