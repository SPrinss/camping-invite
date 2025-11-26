// Firebase REST API functions for RSVP operations
import {
  firebaseConfig,
  FIRESTORE_BASE_URL,
  AUTH_BASE_URL,
  COLLECTIONS,
  RSVPData,
  RSVP,
  AuthToken,
} from './firebase';

/**
 * Submit a new RSVP to Firestore
 * Called by the RSVP form component (Task 4)
 */
export async function submitRSVP(data: RSVPData): Promise<void> {
  const url = `${FIRESTORE_BASE_URL}/${COLLECTIONS.RSVPS}`;

  // Convert data to Firestore REST API format
  const firestoreDocument = {
    fields: {
      naam: { stringValue: data.naam },
      email: { stringValue: data.email },
      aanwezigheid: { stringValue: data.aanwezigheid },
      extraPersonen: {
        arrayValue: {
          values: data.extraPersonen.map((person) => ({
            mapValue: {
              fields: {
                naam: { stringValue: person.naam },
                ...(person.email ? { email: { stringValue: person.email } } : {}),
              },
            },
          })),
        },
      },
      timestamp: { timestampValue: new Date().toISOString() },
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(firestoreDocument),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to submit RSVP');
  }
}

/**
 * Login with email and password using Firebase Auth REST API
 * Called by the admin login form (Task 6)
 */
export async function login(email: string, password: string): Promise<AuthToken> {
  const url = `${AUTH_BASE_URL}/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMessage = error.error?.message || 'Login failed';

    // Provide user-friendly error messages
    if (errorMessage.includes('EMAIL_NOT_FOUND') || errorMessage.includes('INVALID_PASSWORD')) {
      throw new Error('Ongeldige email of wachtwoord');
    }
    if (errorMessage.includes('TOO_MANY_ATTEMPTS')) {
      throw new Error('Te veel pogingen. Probeer later opnieuw.');
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
  };
}

/**
 * Fetch all RSVPs from Firestore (requires authentication)
 * Called by the admin view (Task 6)
 */
export async function getRSVPs(token: string): Promise<RSVP[]> {
  const url = `${FIRESTORE_BASE_URL}/${COLLECTIONS.RSVPS}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 403 || response.status === 401) {
      throw new Error('Geen toegang. Log opnieuw in.');
    }
    throw new Error(error.error?.message || 'Failed to fetch RSVPs');
  }

  const data = await response.json();

  // Parse Firestore documents to RSVP objects
  if (!data.documents) {
    return [];
  }

  return data.documents.map((doc: any) => parseFirestoreDocument(doc));
}

/**
 * Parse a Firestore REST API document to an RSVP object
 */
function parseFirestoreDocument(doc: any): RSVP {
  const fields = doc.fields;
  const id = doc.name.split('/').pop();

  return {
    id,
    naam: fields.naam?.stringValue || '',
    email: fields.email?.stringValue || '',
    aanwezigheid: fields.aanwezigheid?.stringValue as RSVP['aanwezigheid'],
    extraPersonen: parseExtraPersonen(fields.extraPersonen),
    timestamp: fields.timestamp?.timestampValue || '',
  };
}

/**
 * Parse the extraPersonen array from Firestore format
 */
function parseExtraPersonen(field: any): RSVP['extraPersonen'] {
  if (!field?.arrayValue?.values) {
    return [];
  }

  return field.arrayValue.values.map((item: any) => {
    const personFields = item.mapValue?.fields || {};
    return {
      naam: personFields.naam?.stringValue || '',
      email: personFields.email?.stringValue,
    };
  });
}
