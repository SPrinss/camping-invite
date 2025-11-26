// Validation utilities for RSVP form

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ExtraPerson {
  naam: string;
  email?: string;
}

export interface RSVPFormData {
  naam: string;
  email: string;
  aanwezigheid: '2-nachten' | '1-nacht' | 'alleen-vrijdag' | 'betaal-heel-weekend' | 'wil-graag-maar-kan-niet' | 'niet' | '';
  extraPersonen: ExtraPerson[];
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that a string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates an extra person entry
 */
export function validateExtraPerson(person: ExtraPerson, index: number): string[] {
  const errors: string[] = [];

  if (!isNotEmpty(person.naam)) {
    errors.push(`Extra persoon ${index + 1}: naam is verplicht`);
  }

  if (person.email && person.email.trim() !== '' && !isValidEmail(person.email)) {
    errors.push(`Extra persoon ${index + 1}: ongeldig emailadres`);
  }

  return errors;
}

/**
 * Validates the entire RSVP form
 */
export function validateForm(data: RSVPFormData): ValidationResult {
  const errors: string[] = [];

  // Main person name
  if (!isNotEmpty(data.naam)) {
    errors.push('Naam is verplicht');
  }

  // Main person email
  if (!isNotEmpty(data.email)) {
    errors.push('Email is verplicht');
  } else if (!isValidEmail(data.email)) {
    errors.push('Ongeldig emailadres');
  }

  // Attendance choice
  if (!data.aanwezigheid) {
    errors.push('Kies een aanwezigheidsoptie');
  }

  // Extra persons
  data.extraPersonen.forEach((person, index) => {
    const personErrors = validateExtraPerson(person, index);
    errors.push(...personErrors);
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates a single field and returns error message or empty string
 */
export function validateField(field: string, value: string): string {
  switch (field) {
    case 'naam':
      return isNotEmpty(value) ? '' : 'Naam is verplicht';
    case 'email':
      if (!isNotEmpty(value)) return 'Email is verplicht';
      if (!isValidEmail(value)) return 'Ongeldig emailadres';
      return '';
    case 'aanwezigheid':
      return value ? '' : 'Kies een aanwezigheidsoptie';
    default:
      return '';
  }
}
