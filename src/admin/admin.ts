/**
 * Admin page main entry point
 * Handles authentication state and renders appropriate views
 */

import '../styles/main.css';
import { renderLoginForm } from '../components/LoginForm';
import { renderRSVPList } from '../components/RSVPList';

// Storage key for auth token
const AUTH_TOKEN_KEY = 'camping_admin_token';

/**
 * Main admin application class
 */
class AdminApp {
  private containerId = 'admin-content';
  private token: string | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize the admin app
   */
  private init(): void {
    // Check for existing token in session storage
    this.token = sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (this.token) {
      this.showRSVPList();
    } else {
      this.showLoginForm();
    }
  }

  /**
   * Shows the login form
   */
  private showLoginForm(): void {
    renderLoginForm(this.containerId, {
      onLoginSuccess: (token: string) => this.handleLoginSuccess(token),
      onLoginError: (error: Error) => this.handleLoginError(error),
    });
  }

  /**
   * Shows the RSVP list
   */
  private showRSVPList(): void {
    if (!this.token) {
      this.showLoginForm();
      return;
    }

    renderRSVPList(this.containerId, this.token, {
      onLogout: () => this.handleLogout(),
      onError: (error: Error) => this.handleRSVPError(error),
    });
  }

  /**
   * Handles successful login
   */
  private handleLoginSuccess(token: string): void {
    this.token = token;
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    this.showRSVPList();
  }

  /**
   * Handles login error
   */
  private handleLoginError(error: Error): void {
    console.error('Login error:', error);
    // Error is already displayed by the LoginForm component
  }

  /**
   * Handles logout
   */
  private handleLogout(): void {
    this.token = null;
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    this.showLoginForm();
  }

  /**
   * Handles RSVP fetch error
   */
  private handleRSVPError(error: Error): void {
    console.error('RSVP fetch error:', error);

    // If unauthorized, redirect to login
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      this.handleLogout();
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdminApp();
});
