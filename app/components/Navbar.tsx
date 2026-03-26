"use client";
import Link from "next/link";
import Image from "next/image";
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
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/hanuman_logo_transparent.png" 
            alt="Rank Dekho Logo" 
            width={45} 
            height={45}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Rank
            </span>
            <span className="text-xs font-bold text-gray-500 -mt-1 tracking-widest">
              DEKHO
            </span>
          </div>
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