import { getProducts, getProductMarkets } from "./actions";
import ProductForm from "./ProductForm";
import ProductMarketRow from "./ProductMarketRow";
import { getUserProfile } from "@/app/(dashboard)/settings/actions";

export default async function ProductsPage() {
  const products = await getProducts();
  const markets = await getProductMarkets();
  const profile = await getUserProfile().catch(() => ({ main_country: 'Sénégal', main_currency: 'XOF' }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Produits & Marchés</h1>
        <p className="text-slate-600 mt-2">Gérez vos produits et configurez leurs prix selon les pays (marchés).</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Formulaire (Client Component) */}
        <div className="xl:col-span-1">
          <ProductForm 
            existingProducts={products} 
            mainCountry={profile.main_country} 
            mainCurrency={profile.main_currency} 
          />
        </div>

        {/* Liste des produits par marché */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 font-semibold text-slate-700">Produit</th>
                    <th className="py-4 px-6 font-semibold text-slate-700">Pays</th>
                    <th className="py-4 px-6 font-semibold text-slate-700">Prix de vente</th>
                    <th className="py-4 px-6 font-semibold text-slate-700">Coût de revient</th>
                    <th className="py-4 px-6 font-semibold text-slate-700 text-center">Statut</th>
                    <th className="py-4 px-6 font-semibold text-slate-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {markets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Aucun marché configuré pour le moment.
                      </td>
                    </tr>
                  ) : (
                    markets.map((market) => (
                      <ProductMarketRow key={market.id} market={market} />
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
