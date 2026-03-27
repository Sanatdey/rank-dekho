"use client";

import Link from "next/link";
import { trackEvent } from "../utils/gtag";

type Props = {
  href: string;
  event: string;
  location?: string;
  className?: string;
  children: React.ReactNode;
};

export default function TrackedLinkButton({
  href,
  event,
  location,
  className,
  children,
}: Props) {
  return (
    <Link href={href}>
      <button
        onClick={() =>
          trackEvent(event, { location: location || "unknown" })
        }
        className={className}
      >
        {children}
      </button>
    </Link>
  );
}