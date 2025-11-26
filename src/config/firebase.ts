// Firebase configuration for camping-invite project
export const firebaseConfig = {
  projectId: 'camping-invite',
  // Project number from PRD
  projectNumber: '40575021624',
};

// Firestore REST API base URL
export const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Firebase Auth REST API endpoints
export const AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1';

// Collection names
export const COLLECTIONS = {
  RSVPS: 'rsvps',
} as const;

// Attendance option values (matching Firestore structure)
export const ATTENDANCE_OPTIONS = {
  TWO_NIGHTS: '2-nachten',
  ONE_NIGHT: '1-nacht',
  FRIDAY_ONLY: 'alleen-vrijdag',
  NOT_COMING: 'niet',
} as const;

export type AttendanceOption = typeof ATTENDANCE_OPTIONS[keyof typeof ATTENDANCE_OPTIONS];

// RSVP data interface
export interface RSVPData {
  naam: string;
  email: string;
  aanwezigheid: AttendanceOption;
  extraPersonen: Array<{
    naam: string;
    email?: string;
  }>;
  timestamp?: string;
}
