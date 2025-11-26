/**
 * Login form component for admin authentication
 * Uses Firebase Auth REST API via Task 5's api service
 */

import { login } from '../services/api'; // Task 5 will create this

export interface LoginFormCallbacks {
  onLoginSuccess: (token: string) => void;
  onLoginError?: (error: Error) => void;
}

/**
 * Creates and returns the login form element
 */
export function createLoginForm(callbacks: LoginFormCallbacks): HTMLElement {
  const container = document.createElement('div');
  container.className = 'login-container';

  container.innerHTML = `
    <h2>Inloggen</h2>
    <div class="login-error" id="login-error"></div>
    <form id="login-form">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autocomplete="email"
          placeholder="admin@example.com"
        />
      </div>
      <div class="form-group">
        <label for="password">Wachtwoord</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
        />
      </div>
      <button type="submit" class="login-button" id="login-button">
        Inloggen
      </button>
    </form>
  `;

  const form = container.querySelector('#login-form') as HTMLFormElement;
  const errorDiv = container.querySelector('#login-error') as HTMLElement;
  const submitButton = container.querySelector('#login-button') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('#email') as HTMLInputElement;
    const passwordInput = form.querySelector('#password') as HTMLInputElement;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous errors
    hideError(errorDiv);

    // Disable form while submitting
    setFormLoading(submitButton, true);

    try {
      const authResult = await login(email, password);
      callbacks.onLoginSuccess(authResult.idToken);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorDiv, errorMessage);

      if (callbacks.onLoginError) {
        callbacks.onLoginError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setFormLoading(submitButton, false);
    }
  });

  return container;
}

/**
 * Shows an error message in the error container
 */
function showError(errorDiv: HTMLElement, message: string): void {
  errorDiv.textContent = message;
  errorDiv.classList.add('visible');
}

/**
 * Hides the error message
 */
function hideError(errorDiv: HTMLElement): void {
  errorDiv.textContent = '';
  errorDiv.classList.remove('visible');
}

/**
 * Sets the form loading state
 */
function setFormLoading(button: HTMLButtonElement, loading: boolean): void {
  button.disabled = loading;
  button.textContent = loading ? 'Bezig met inloggen...' : 'Inloggen';
}

/**
 * Converts Firebase auth errors to user-friendly Dutch messages
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid') || message.includes('wrong-password') || message.includes('user-not-found')) {
      return 'Ongeldige e-mail of wachtwoord';
    }
    if (message.includes('too-many-requests')) {
      return 'Te veel pogingen. Probeer het later opnieuw.';
    }
    if (message.includes('network')) {
      return 'Netwerkfout. Controleer je internetverbinding.';
    }

    return error.message;
  }

  return 'Er is een fout opgetreden. Probeer het opnieuw.';
}

/**
 * Renders the login form into the specified container
 */
export function renderLoginForm(containerId: string, callbacks: LoginFormCallbacks): void {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
    container.appendChild(createLoginForm(callbacks));
  }
}
