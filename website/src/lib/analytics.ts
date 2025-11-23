'use client';

type EventPayload = Record<string, string | number | boolean | null | undefined>;

// Safely call Umami's tracker when available in the browser.
export function trackEvent(eventName: string, data?: EventPayload) {
  if (typeof window === 'undefined') return;

  const umami = (window as unknown as { umami?: { track?: (name: string, payload?: EventPayload) => void } }).umami;
  umami?.track?.(eventName, data);
}
