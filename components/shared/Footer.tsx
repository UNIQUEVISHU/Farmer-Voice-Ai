"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              🌱 AgriConsultant
            </h2>
            <p className="text-sm text-slate-400 leading-6">
              AI-powered farming assistant helping farmers with crop disease
              detection, weather forecasts and smart agricultural guidance.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/disease"
                  className="hover:text-emerald-400 transition"
                >
                  Disease Detection
                </Link>
              </li>

              <li>
                <Link
                  href="/weather"
                  className="hover:text-emerald-400 transition"
                >
                  Weather Forecast
                </Link>
              </li>

              <li>
                <Link
                  href="/chat"
                  className="hover:text-emerald-400 transition"
                >
                  AI Chat Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/chat"
                  className="hover:text-emerald-400 transition"
                >
                  Support
                </Link>
              </li>

              <li>
                <Link
                  href="/weather"
                  className="hover:text-emerald-400 transition"
                >
                  Live Weather
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Need Help?
            </h3>

            <p className="text-sm text-slate-400 mb-4">
              Have questions? Our AI assistant is available anytime.
            </p>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AgriConsultant. All rights reserved.
          </p>

          <p className="flex items-center gap-1 text-sm text-slate-500">
            Made with
            <Heart className="h-4 w-4 text-emerald-500 fill-emerald-500" />
            for Smart Farming
          </p>

        </div>

      </div>
    </footer>
  );
}