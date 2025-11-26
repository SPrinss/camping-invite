// Firebase configuration for camping-invite project
// Using REST API approach (no SDK) for simplicity

export const firebaseConfig = {
  apiKey: 'AIzaSyC80VvKMqAX6gLEXmCFfE0wm7Fa6W9JaSo',
  authDomain: 'camping-invite.firebaseapp.com',
  projectId: 'camping-invite',
  storageBucket: 'camping-invite.firebasestorage.app',
  messagingSenderId: '40575021624',
  appId: '1:40575021624:web:879f3d70b699d7e66faccd',
};

// Determine if we should use emulators
// Vite exposes env vars via import.meta.env
const USE_EMULATOR = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' || import.meta.env.USE_FIREBASE_EMULATOR === 'true';

// Firestore REST API base URL
const FIRESTORE_HOST = USE_EMULATOR ? 'http://127.0.0.1:8080' : 'https://firestore.googleapis.com';
export const FIRESTORE_BASE_URL = `${FIRESTORE_HOST}/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Firebase Auth REST API base URL
const AUTH_HOST = USE_EMULATOR ? 'http://127.0.0.1:9099' : 'https://identitytoolkit.googleapis.com';
export const AUTH_BASE_URL = `${AUTH_HOST}/v1`;

if (USE_EMULATOR) {
  console.log('🔥 Using Firebase Emulators');
  console.log('Firestore:', FIRESTORE_BASE_URL);
  console.log('Auth:', AUTH_BASE_URL);
}

// Collection names
export const COLLECTIONS = {
  RSVPS: 'rsvps',
} as const;

// RSVP types matching Firestore structure
export interface ExtraPerson {
  naam: string;
  email?: string;
}

export interface RSVPData {
  naam: string;
  email: string;
  aanwezigheid: '2-nachten' | '1-nacht' | 'alleen-vrijdag' | 'betaal-heel-weekend' | 'wil-graag-maar-kan-niet' | 'niet';
  extraPersonen: ExtraPerson[];
}

export interface RSVP extends RSVPData {
  id: string;
  timestamp: string;
}

// Auth types
export interface AuthToken {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
