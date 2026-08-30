'use client'

import { useState, useMemo } from 'react'
import SupplyForm from "./SupplyForm";
import SupplyRow from "./SupplyRow";
import CustomDropdown from '@/app/(dashboard)/dashboard/CustomDropdown'
import { convertCurrency } from '@/utils/currencies'

export default function StockClient({ supplies, markets, overview }: { supplies: any[], markets: any[], overview: any[] }) {
  const [countryFilter, setCountryFilter] = useState('All')

  // Extraire les pays
  const availableCountries = useMemo(() => {
    const countries = new Set<string>()
    overview.forEach(o => countries.add(o.country))
    return Array.from(countries).sort()
  }, [overview])

  const filteredOverview = useMemo(() => {
    return overview.filter(item => countryFilter === 'All' || item.country === countryFilter)
  }, [overview, countryFilter])

  const filteredSupplies = useMemo(() => {
    return supplies.filter(s => countryFilter === 'All' || s.product_markets?.country === countryFilter)
  }, [supplies, countryFilter])

  // Déterminer la devise d'affichage globale (simplement la première trouvée, sinon FCFA)
  // Normalement on afficherait ça dynamiquement comme dans le dashboard principal.
  const displayCurrency = countryFilter !== 'All' 
    ? filteredOverview[0]?.currency || 'FCFA'
    : 'FCFA'

  const totalCapitalInvested = filteredOverview.reduce((acc, curr) => acc + convertCurrency(curr.totalInvested, curr.currency || 'XOF', displayCurrency), 0);
  const totalStockValue = filteredOverview.reduce((acc, curr) => acc + convertCurrency(curr.stockValue, curr.currency || 'XOF', displayCurrency), 0);
  const totalPotentialRevenue = filteredOverview.reduce((acc, curr) => acc + convertCurrency(curr.potentialRevenue, curr.currency || 'XOF', displayCurrency), 0);
  const totalPotentialProfit = filteredOverview.reduce((acc, curr) => acc + convertCurrency(curr.potentialProfit, curr.currency || 'XOF', displayCurrency), 0);
  const totalItems = filteredOverview.reduce((acc, curr) => acc + curr.remainingStock, 0);
  
  const totalPendingQuantity = filteredOverview.reduce((acc, curr) => acc + (curr.pendingQuantity || 0), 0);
  const totalPendingInvested = filteredOverview.reduce((acc, curr) => acc + convertCurrency(curr.pendingInvested || 0, curr.currency || 'XOF', displayCurrency), 0);

  const pendingSupplies = filteredSupplies.filter(s => s.status === 'pending' || s.status === 'partial');
  const pastSupplies = filteredSupplies.filter(s => s.status === 'arrived' || s.status === 'lost' || s.status === 'partial');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stock & Investissements</h1>
          <p className="text-slate-600 mt-2">Suivez le coût réel de vos marchandises et anticipez votre rentabilité potentielle.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <CustomDropdown 
            value={countryFilter}
            onChange={setCountryFilter}
            icon="🌍"
            options={[
              {label: "Tous les pays", value: "All"},
              ...availableCountries.map(c => ({label: c, value: c}))
            ]}
          />
        </div>
      </div>
      
      {/* KPIs Commandes en cours (si existantes) */}
      {(totalPendingQuantity > 0 || totalPendingInvested > 0) && (
        <div className="flex gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100 shadow-sm">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-orange-800">Commandes en cours</h3>
            <p className="text-2xl font-bold text-orange-600 mt-1">{pendingSupplies.length}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-orange-800">Pièces en attente</h3>
            <p className="text-2xl font-bold text-orange-600 mt-1">{totalPendingQuantity.toLocaleString()}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-orange-800">Capital Engagé (Attente)</h3>
            <p className="text-2xl font-bold text-orange-600 mt-1">{totalPendingInvested.toLocaleString()} <span className="text-sm font-normal text-orange-500">{displayCurrency}</span></p>
          </div>
        </div>
      )}

      {/* KPIs Globaux */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Capital Investi</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCapitalInvested.toLocaleString()} <span className="text-sm font-normal text-slate-500">{displayCurrency}</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Pièces en stock</h3>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{totalItems.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Valeur du stock</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStockValue.toLocaleString()} <span className="text-sm font-normal text-slate-500">{displayCurrency}</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">CA Potentiel</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalPotentialRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-500">{displayCurrency}</span></p>
        </div>
        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
          <h3 className="text-sm font-medium text-indigo-800">Bénéfice Potentiel (Est.)</h3>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{Math.round(totalPotentialProfit).toLocaleString()} <span className="text-sm font-normal text-indigo-600">{displayCurrency}</span></p>
        </div>
      </div>

      {/* Tableau Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">État du stock {countryFilter !== 'All' ? `(${countryFilter})` : 'par marché'}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                <th className="py-3 px-4 font-semibold text-slate-700">Produit & Pays</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-center">En Stock</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">CMUP / pièce</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Valeur Stock</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Prix de vente</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">CA Potentiel</th>
                <th className="py-3 px-4 font-semibold text-slate-700 text-right">Bénéfice Est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOverview.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucun produit en stock pour cette sélection.
                  </td>
                </tr>
              ) : (
                filteredOverview.map((item) => (
                  <tr key={item.market_id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {item.product_name} <span className="text-slate-500 font-normal">({item.country})</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {item.remainingStock}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {Math.round(item.cmup).toLocaleString()} {item.currency}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                      {Math.round(item.stockValue).toLocaleString()} {item.currency}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {item.selling_price} {item.currency}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      {item.potentialRevenue.toLocaleString()} {item.currency}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-indigo-600">
                      {Math.round(item.potentialProfit).toLocaleString()} {item.currency}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Approvisionnements */}
      <div className="space-y-8">
        
        {/* Formulaire */}
        <div className="w-full">
          <SupplyForm markets={markets} />
        </div>

        {/* Historique des approvisionnements */}
        <div className="w-full space-y-8">
          
          {pendingSupplies.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
              <div className="p-5 border-b border-orange-100 bg-orange-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-orange-800">Commandes en cours (En attente)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-orange-50/30 border-b border-orange-100 text-sm">
                      <th className="py-3 px-4 font-semibold text-slate-700">Date</th>
                      <th className="py-3 px-4 font-semibold text-slate-700">Produit & Pays</th>
                      <th className="py-3 px-4 font-semibold text-slate-700 text-center">Commandé</th>
                      <th className="py-3 px-4 font-semibold text-slate-700 text-center">Reçu</th>
                      <th className="py-3 px-4 font-semibold text-slate-700 text-center">Reste</th>
                      <th className="py-3 px-4 font-semibold text-slate-700 text-right">Statut</th>
                      <th className="py-3 px-4 font-semibold text-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100">
                    {pendingSupplies.map((supply) => (
                      <SupplyRow key={supply.id} supply={supply} isPendingView={true} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Historique des arrivages & pertes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                    <th className="py-3 px-4 font-semibold text-slate-700">Date</th>
                    <th className="py-3 px-4 font-semibold text-slate-700">Produit & Pays</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 text-center">Quantité Reçue/Perdue</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 text-right">Coût Total</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 text-right">Coût unitaire</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 text-right">Statut</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastSupplies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Aucun historique disponible.
                      </td>
                    </tr>
                  ) : (
                    pastSupplies.map((supply) => (
                      <SupplyRow key={supply.id} supply={supply} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
