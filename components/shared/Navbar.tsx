"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Home, ShieldAlert, CloudSun, MessageSquare, Sprout } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/disease", label: "Disease Detection", icon: ShieldAlert },
  { href: "/weather", label: "Weather", icon: CloudSun },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "HI", label: "हिन्दी" },
  { code: "PB", label: "ਪੰਜਾਬੀ" },
  { code: "BN", label: "বাংলা" },
  { code: "TE", label: "తెలుగు" },
  { code: "MR", label: "मराठी" },
  { code: "TA", label: "தமிழ்" },
] as const;

type LangCode = typeof LANGUAGES[number]["code"];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<LangCode>("EN");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleBtnRef.current?.focus();
  }, []);

  // Floating behavior: once the page scrolls, shrink the bar slightly and
  // intensify the glass effect so it visually "lifts" off the page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle accessibility and body scrolls on mobile menu open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeMenu]);

  // Dynamic language handler that dispatches events to page.tsx
  const handleLanguageChange = (selectedLang: LangCode) => {
    setLang(selectedLang);
    setShowLangDropdown(false);

    const event = new CustomEvent("langChange", { detail: selectedLang });
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Fixed Floating Layer — pinned to the viewport, floats over content on scroll */}
      <div
        className={`fixed inset-x-0 top-0 z-50 w-full px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
          scrolled ? "pt-2" : "pt-4"
        }`}
      >
        <header
          className={`mx-auto max-w-7xl rounded-3xl border transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_18px_50px_rgba(4,120,87,0.18)] ${
            scrolled
              ? "border-white/40 bg-white/85 shadow-[0_16px_45px_rgba(4,120,87,0.16)] backdrop-blur-2xl"
              : "border-white/30 bg-white/70 shadow-[0_12px_40px_rgba(4,120,87,0.08)] backdrop-blur-xl"
          }`}
        >
          <div
            className={`flex items-center justify-between px-6 transition-all duration-500 ${
              scrolled ? "h-14" : "h-16"
            }`}
          >
            {/* Branding Logo Layout */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-green-700 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-emerald-400/50">
                <Sprout className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
              </span>
              <span className="text-base font-black bg-gradient-to-r from-emerald-900 to-green-800 bg-clip-text text-transparent sm:text-lg tracking-tight transition-opacity duration-300 group-hover:opacity-80">
                Farming Assistant
              </span>
            </Link>

            {/* Desktop Dynamic Navigation Links with Lucide Icons */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_18px_rgba(4,120,87,0.18)] ${
                      isActive
                        ? "bg-emerald-600/10 text-emerald-800 shadow-sm border border-emerald-500/10"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 ${
                        isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-emerald-600"
                      }`}
                    />
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Language Hub Selector */}
            <div className="hidden items-center gap-3 md:flex relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLangDropdown((prev) => !prev)}
                className="group flex items-center gap-2 rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-xs font-black text-emerald-800 shadow-sm transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
              >
                <Globe className="h-4 w-4 text-emerald-600 transition-transform duration-300 group-hover:rotate-12" />
                <span>{LANGUAGES.find((l) => l.code === lang)?.label}</span>
              </button>

              {/* Glassmorphic Language List Container */}
              {showLangDropdown && (
                <div className="absolute right-0 top-12 mt-1 w-44 rounded-2xl border border-white/50 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn">
                  <div className="max-h-60 overflow-y-auto flex flex-col gap-0.5 scrollbar-none">
                    {LANGUAGES.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => handleLanguageChange(option.code)}
                        className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                          lang === option.code
                            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md"
                            : "text-slate-700 hover:bg-emerald-50 hover:translate-x-1 hover:text-emerald-800"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Drawer Toggle */}
            <button
              ref={toggleBtnRef}
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-emerald-800 md:hidden transition-all duration-300 hover:bg-emerald-50 hover:scale-110 active:scale-95"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Overlay Control Interface */}
          {isOpen && (
            <div className="border-t border-emerald-100/50 bg-white/95 backdrop-blur-lg px-4 pb-5 pt-3 md:hidden rounded-b-[2rem] shadow-xl animate-fadeIn">
              <nav className="flex flex-col gap-1.5">
                {NAV_LINKS.map(({ href, label, icon: Icon }, index) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      ref={index === 0 ? firstLinkRef : undefined}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 hover:translate-x-1 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600"
                          : "text-slate-600 hover:bg-emerald-50/70"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-emerald-700" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-2">
                  Select Language
                </p>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                  {LANGUAGES.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        handleLanguageChange(option.code);
                        closeMenu();
                      }}
                      className={`rounded-xl px-3 py-2.5 text-center text-xs font-bold transition-all duration-200 hover:scale-105 ${
                        lang === option.code
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-emerald-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
    </>
  );
}