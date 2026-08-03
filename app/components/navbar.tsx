'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useThemeStore } from '../store/themeStore';
import useAuthStore from '../store/authStore';

const SunIcon = () => <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>;
const MoonIcon = () => <svg className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>;


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isLoggedIn, logout, loading, profile } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/screening-cpo', label: 'Screening' },
    { href: '/about', label: 'DrukCLM' },
    { href: '/reports', label: 'Publications' },
    { href: '/statistics', label: 'Statistics' },
    { href: "/BeneficiaryForm", label: "Support Request" },
  ];

  return (
    <header
      className={`fixed w-full z-50 backdrop-blur-md border-b-2 shadow-xl transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-900/95 border-gray-800"
          : "bg-orange-50/95 border-orange-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* LOGO */}
          <div className="flex items-center space-x-4">
            <Link href="/" aria-label="Go to Homepage">
              <Image
                src="/assets/logo.png"
                alt="Primary Logo"
                width={48}
                height={48}
                className="h-8 md:h-12 w-auto transition-transform hover:scale-110 drop-shadow-md"
                priority
              />
            </Link>
            {/* <Link href="/" aria-label="Go to Homepage">
              <Image src="/assets/skpa2-logo.png" alt="Subsidiary Logo" width={48} height={48} className="h-8 md:h-12 w-auto transition-transform hover:scale-110 drop-shadow-md" priority />
            </Link> */}
          </div>

          <div className="flex items-center space-x-4 md-space-x-6">
            {/* DESKTOP MENU */}
            <div className="hidden md:flex space-x-8 items-center">
              {/*Added a link for the Admin Dashboard */}
              {isLoggedIn && profile && profile.role === "admin" && (
                <Link
                  href="/dashboard"
                  className={`font-semibold transition-all duration-300 relative group py-2 ${
                    pathname === "/dashboard"
                      ? isDarkMode
                        ? "text-cyan-400 font-bold"
                        : "text-orange-700 font-bold"
                      : isDarkMode
                      ? "text-gray-300 hover:text-cyan-300"
                      : "text-orange-900 hover:text-orange-700"
                  }`}
                >
                  Admin Dashboard
                  <span
                    className={`absolute -bottom-1 left-0 h-1 transition-all duration-300 rounded-full ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "bg-gradient-to-r from-orange-500 to-red-500"
                    } ${
                      pathname === "/dashboard"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )}

              {/* NEW: Added a link for the KPO Dashboard */}
              {isLoggedIn && profile && profile.role === "kpo" && (
                <Link
                  href="/kpo-dashboard"
                  className={`font-semibold transition-all duration-300 relative group py-2 ${
                    pathname === "/kpo-dashboard"
                      ? isDarkMode
                        ? "text-cyan-400 font-bold"
                        : "text-orange-700 font-bold"
                      : isDarkMode
                      ? "text-gray-300 hover:text-cyan-300"
                      : "text-orange-900 hover:text-orange-700"
                  }`}
                >
                  KPO Dashboard
                  <span
                    className={`absolute -bottom-1 left-0 h-1 transition-all duration-300 rounded-full ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "bg-gradient-to-r from-orange-500 to-red-500"
                    } ${
                      pathname === "/kpo-dashboard"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-semibold transition-all duration-300 relative group py-2 ${
                    pathname === link.href
                      ? isDarkMode
                        ? "text-cyan-400 font-bold"
                        : "text-orange-700 font-bold"
                      : isDarkMode
                      ? "text-gray-300 hover:text-cyan-300"
                      : "text-orange-900 hover:text-orange-700"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-1 transition-all duration-300 rounded-full ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "bg-gradient-to-r from-orange-500 to-red-500"
                    } ${
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}

              {!loading && (
                <>
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className={`font-semibold transition-all duration-300 relative group py-2 ${
                        isDarkMode
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-500"
                      }`}
                    >
                      Logout
                      <span className="absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className={`font-semibold transition-all duration-300 relative group py-2 ${
                        pathname === "/login"
                          ? isDarkMode
                            ? "text-cyan-400 font-bold"
                            : "text-orange-700 font-bold"
                          : isDarkMode
                          ? "text-gray-300 hover:text-cyan-300"
                          : "text-orange-900 hover:text-orange-700"
                      }`}
                    >
                      Login
                      <span
                        className={`absolute -bottom-1 left-0 h-1 transition-all duration-300 rounded-full ${
                          isDarkMode
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                            : "bg-gradient-to-r from-orange-500 to-red-500"
                        } ${
                          pathname === "/login"
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  )}
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-amber-200 text-orange-900 hover:bg-orange-200"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`transition-colors p-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-cyan-400"
                    : "text-orange-900 hover:text-orange-700"
                }`}
                aria-label="Toggle menu"
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU PANEL */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col items-center space-y-4">
            {isLoggedIn && profile && profile.role === "admin" && (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-center font-semibold py-2 rounded-md ${
                  pathname === "/dashboard"
                    ? isDarkMode
                      ? "bg-cyan-900/50 text-cyan-300"
                      : "bg-orange-200 text-orange-800"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-orange-900 hover:bg-orange-100"
                }`}
              >
                Admin Dashboard
              </Link>
            )}

            {/* NEW: Added a link for the KPO Dashboard on mobile */}
            {isLoggedIn && profile && profile.role === "kpo" && (
              <Link
                href="/kpo-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-center font-semibold py-2 rounded-md ${
                  pathname === "/kpo-dashboard"
                    ? isDarkMode
                      ? "bg-cyan-900/50 text-cyan-300"
                      : "bg-orange-200 text-orange-800"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-orange-900 hover:bg-orange-100"
                }`}
              >
                KPO Dashboard
              </Link>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-center font-semibold py-2 rounded-md ${
                  pathname === link.href
                    ? isDarkMode
                      ? "bg-cyan-900/50 text-cyan-300"
                      : "bg-orange-200 text-orange-800"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-orange-900 hover:bg-orange-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr
              className={`w-full border-t-2 ${
                isDarkMode ? "border-gray-700" : "border-orange-200"
              }`}
            />

            {!loading && (
              <>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className={`w-full text-center font-semibold py-2 rounded-md transition-colors duration-300 ${
                      isDarkMode
                        ? "text-red-400 hover:bg-red-900/50"
                        : "text-red-600 hover:bg-red-100"
                    }`}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full text-center font-semibold py-2 rounded-md ${
                      pathname === "/login"
                        ? isDarkMode
                          ? "bg-cyan-900/50 text-cyan-300"
                          : "bg-orange-200 text-orange-800"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-orange-900 hover:bg-orange-100"
                    }`}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}