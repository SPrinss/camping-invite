# Task 4: RSVP Form Component - Outcome

## Status: Complete

## Files Created

### 1. `src/utils/validation.ts`
Validation utilities for client-side form validation:
- `isValidEmail(email)` - validates email format using regex
- `isNotEmpty(value)` - checks for non-empty strings
- `validateExtraPerson(person, index)` - validates extra person entries
- `validateForm(data)` - validates entire form, returns `{ valid: boolean, errors: string[] }`
- `validateField(field, value)` - single field validation for real-time feedback

**Exported Types:**
- `RSVPFormData` - main form data structure
- `ExtraPerson` - extra person entry `{ naam: string, email?: string }`
- `ValidationResult` - validation result `{ valid: boolean, errors: string[] }`

### 2. `src/components/ExtraPersons.ts`
Expandable list component for additional attendees:
- Add button to add new person (up to max 10)
- Remove button on each entry
- Real-time validation on blur for naam (required) and email (optional)
- Returns controller with `getPersons()` and `reset()` methods

### 3. `src/components/Form.ts`
Main RSVP form component:
- Radio buttons for 4 attendance options:
  - `2-nachten` - 2 nights camping (Fri + Sat)
  - `1-nacht` - 1 night camping (Fri)
  - `alleen-vrijdag` - Friday dinner only
  - `niet` - Cannot attend
- Naam and email fields for main person
- Integrates ExtraPersons component
- Client-side validation before submission
- Loading state during submission
- Error display for validation failures

## Integration Points

### Imports (dependencies from other tasks)
```typescript
import { submitRSVP } from '../services/api';  // Task 5
```

### Exports (for other tasks to use)
```typescript
// From Form.ts
createForm(container: HTMLElement, onSuccess: () => void): { reset: () => void }

// From validation.ts
RSVPFormData, ExtraPerson, ValidationResult
validateForm, validateField, isValidEmail, isNotEmpty
```

### Callback
- `onSuccess()` - called after successful form submission (Task 7 will use this for confetti/success message)

## Notes
- All validation is client-side only (per PRD)
- Form uses Dutch language for all labels and error messages
- Extra persons limited to max 10
- Email is optional for extra persons, required for main person
