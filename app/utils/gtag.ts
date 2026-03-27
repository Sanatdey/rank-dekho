// utils/gtag.ts
export const trackEvent = (name: string, params = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
};