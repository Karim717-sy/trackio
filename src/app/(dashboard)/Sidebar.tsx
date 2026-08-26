'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar({ logoutAction }: { logoutAction: () => void }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const navLinks = [
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/products", label: "Produits" },
    { href: "/rentability", label: "Rentabilité" },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shadow-md z-30 relative">
        <h1 className="text-xl font-bold tracking-tight">Trackio</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1 focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight text-white">Trackio</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 md:mt-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={handleClose}
                className={`block px-4 py-2.5 rounded-lg transition-all ${
                  isActive ? "bg-indigo-600 font-semibold shadow-sm" : "hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 pb-8 md:pb-12 border-t border-slate-800 space-y-2">
          <Link 
            href="/settings" 
            onClick={handleClose}
            className={`block px-4 py-2.5 rounded-lg transition-all ${
              pathname === "/settings" ? "bg-indigo-600 font-semibold shadow-sm" : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Paramètres
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full text-left block px-4 py-2.5 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
