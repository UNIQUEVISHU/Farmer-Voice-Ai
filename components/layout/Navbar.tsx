"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, Stethoscope, CloudSun, MessageCircle, Home } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/disease", label: "Disease Detection", icon: Stethoscope },
  { href: "/weather", label: "Weather", icon: CloudSun },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "HI">("EN");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700">
            <Leaf className="h-5 w-5 text-white" />
          </span>
          <span className="text-base font-semibold text-green-900 sm:text-lg">
            Farming Consultant
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-800"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center rounded-full border border-green-200 bg-green-50 p-1">
            {(["EN", "HI"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setLang(option)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  lang === option
                    ? "bg-green-700 text-white"
                    : "text-green-700 hover:bg-green-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-green-800 hover:bg-green-50 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-green-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-800"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 flex items-center justify-between rounded-full border border-green-200 bg-green-50 p-1">
            {(["EN", "HI"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setLang(option)}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  lang === option
                    ? "bg-green-700 text-white"
                    : "text-green-700 hover:bg-green-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}