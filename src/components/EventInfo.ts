/**
 * EventInfo component for the camping invite page
 * Displays the warm, casual invitation text and event details
 */

export function createEventInfo(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'event-info';

  section.innerHTML = `
    <div class="event-info-content">
      <div class="intro-text">
        <p class="greeting">Hallo allen!</p>
        <p>
          Het is tijd voor een gezellig kampeerweekend! Met marshmallows bij het kampvuur, een plons wagen in de Randmeren,
          óf gewoon met een koud biertje in je hand lekker bij kletsen, het kan allemaal!
        </p>
        <p>
          We gaan kamperen op
          <a href="https://www.logerenbijdeboswachter.nl/groepskamperen/groepskampeerterrein-de-banken-zeewolde"
             target="_blank"
             rel="noopener noreferrer"
             class="inline-location-link">
            Groepskampeerterrein de Banken
          </a>
          van 7-9 augustus 2026.
          <br>
          <a href="https://www.google.com/maps/dir/?api=1&destination=Dasselaarweg+45,+3896+LT+Zeewolde"
             target="_blank"
             rel="noopener noreferrer"
             class="route-link">
            📍 Route naar locatie
          </a>
        </p>
        <p>
          <strong>Vrijdagavond is er een potluck! Neem wat lekkers te eten mee!</strong>
        </p>
        <p>
          Je kunt zelf kiezen hoe lang je blijft: alleen vrijdagavond komen eten, of je neemt je tent mee en blijft 1 of 2 nachten kamperen.
        </p>
        <p>
          Wil je nog iemand anders meenemen (naast je partner/gezin)? Dat kan! Vul de naam in op het formulier, of vraag degene om het formulier zelf in te vullen.
        </p>
      </div>
    </div>
  `;

  return section;
}

/**
 * Renders the event info component into the specified container
 */
export function renderEventInfo(containerId: string = 'event-info'): void {
  const container = document.getElementById(containerId);
  if (container) {
    const eventInfo = createEventInfo();
    container.replaceWith(eventInfo);
    eventInfo.id = containerId;
  }
}
