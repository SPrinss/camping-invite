/**
 * PricingInfo component for the camping invite page
 * Displays detailed pricing info based on 2025 camping rates
 */

export function createPricingInfo(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pricing-info';

  container.innerHTML = `
    <div class="pricing-cards">
      <div class="pricing-card">
        <span class="pricing-card__label">2 Nachten kamperen</span>
        <span class="pricing-card__price">€40</span>
        <span class="pricing-card__detail">per persoon</span>
      </div>
      <div class="pricing-card">
        <span class="pricing-card__label">1 Nacht kamperen</span>
        <span class="pricing-card__price">€25</span>
        <span class="pricing-card__detail">per persoon</span>
      </div>
      <div class="pricing-card">
        <span class="pricing-card__label">Alleen vrijdagavond</span>
        <span class="pricing-card__price">€15</span>
        <span class="pricing-card__detail">per persoon</span>
      </div>
    </div>

    <details class="pricing-breakdown">
      <summary>Prijsopbouw (tarieven 2025)</summary>
      <table class="pricing-table">
        <tbody>
          <tr>
            <td>Overnachting per persoon per nacht</td>
            <td>€ 8,85</td>
          </tr>
          <tr>
            <td>Toeristenbelasting per persoon per nacht</td>
            <td>€ 1,33</td>
          </tr>
          <tr>
            <td>Dagactiviteit per persoon per dag</td>
            <td>€ 6,44</td>
          </tr>
          <tr>
            <td>Materiaal huur (geschat)</td>
            <td>€ 7,50</td>
          </tr>
          <tr>
            <td>Kinderen 0 t/m 2 jaar</td>
            <td>Gratis</td>
          </tr>
        </tbody>
      </table>
      <p class="pricing-breakdown__note">
        Daarnaast zijn er gedeelde kosten zoals elektra (€3,92/dag),
        schoonmaak (€37,50), reservering (€17,50), en tientje voor de natuur (€10).
      </p>
    </details>

    <p class="pricing-note">
      Voor kinderen 0-2 jaar is de camping gratis. Max 100 euro per gezin voor weekend.
    </p>

    <p class="pricing-note pricing-note--financial">
      Als je om financiële redenen overweegt niet te komen, laat het dan a.u.b. weten, dan lossen we dat gezamenlijk op :)
    </p>
  `;

  return container;
}

/**
 * Renders the pricing info component into the specified container
 */
export function renderPricingTable(containerId: string = 'pricing-table'): void {
  const container = document.getElementById(containerId);
  if (container) {
    const pricingInfo = createPricingInfo();
    container.replaceWith(pricingInfo);
    pricingInfo.id = containerId;
  }
}
