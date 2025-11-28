import { RSVPFormData } from './validation';

// Costs constants
const COSTS = {
  OVERNACHTING: 8.85, // Per person per night (free for babies < 2)
  TOERISTENBELASTING: 1.33, // Per person per night (all ages)
  FIXED_SHARE: 4.36, // Fixed costs spread over visitors (€326.76 / 75)
};

export interface PriceLine {
  label: string;
  amount: number;
  details?: string;
}

export interface PriceBreakdown {
  totalPrice: number;
  lines: PriceLine[];
  explanation: string;
}

/**
 * Calculates the number of nights based on attendance option
 */
function getNights(option: string): number {
  switch (option) {
    case '2-nachten':
    case 'betaal-heel-weekend':
      return 2;
    case '1-nacht':
      return 1;
    default:
      return 0;
  }
}

/**
 * Calculates the total price for the RSVP
 */
export function calculatePrice(data: RSVPFormData): PriceBreakdown | null {
  const { aanwezigheid, extraPersonen } = data;

  if (aanwezigheid === 'niet' || aanwezigheid === 'wil-graag-maar-kan-niet' || !aanwezigheid) {
    return null;
  }

  const nights = getNights(aanwezigheid);
  const lines: PriceLine[] = [];
  let grandTotal = 0;

  // 1. Fixed Costs (Shared facilities)
  // Everyone pays this, including main person and extra persons
  const totalPersons = 1 + extraPersonen.length;
  const totalFixed = totalPersons * COSTS.FIXED_SHARE;
  grandTotal += totalFixed;
  lines.push({
    label: 'Bijdrage algemene kosten',
    amount: totalFixed,
    details: `${totalPersons} x €${COSTS.FIXED_SHARE.toFixed(2)} (huur materiaal, elektra, etc.)`
  });

  // 2. Overnight Costs (if applicable)
  if (nights > 0) {
    // Extra persons
    let payingAdults = 1; // Main person
    let payingTaxPersons = 1; // Main person

    extraPersonen.forEach(p => {
      payingTaxPersons++;
      if (!p.isBaby) {
        payingAdults++;
      }
    });

    const totalOvernachting = payingAdults * COSTS.OVERNACHTING * nights;
    const totalTax = payingTaxPersons * COSTS.TOERISTENBELASTING * nights;

    grandTotal += totalOvernachting;
    grandTotal += totalTax;

    lines.push({
      label: `Overnachting (${nights} nacht${nights > 1 ? 'en' : ''})`,
      amount: totalOvernachting,
      details: `${payingAdults} persoon x €${COSTS.OVERNACHTING.toFixed(2)} x ${nights}`
    });

    lines.push({
      label: 'Toeristenbelasting',
      amount: totalTax,
      details: `${payingTaxPersons} persoon x €${COSTS.TOERISTENBELASTING.toFixed(2)} x ${nights}`
    });
  }

  return {
    totalPrice: grandTotal,
    lines,
    explanation: 'De prijs is opgebouwd uit een vaste bijdrage voor de algemene kosten (huur tent, elektra, schoonmaak) plus de kosten voor overnachting en toeristenbelasting.'
  };
}
