"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `px-3 py-1 rounded-md text-sm ${
      pathname === path
        ? "bg-black text-white"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          RankDekho
        </Link>

        {/* Links */}
        <div className="flex gap-2">
          <Link href="/" className={linkStyle("/")}>
            Home
          </Link>
          <Link href="/leaderboard" className={linkStyle("/leaderboard")}>
            Leaderboard
          </Link>
          <Link href="/submit" className={linkStyle("/submit")}>
            Submit
          </Link>
        </div>

      </div>
    </nav>
  );
}