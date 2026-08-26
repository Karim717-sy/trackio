import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter">
              Trackio
            </Link>
            <p className="mt-4 text-slate-400 max-w-sm">
              L'outil ultime pour les e-commerçants africains. Prenez le contrôle de vos marges et optimisez votre rentabilité au FCFA près.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Produit</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#features" className="text-base text-slate-400 hover:text-white transition">Fonctionnalités</a></li>
              <li><Link href="/login" className="text-base text-slate-400 hover:text-white transition">Connexion</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Légal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-slate-400 hover:text-white transition">Confidentialité</a></li>
              <li><a href="#" className="text-base text-slate-400 hover:text-white transition">Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-slate-400">
            &copy; {new Date().getFullYear()} Trackio. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
