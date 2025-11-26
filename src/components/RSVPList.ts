/**
 * RSVP List component for displaying all submitted RSVPs
 * Fetches data using authenticated REST calls from Task 5's api service
 */

import { getRSVPs } from '../services/api'; // Task 5 will create this

export interface RSVP {
  id?: string;
  naam: string;
  email: string;
  aanwezigheid: '2-nachten' | '1-nacht' | 'alleen-vrijdag' | 'betaal-heel-weekend' | 'wil-graag-maar-kan-niet' | 'niet';
  extraPersonen: Array<{ naam: string; email?: string }>;
  timestamp: string | { _seconds: number; _nanoseconds: number };
}

export interface RSVPListCallbacks {
  onLogout: () => void;
  onError?: (error: Error) => void;
}

/**
 * Creates and returns the RSVP list container element
 */
export function createRSVPList(token: string, callbacks: RSVPListCallbacks): HTMLElement {
  const container = document.createElement('div');
  container.className = 'rsvp-list-container';

  // Initial loading state
  container.innerHTML = `
    <div class="rsvp-list-header">
      <h2>RSVPs</h2>
      <button class="logout-button" id="logout-button">Uitloggen</button>
    </div>
    <div class="loading" id="rsvp-loading">
      <div class="loading-spinner"></div>
      <p>RSVPs laden...</p>
    </div>
  `;

  // Add logout handler
  const logoutButton = container.querySelector('#logout-button') as HTMLButtonElement;
  logoutButton.addEventListener('click', callbacks.onLogout);

  // Fetch and render RSVPs
  loadRSVPs(container, token, callbacks);

  return container;
}

/**
 * Fetches RSVPs and renders them in the container
 */
async function loadRSVPs(
  container: HTMLElement,
  token: string,
  callbacks: RSVPListCallbacks
): Promise<void> {
  const loadingDiv = container.querySelector('#rsvp-loading');

  try {
    const rsvps = await getRSVPs(token);

    if (loadingDiv) {
      loadingDiv.remove();
    }

    // Add stats section
    const statsHtml = createStatsSection(rsvps);
    const headerDiv = container.querySelector('.rsvp-list-header');
    if (headerDiv) {
      headerDiv.insertAdjacentHTML('afterend', statsHtml);
    }

    // Add table or empty state
    if (rsvps.length === 0) {
      container.insertAdjacentHTML('beforeend', `
        <div class="empty-state">
          <p>Nog geen RSVPs ontvangen.</p>
        </div>
      `);
    } else {
      const tableHtml = createRSVPTable(rsvps);
      container.insertAdjacentHTML('beforeend', tableHtml);
    }
  } catch (error) {
    if (loadingDiv) {
      loadingDiv.remove();
    }

    container.insertAdjacentHTML('beforeend', `
      <div class="error-message">
        <p>Kon RSVPs niet laden. ${error instanceof Error ? error.message : 'Probeer het opnieuw.'}</p>
      </div>
    `);

    if (callbacks.onError) {
      callbacks.onError(error instanceof Error ? error : new Error('Failed to load RSVPs'));
    }
  }
}

/**
 * Creates the stats section HTML
 */
function createStatsSection(rsvps: RSVP[]): string {
  const stats = calculateStats(rsvps);

  return `
    <div class="rsvp-stats">
      <div class="stat-item">
        <div class="stat-label">Totaal RSVPs</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">2 nachten</div>
        <div class="stat-value">${stats.twoNights}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">1 nacht</div>
        <div class="stat-value">${stats.oneNight}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Alleen vrijdag</div>
        <div class="stat-value">${stats.fridayOnly}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Betaal heel weekend</div>
        <div class="stat-value">${stats.paidWeekend}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Wil komen maar kan niet</div>
        <div class="stat-value">${stats.wantsButCant}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Kan niet komen</div>
        <div class="stat-value">${stats.notComing}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Totaal personen</div>
        <div class="stat-value">${stats.totalPeople}</div>
      </div>
    </div>
  `;
}

/**
 * Calculates statistics from the RSVP list
 */
