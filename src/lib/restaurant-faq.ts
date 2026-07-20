import type { Restaurant } from "./data";
import type { AttributeGroup } from "./attribute-groups";

export type Faq = { question: string; answer: string };

export function buildRestaurantFaqs(restaurant: Restaurant, attributeGroups: AttributeGroup[]): Faq[] {
  const faqs: Faq[] = [];
  const name = restaurant.name;
  const groupMap = new Map(attributeGroups.map((g) => [g.label, g.items]));

  if (restaurant.opening_hours) {
    faqs.push({
      question: `What are ${name}'s opening hours?`,
      answer: `${name} is open: ${restaurant.opening_hours.replace(/\s\|\s/g, "; ")}.`,
    });
  }

  const practical = groupMap.get("Practical Info") ?? [];
  if (restaurant.booking_link) {
    faqs.push({
      question: `Can I book a table at ${name}?`,
      answer: `Yes, you can book directly through ${name}'s booking page (linked on this page).`,
    });
  } else if (practical.some((a) => /walk-in/i.test(a))) {
    faqs.push({
      question: `Can I book a table at ${name}?`,
      answer: `${name} operates on a walk-in basis rather than bookings, based on its listed details.`,
    });
  } else if (practical.some((a) => /reservation/i.test(a))) {
    faqs.push({
      question: `Can I book a table at ${name}?`,
      answer: `${name} accepts reservations, though no online booking link is listed here, so it's best to contact the restaurant directly.`,
    });
  }

  const accessibility = groupMap.get("Accessibility") ?? [];
  if (accessibility.length > 0) {
    faqs.push({
      question: `Is ${name} wheelchair accessible?`,
      answer: `Yes, based on its listed details: ${accessibility.join(", ")}.`,
    });
  }

  const outdoor = groupMap.get("Outdoor & Seating") ?? [];
  if (outdoor.length > 0) {
    faqs.push({
      question: `Does ${name} have outdoor seating?`,
      answer: `Yes: ${outdoor.join(", ")}.`,
    });
  }

  const dietary = groupMap.get("Dietary Options") ?? [];
  if (dietary.length > 0) {
    faqs.push({
      question: `Does ${name} cater to dietary requirements?`,
      answer: `Yes, listed options include: ${dietary.join(", ")}.`,
    });
  }

  const parking = groupMap.get("Parking") ?? [];
  if (parking.length > 0) {
    faqs.push({
      question: `Is parking available at ${name}?`,
      answer: `Yes: ${parking.join(", ")}.`,
    });
  }

  if (restaurant.delivery_platforms && restaurant.delivery_platforms.length > 0) {
    faqs.push({
      question: `Does ${name} offer delivery?`,
      answer: `Yes, ${name} offers delivery through the platform(s) linked on this page.`,
    });
  }

  if (restaurant.price_range) {
    faqs.push({
      question: `What's the price range at ${name}?`,
      answer: `${name} is priced at ${restaurant.price_range}.`,
    });
  }

  return faqs;
}
