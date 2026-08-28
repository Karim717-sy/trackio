"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
              Trackio
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-slate-600 hover:text-indigo-600 transition font-medium">Fonctionnalités</a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="inline-block text-slate-600 hover:text-indigo-600 font-medium transition-all duration-300 hover:scale-105 active:scale-95">
              Connexion
            </Link>
            <Link href="/register" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
              Inscription
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-4 shadow-lg">
          <a href="#features" onClick={() => setIsOpen(false)} className="block text-slate-600 hover:text-indigo-600 font-medium">Fonctionnalités</a>
          <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3">
            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center text-slate-600 hover:text-indigo-600 font-medium transition-all duration-300 hover:scale-105 active:scale-95">
              Connexion
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="block text-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
              Inscription
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
