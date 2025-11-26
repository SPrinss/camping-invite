/**
 * Header component for the camping invite page
 * Displays the main title and decorative elements
 */

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';

  header.innerHTML = `
    <div class="header-content">
      <div class="header-decoration campfire-icon"></div>
      <h1 class="header-title">
        <span class="title-line title-line-1">Het grote vrienden</span>
        <span class="title-line title-line-2">kampeerfeest</span>
      </h1>
      <p class="header-date">7-9 augustus 2026</p>
      <div class="header-decoration tent-icon"></div>
    </div>
  `;

  return header;
}

/**
 * Renders the header component into the specified container
 */
export function renderHeader(containerId: string = 'header'): void {
  const container = document.getElementById(containerId);
  if (container) {
    const header = createHeader();
    container.replaceWith(header);
    header.id = containerId;
  }
}
