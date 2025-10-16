"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "About" },
    { href: "/logbook", label: "Logbook" },
    { href: "/crew-only", label: "Crew Only" }
  ];

  return (
    <nav className="flex gap-3 p-1 rounded-xl w-fit mx-auto my-6">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative px-5 py-2 rounded text-xl font-medium transition-all
              ${
                isActive
                  ? "bg-gray-700 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
