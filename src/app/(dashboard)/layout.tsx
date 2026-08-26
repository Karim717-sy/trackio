import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Trackio</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 transition">
            Tableau de bord
          </Link>
          <Link href="/products" className="block px-4 py-2 rounded hover:bg-slate-700 transition">
            Produits
          </Link>
          <Link href="/sales" className="block px-4 py-2 rounded hover:bg-slate-700 transition">
            Ventes
          </Link>
          <Link href="/expenses" className="block px-4 py-2 rounded hover:bg-slate-700 transition">
            Dépenses
          </Link>
        </nav>
        
        <div className="p-4 pb-12 border-t border-slate-700">
          <Link href="/settings" className="block px-4 py-2 rounded hover:bg-slate-700 transition">
            Paramètres
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 text-slate-900">
        {children}
      </main>
    </div>
  );
}