function calculateStats(rsvps: RSVP[]): {
  total: number;
  twoNights: number;
  oneNight: number;
  fridayOnly: number;
  paidWeekend: number;
  wantsButCant: number;
  notComing: number;
  totalPeople: number;
} {
  const stats = {
    total: rsvps.length,
    twoNights: 0,
    oneNight: 0,
    fridayOnly: 0,
    paidWeekend: 0,
    wantsButCant: 0,
    notComing: 0,
    totalPeople: 0,
  };

  for (const rsvp of rsvps) {
    const personCount = 1 + (rsvp.extraPersonen?.length || 0);

    switch (rsvp.aanwezigheid) {
      case '2-nachten':
        stats.twoNights += personCount;
        stats.totalPeople += personCount;
        break;
      case '1-nacht':
        stats.oneNight += personCount;
        stats.totalPeople += personCount;
        break;
      case 'alleen-vrijdag':
        stats.fridayOnly += personCount;
        stats.totalPeople += personCount;
        break;
      case 'betaal-heel-weekend':
        stats.paidWeekend += personCount;
        stats.totalPeople += personCount;
        break;
      case 'wil-graag-maar-kan-niet':
        stats.wantsButCant += personCount;
        break;
      case 'niet':
        stats.notComing += personCount;
        break;
    }
  }

  return stats;
}

/**
 * Creates the RSVP table HTML
 */
function createRSVPTable(rsvps: RSVP[]): string {
  // Sort by timestamp descending (newest first)
  const sortedRsvps = [...rsvps].sort((a, b) => {
    const timeA = getTimestamp(a.timestamp);
    const timeB = getTimestamp(b.timestamp);
    return timeB - timeA;
  });

  const rows = sortedRsvps.map((rsvp) => createTableRow(rsvp)).join('');

  return `
    <table class="rsvp-table">
      <thead>
        <tr>
          <th>Naam</th>
          <th>E-mail</th>
          <th>Aanwezigheid</th>
          <th>Extra personen</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Creates a single table row for an RSVP
 */
function createTableRow(rsvp: RSVP): string {
  const attendanceLabel = getAttendanceLabel(rsvp.aanwezigheid);
  const attendanceClass = `attendance-${rsvp.aanwezigheid}`;
  const extraPersonsHtml = formatExtraPersons(rsvp.extraPersonen);
  const dateStr = formatDate(rsvp.timestamp);

  return `
    <tr>
      <td data-label="Naam">${escapeHtml(rsvp.naam)}</td>
      <td data-label="E-mail">${escapeHtml(rsvp.email)}</td>
      <td data-label="Aanwezigheid">
        <span class="attendance-badge ${attendanceClass}">${attendanceLabel}</span>
      </td>
      <td data-label="Extra personen">${extraPersonsHtml}</td>
      <td data-label="Datum">${dateStr}</td>
    </tr>
  `;
}

/**
 * Formats extra persons for display
 */
function formatExtraPersons(extraPersonen?: Array<{ naam: string; email?: string }>): string {
  if (!extraPersonen || extraPersonen.length === 0) {
    return '<span class="extra-persons">-</span>';
  }

  const persons = extraPersonen
    .map((person) => {
      const email = person.email ? ` (${escapeHtml(person.email)})` : '';
      return `${escapeHtml(person.naam)}${email}`;
    })
    .join(', ');

  return `<span class="extra-persons">${persons}</span>`;
}

/**
 * Gets a human-readable label for attendance type
 */
function getAttendanceLabel(aanwezigheid: string): string {
  const labels: Record<string, string> = {
    '2-nachten': '2 nachten',
    '1-nacht': '1 nacht',
    'alleen-vrijdag': 'Alleen vrijdag',
    'betaal-heel-weekend': 'Betaal heel weekend',
    'wil-graag-maar-kan-niet': 'Wil komen maar kan niet',
    'niet': 'Niet dit jaar',
  };

  return labels[aanwezigheid] || aanwezigheid;
}

/**
 * Converts timestamp to milliseconds
 */
function getTimestamp(timestamp: string | { _seconds: number; _nanoseconds: number }): number {
  if (typeof timestamp === 'string') {
    return new Date(timestamp).getTime();
  }
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
    return timestamp._seconds * 1000;
  }
  return 0;
}

/**
 * Formats a timestamp for display
 */
function formatDate(timestamp: string | { _seconds: number; _nanoseconds: number }): string {
  const ms = getTimestamp(timestamp);
  if (ms === 0) return '-';

  const date = new Date(ms);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Renders the RSVP list into the specified container
 */
export function renderRSVPList(
  containerId: string,
  token: string,
  callbacks: RSVPListCallbacks
): void {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
    container.appendChild(createRSVPList(token, callbacks));
  }
}
