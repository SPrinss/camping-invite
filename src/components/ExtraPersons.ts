// ExtraPersons component - expandable list for additional attendees
import { ExtraPerson, isNotEmpty, isValidEmail } from '../utils/validation';

const MAX_EXTRA_PERSONS = 10;

export interface ExtraPersonsState {
  persons: ExtraPerson[];
}

/**
 * Creates the ExtraPersons component
 */
export function createExtraPersons(
  container: HTMLElement,
  onChange: (persons: ExtraPerson[]) => void
): {
  getPersons: () => ExtraPerson[];
  reset: () => void;
} {
  let state: ExtraPersonsState = {
    persons: []
  };

  function render(): void {
    container.innerHTML = `
      <div class="extra-persons">
        <div class="extra-persons-list" id="extra-persons-list"></div>
        <button
          type="button"
          class="btn btn--add"
          id="btn-add-person"
          ${state.persons.length >= MAX_EXTRA_PERSONS ? 'disabled' : ''}
        >
          + Persoon toevoegen
        </button>
        ${state.persons.length >= MAX_EXTRA_PERSONS
          ? '<p class="form-hint">Maximum aantal personen bereikt</p>'
          : ''
        }
      </div>
    `;

    const listContainer = container.querySelector('#extra-persons-list') as HTMLElement;
    renderPersonsList(listContainer);

    const addButton = container.querySelector('#btn-add-person') as HTMLButtonElement;
    addButton.addEventListener('click', handleAddPerson);
  }

  function renderPersonsList(listContainer: HTMLElement): void {
    if (state.persons.length === 0) {
      listContainer.innerHTML = '';
      return;
    }

    listContainer.innerHTML = state.persons.map((person, index) => `
      <div class="extra-person" data-index="${index}">
        <div class="extra-person__fields">
          <div class="form-group">
            <label class="form-label form-label--required" for="extra-naam-${index}">Naam</label>
            <input
              type="text"
              id="extra-naam-${index}"
              class="form-input extra-naam"
              data-index="${index}"
              value="${escapeHtml(person.naam)}"
              placeholder="Naam"
              required
            />
            <span class="form-error" id="extra-naam-error-${index}"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="extra-email-${index}">Email (optioneel)</label>
            <input
              type="email"
              id="extra-email-${index}"
              class="form-input extra-email"
              data-index="${index}"
              value="${escapeHtml(person.email || '')}"
              placeholder="Email (optioneel)"
            />
            <span class="form-error" id="extra-email-error-${index}"></span>
          </div>
          <div class="form-group form-group--checkbox">
            <label class="checkbox-label">
              <input
                type="checkbox"
                class="extra-baby"
                data-index="${index}"
                ${person.isBaby ? 'checked' : ''}
              >
              <span class="checkbox-text">Baby (< 2 jaar)</span>
            </label>
          </div>
        </div>
        <div class="extra-person__remove">
          <button type="button" class="btn btn--remove" data-index="${index}" aria-label="Verwijder persoon">
            ✕
          </button>
        </div>
      </div>
    `).join('');

    // Attach event listeners
    listContainer.querySelectorAll('.btn--remove').forEach(btn => {
      btn.addEventListener('click', handleRemovePerson);
    });

    listContainer.querySelectorAll('.extra-naam').forEach(input => {
      input.addEventListener('input', handleNameChange);
      input.addEventListener('change', handleNameChange);
      input.addEventListener('blur', handleNameBlur);
    });

    listContainer.querySelectorAll('.extra-email').forEach(input => {
      input.addEventListener('input', handleEmailChange);
      input.addEventListener('change', handleEmailChange);
      input.addEventListener('blur', handleEmailBlur);
    });

    listContainer.querySelectorAll('.extra-baby').forEach(input => {
      input.addEventListener('change', handleBabyChange);
    });
  }

  function handleBabyChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const index = parseInt(input.dataset.index || '0', 10);

    state.persons = state.persons.map((person, i) =>
      i === index ? { ...person, isBaby: input.checked } : person
    );
    onChange(state.persons);
  }

  function handleAddPerson(): void {
    if (state.persons.length >= MAX_EXTRA_PERSONS) return;

    state.persons = [...state.persons, { naam: '', email: '', isBaby: false }];
    render();
    onChange(state.persons);

    // Focus the new name input
    const newIndex = state.persons.length - 1;
    const newInput = container.querySelector(`#extra-naam-${newIndex}`) as HTMLInputElement;
    if (newInput) {
      newInput.focus();
    }
  }

  function handleRemovePerson(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index || '0', 10);

    state.persons = state.persons.filter((_, i) => i !== index);
    render();
    onChange(state.persons);
  }

  function handleNameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const index = parseInt(input.dataset.index || '0', 10);

    state.persons = state.persons.map((person, i) =>
      i === index ? { ...person, naam: input.value } : person
    );
    onChange(state.persons);
  }

  function handleEmailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const index = parseInt(input.dataset.index || '0', 10);

    state.persons = state.persons.map((person, i) =>
      i === index ? { ...person, email: input.value } : person
    );
    onChange(state.persons);
  }

  function handleNameBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const index = parseInt(input.dataset.index || '0', 10);
    const errorSpan = container.querySelector(`#extra-naam-error-${index}`) as HTMLElement;

    if (!isNotEmpty(input.value)) {
      input.classList.add('invalid');
      errorSpan.textContent = 'Naam is verplicht';
    } else {
      input.classList.remove('invalid');
      errorSpan.textContent = '';
    }
  }

  function handleEmailBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const index = parseInt(input.dataset.index || '0', 10);
    const errorSpan = container.querySelector(`#extra-email-error-${index}`) as HTMLElement;

    if (input.value.trim() !== '' && !isValidEmail(input.value)) {
      input.classList.add('invalid');
      errorSpan.textContent = 'Ongeldig emailadres';
    } else {
      input.classList.remove('invalid');
      errorSpan.textContent = '';
    }
  }

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize
  render();

  return {
    getPersons: () => state.persons,
    reset: () => {
      state.persons = [];
      render();
      onChange(state.persons);
    }
  };
}
