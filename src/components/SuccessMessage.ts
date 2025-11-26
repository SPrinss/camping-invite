/**
 * Success message component shown after successful RSVP submission
 * Displays a confirmation message with confetti animation
 */

import { triggerConfetti } from '../utils/confetti';

export interface SuccessMessageOptions {
  containerElement: HTMLElement;
  onAnimationComplete?: () => void;
}

/**
 * Creates the success message HTML element
 */
export function createSuccessMessage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'success-message';
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'polite');

  container.innerHTML = `
    <div class="success-message-content">
      <div class="success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      </div>
      <h2 class="success-title">Bedankt voor je aanmelding!</h2>
      <p class="success-subtitle">We hebben je RSVP ontvangen.</p>
      <div class="success-tent" aria-hidden="true">
        <svg viewBox="0 0 120 80" width="120" height="80">
          <polygon points="60,5 10,75 110,75" fill="var(--color-forest)" opacity="0.8"/>
          <polygon points="60,5 35,75 85,75" fill="var(--color-forest-light)" opacity="0.9"/>
          <rect x="50" y="50" width="20" height="25" fill="var(--color-bark)" rx="2"/>
        </svg>
      </div>
      <div class="success-note">
        <p>Wil je je aanmelding wijzigen?</p>
        <p>Stuur een mailtje naar <strong>Sam of Martina</strong>.</p>
      </div>
    </div>
  `;

  return container;
}

/**
 * Shows the success message with confetti animation
 * Replaces the form content with the success message
 */
export function showSuccessMessage(options: SuccessMessageOptions): void {
  const { containerElement, onAnimationComplete } = options;

  // Create and append success message
  const successMessage = createSuccessMessage();

  // Clear the container and add success message with animation
  containerElement.innerHTML = '';
  containerElement.appendChild(successMessage);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    successMessage.classList.add('success-message-visible');
  });

  // Trigger confetti
  triggerConfetti();

  // Call completion callback after animations
  if (onAnimationComplete) {
    setTimeout(onAnimationComplete, 3000);
  }
}

/**
 * Callback function to be passed to Form component
 * This is the main integration point with Task 4
 */
export function onSuccess(formContainer: HTMLElement): void {
  showSuccessMessage({
    containerElement: formContainer
  });
}
