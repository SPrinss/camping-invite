// RSVP Form component
import { RSVPFormData, ExtraPerson, validateForm, validateField } from '../utils/validation';
import { createExtraPersons } from './ExtraPersons';
import { submitRSVP } from '../services/api'; // Task 5 will create this

export type AttendanceOption = '2-nachten' | '1-nacht' | 'alleen-vrijdag' | 'betaal-heel-weekend' | 'wil-graag-maar-kan-niet' | 'niet';

interface FormState {
  naam: string;
  email: string;
  aanwezigheid: AttendanceOption | '';
  extraPersonen: ExtraPerson[];
  isSubmitting: boolean;
  errors: string[];
}

const ATTENDANCE_OPTIONS: { value: AttendanceOption; label: string }[] = [
  { value: '2-nachten', label: '2 nachten kamperen (vrijdag + zaterdag)' },
  { value: '1-nacht', label: '1 nacht kamperen (vrijdag)' },
  { value: 'alleen-vrijdag', label: 'Alleen vrijdagavond eten (niet overnachten)' },
  { value: 'betaal-heel-weekend', label: 'Betaal voor heel weekend, weet nog niet hoe lang ik blijf' },
  { value: 'wil-graag-maar-kan-niet', label: 'Wil heel graag komen, maar kan die dagen niet' },
  { value: 'niet', label: 'Leuk, maar niet voor mij dit jaar' }
];

/**
 * Creates and initializes the RSVP form
 */
export function createForm(
  container: HTMLElement,
  onSuccess: () => void
): {
  reset: () => void;
} {
  let state: FormState = {
    naam: '',
    email: '',
    aanwezigheid: '',
    extraPersonen: [],
    isSubmitting: false,
    errors: []
  };

  let extraPersonsComponent: ReturnType<typeof createExtraPersons> | null = null;

  function render(): void {
    container.innerHTML = `
      <form id="rsvp-form" class="rsvp-form" novalidate>
        <div class="form-section">
          <h3 class="form-section-title">Wanneer kom je?</h3>
          <div class="radio-group">
            ${ATTENDANCE_OPTIONS.map(option => `
              <label class="radio-option ${state.aanwezigheid === option.value ? 'radio-option--selected' : ''}">
                <input
                  type="radio"
                  name="aanwezigheid"
                  value="${option.value}"
                  ${state.aanwezigheid === option.value ? 'checked' : ''}
                />
                <span class="radio-option__indicator"></span>
                <span class="radio-option__label">${option.label}</span>
              </label>
            `).join('')}
          </div>
          <span class="form-error" id="aanwezigheid-error"></span>
        </div>

        <div class="form-section">
          <h3 class="form-section-title">Jouw gegevens</h3>
          <div class="form-group">
            <label class="form-label form-label--required" for="naam">Naam</label>
            <input
              type="text"
              id="naam"
              name="naam"
              class="form-input"
              value="${escapeHtml(state.naam)}"
              placeholder="Je naam"
              required
            />
            <span class="form-error" id="naam-error"></span>
          </div>

          <div class="form-group">
            <label class="form-label form-label--required" for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              value="${escapeHtml(state.email)}"
              placeholder="je@email.nl"
              required
            />
            <span class="form-error" id="email-error"></span>
          </div>
        </div>

        <div class="form-section">
          <h3 class="form-section-title">Neem je iemand mee?</h3>
          <p class="form-section-description">Voeg hier je partner, kinderen, vrienden of andere gasten toe.</p>
          <div id="extra-persons-container"></div>
        </div>

        ${state.errors.length > 0 ? `
          <div class="alert alert--error" role="alert">
            <p><strong>Er zijn fouten gevonden:</strong></p>
            <ul>
              ${state.errors.map(error => `<li>${escapeHtml(error)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn--primary btn--lg"
            ${state.isSubmitting ? 'disabled' : ''}
          >
            ${state.isSubmitting ? '<span class="spinner"></span> Bezig met versturen...' : 'Verstuur'}
          </button>
        </div>
      </form>
    `;

    attachEventListeners();
    initExtraPersons();
  }

  function attachEventListeners(): void {
    const form = container.querySelector('#rsvp-form') as HTMLFormElement;
    const naamInput = container.querySelector('#naam') as HTMLInputElement;
    const emailInput = container.querySelector('#email') as HTMLInputElement;
    const radioButtons = container.querySelectorAll('input[name="aanwezigheid"]');

    form.addEventListener('submit', handleSubmit);

    naamInput.addEventListener('input', (e) => {
      state.naam = (e.target as HTMLInputElement).value;
    });

    naamInput.addEventListener('blur', () => {
      const error = validateField('naam', state.naam);
      showFieldError('naam', error);
    });

    emailInput.addEventListener('input', (e) => {
      state.email = (e.target as HTMLInputElement).value;
    });

    emailInput.addEventListener('blur', () => {
      const error = validateField('email', state.email);
      showFieldError('email', error);
    });

    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.aanwezigheid = (e.target as HTMLInputElement).value as AttendanceOption;
        clearFieldError('aanwezigheid');
        render();
      });
    });
  }

  function initExtraPersons(): void {
    const extraPersonsContainer = container.querySelector('#extra-persons-container') as HTMLElement;
    extraPersonsComponent = createExtraPersons(
      extraPersonsContainer,
      (persons) => {
        state.extraPersonen = persons;
      }
    );
  }

  function showFieldError(field: string, error: string): void {
    const errorSpan = container.querySelector(`#${field}-error`) as HTMLElement;
    const input = container.querySelector(`#${field}`) as HTMLInputElement;

    if (error) {
      errorSpan.textContent = error;
      input?.classList.add('invalid');
    } else {
      errorSpan.textContent = '';
      input?.classList.remove('invalid');
    }
  }

  function clearFieldError(field: string): void {
    const errorSpan = container.querySelector(`#${field}-error`) as HTMLElement;
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (state.isSubmitting) return;

    // Clear previous errors
    state.errors = [];

    // Get current extra persons from component
    if (extraPersonsComponent) {
      state.extraPersonen = extraPersonsComponent.getPersons();
    }

    const formData: RSVPFormData = {
      naam: state.naam,
      email: state.email,
      aanwezigheid: state.aanwezigheid,
      extraPersonen: state.extraPersonen
    };

    const validation = validateForm(formData);

    if (!validation.valid) {
      state.errors = validation.errors;
      render();
      // Scroll to errors
      const errorDiv = container.querySelector('.alert--error');
      errorDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Submit form
    state.isSubmitting = true;
    render();

    try {
      // Cast to RSVPData - validation ensures aanwezigheid is not empty
      await submitRSVP(formData as import('../services/firebase').RSVPData);
      onSuccess();
    } catch (error) {
      state.isSubmitting = false;
      state.errors = ['Er ging iets mis bij het versturen. Probeer het opnieuw.'];
      render();
      console.error('Form submission error:', error);
    }
  }

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function reset(): void {
    state = {
      naam: '',
      email: '',
      aanwezigheid: '',
      extraPersonen: [],
      isSubmitting: false,
      errors: []
    };
    render();
  }

  // Initialize
  render();

  return {
    reset
  };
}
