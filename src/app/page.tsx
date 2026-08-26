import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-200">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute inset-y-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
              Nouveau SaaS pour l'e-commerce en Afrique
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
              Comprenez exactement <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                combien vous gagnez.
              </span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Suivez vos ventes, vos dépenses publicitaires et calculez vos bénéfices réels au FCFA près. Fini les Google Sheets compliqués.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl hover:bg-indigo-700 hover:shadow-indigo-500/30 transition transform hover:-translate-y-1 text-lg w-full sm:w-auto">
                Commencer gratuitement
              </Link>
              <Link href="#problem" className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition text-lg w-full sm:w-auto">
                Découvrir la solution
              </Link>
            </div>
            
            {/* Dashboard Preview Fake */}
            <div className="mt-16 relative max-w-5xl mx-auto perspective-1000">
              <div className="rounded-xl shadow-2xl bg-white border border-slate-200 overflow-hidden transform rotate-x-12 scale-95 hover:scale-100 hover:rotate-x-0 transition-all duration-700 ease-out">
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                    <p className="text-sm font-medium text-slate-500">Bénéfice Net</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">+ 450 000 FCFA</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                    <p className="text-sm font-medium text-slate-500">Coût par Achat (CPA)</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">3 500 FCFA</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                    <p className="text-sm font-medium text-slate-500">Pièces Livrées</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">128</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Le problème de 90% des e-commerçants</h2>
              <p className="text-xl text-slate-400">
                Vous faites des ventes tous les jours, l'argent rentre, mais à la fin du mois... vous ne savez pas exactement combien il vous reste.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center text-2xl mb-6">📉</div>
                <h3 className="text-xl font-bold mb-3">Coûts cachés ignorés</h3>
                <p className="text-slate-400">Frais de livraison, coût de revient, coûts publicitaires... Si vous oubliez un seul élément, vos marges sont fausses.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
                <h3 className="text-xl font-bold mb-3">Google Sheets illisibles</h3>
                <p className="text-slate-400">Des formules cassées, des cellules DIV/0, des tableaux lourds qui prennent un temps fou à mettre à jour chaque soir.</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-xl flex items-center justify-center text-2xl mb-6">🤷‍♂️</div>
                <h3 className="text-xl font-bold mb-3">Décisions à l'aveugle</h3>
                <p className="text-slate-400">Sans connaître votre vrai coût par achat (CPA) de rentabilité, vous dépensez en publicité sans savoir si vous êtes gagnant.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Solution Section */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Gérez votre e-commerce comme un pro</h2>
              <p className="text-xl text-slate-600">Trackio centralise toutes vos données et fait les calculs automatiquement. Vous n'avez qu'à saisir 3 chiffres par jour.</p>
            </div>

            <div className="space-y-24">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="inline-block p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Calcul automatique du vrai bénéfice</h3>
                  <p className="text-lg text-slate-600">
                    Saisissez simplement votre nombre de pièces livrées, votre CA hors livraison et vos dépenses pub. Trackio s'occupe de soustraire vos coûts de revient et frais de livraison pour vous donner votre <strong>Bénéfice Net</strong>.
                  </p>
                </div>
                <div className="flex-1 w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 transform hover:-translate-y-2 transition duration-500">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-slate-500">CA hors livraison</span>
                      <span className="font-semibold text-slate-900">32 000 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-slate-500">Coût de revient total</span>
                      <span className="font-semibold text-amber-600">- 5 200 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="text-slate-500">Dépenses publicitaires</span>
                      <span className="font-semibold text-amber-600">- 16 500 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-slate-900">Bénéfice Net</span>
                      <span className="text-xl font-bold text-green-600">10 300 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="inline-block p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Dashboard intuitif et statistiques</h3>
                  <p className="text-lg text-slate-600">
                    Analysez vos performances sur n'importe quelle période. Visualisez vos jours les plus rentables, surveillez l'évolution de votre CPA et réagissez rapidement pour optimiser vos marges.
                  </p>
                </div>
                <div className="flex-1 w-full bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800 transform hover:-translate-y-2 transition duration-500">
                  <div className="h-48 flex items-end gap-2 justify-between">
                    {[40, 65, 35, 80, 50, 95, 75].map((height, i) => (
                      <div key={i} className="w-full bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-slate-400">
                    <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-6">Prêt à clarifier vos finances ?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Rejoignez Trackio dès aujourd'hui et prenez le contrôle total sur la rentabilité de vos produits. Fini l'improvisation.
            </p>
            <Link href="/register" className="inline-block px-10 py-5 bg-white text-indigo-700 font-bold rounded-xl shadow-2xl hover:bg-slate-50 transition transform hover:scale-105 text-lg">
              Créer mon compte Trackio
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
