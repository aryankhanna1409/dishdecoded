"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Decode a dish" },
  { href: "/menu", label: "Menu" },
  { href: "/pantry", label: "Cook tonight" },
  { href: "/saved", label: "Saved" },
  { href: "/profile", label: "My tastes" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-4xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Dish<span className="text-orange-600">Decoded</span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 ${
                path === l.href ? "bg-orange-100 text-orange-800 font-medium" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
