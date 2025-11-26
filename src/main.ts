/**
 * Main entry point for the camping invite website
 * Initializes all components on page load
 */

import { renderHeader } from './components/Header';
import { renderEventInfo } from './components/EventInfo';
import { renderPricingTable } from './components/PricingTable';
import { createForm } from './components/Form';
import { onSuccess } from './components/SuccessMessage';
import './styles/success.css';

/**
 * Initialize all page components
 */
function initializePage(): void {
  // Render static content components
  renderHeader('header');
  renderEventInfo('event-info');
  renderPricingTable('pricing-table');

  // Initialize RSVP form
  const formContainer = document.getElementById('rsvp-form');
  if (formContainer) {
    createForm(formContainer, () => {
      // On successful submission, show success message with confetti
      onSuccess(formContainer);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
