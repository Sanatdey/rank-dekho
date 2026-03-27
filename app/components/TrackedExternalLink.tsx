"use client";

import { trackEvent } from "../utils/gtag";

export default function TrackedExternalLink({
  href,
  event,
  location,
  children,
  className,
}: any) {
  return (
    <a
      href={href}
      target="_blank"
      onClick={() => trackEvent(event, { location })}
      className={className}
    >
      {children}
    </a>
  );
}