"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Proyek" },
  { href: "/settings", label: "Pengaturan" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-6 flex flex-col">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-8">IndoBlockforge</h1>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-gray-700 text-blue-400"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <button
          onClick={handleSignOut}
          className="w-full text-left px-4 py-2 rounded-lg transition-colors hover:bg-red-600"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
