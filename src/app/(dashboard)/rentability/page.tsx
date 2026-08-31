import { getPerformances } from "./actions";
import { getProductMarkets } from "../products/actions";
import RentabilityForm from "./RentabilityForm";
import PerformanceRow from "./PerformanceRow";

export default async function RentabilityPage() {
  const performances = await getPerformances();
  const markets = await getProductMarkets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Rentabilité</h1>
        <p className="text-slate-600 mt-2">Saisissez vos performances journalières pour suivre votre rentabilité réelle.</p>
      </div>

      <div className="space-y-8">
        
        {/* Formulaire (Client Component) */}
        <div className="w-full">
          <RentabilityForm markets={markets} />
        </div>

        {/* Historique des saisies */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                    <th className="py-4 px-3 font-semibold text-slate-700">Date</th>
                    <th className="py-4 px-3 font-semibold text-slate-700">Produit & Pays</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-center">Nbre de pièces livrées</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">Prix</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">CA général</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">Frais de livraison</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">CA (hors livr.)</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">Coût Produits</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">Pub</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">Bénéfice</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-center">Marge %</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">Frais livr. / pièce</th>
                    <th className="py-4 px-3 font-semibold text-slate-700 text-right">CPA (Coût / Achat)</th>
                    <th className="py-4 px-2 font-semibold text-slate-700 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {performances.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-8 text-center text-slate-500">
                        Aucune donnée enregistrée pour le moment.
                      </td>
                    </tr>
                  ) : (
                    performances.map((perf) => (
                      <PerformanceRow key={perf.id} perf={perf} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
