'use client'

import { useState } from "react"
import { updatePerformance, deletePerformance } from "./actions"

export default function PerformanceRow({ perf }: { perf: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const unitSellingPrice = perf.unit_selling_price;
  const unitCostPrice = perf.unit_cost_price;
  const initialGeneralRevenue = perf.quantity * unitSellingPrice;
  const initialRevenueWithoutShipping = initialGeneralRevenue - perf.shipping_cost;

  const [quantity, setQuantity] = useState(perf.quantity)
  const [revenue, setRevenue] = useState(initialRevenueWithoutShipping)
  const [adSpend, setAdSpend] = useState(perf.ad_spend)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    const formData = new FormData()
    formData.append('quantity', quantity.toString())
    formData.append('revenue', revenue.toString())
    formData.append('ad_spend', adSpend.toString())
    formData.append('unit_selling_price', unitSellingPrice.toString())
    
    try {
      await updatePerformance(perf.id, formData)
      setIsEditing(false)
    } catch (err) {
      alert("Erreur lors de la mise à jour")
    }
    setIsUpdating(false)
  }

  // Formatting date
  const dateObj = new Date(perf.date);
  const formattedDate = dateObj.toLocaleDateString('fr-FR');

  if (isEditing) {
    return (
      <tr className="bg-indigo-50 transition text-sm">
        <td className="py-4 px-3 text-slate-700 whitespace-nowrap">{formattedDate}</td>
        <td className="py-4 px-3 font-medium text-slate-900">
          {perf.product_markets.products.name}
          <span className="block text-xs text-slate-500 font-normal">{perf.product_markets.country}</span>
        </td>
        <td className="py-4 px-3">
          <input 
            type="number" 
            value={quantity} 
            onChange={e => setQuantity(parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
          />
        </td>
        <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">{unitSellingPrice.toLocaleString('fr-FR')} F</td>
        <td className="py-4 px-3 text-right font-medium text-slate-900 whitespace-nowrap">{(quantity * unitSellingPrice).toLocaleString('fr-FR')} F</td>
        <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">- {Math.max(0, (quantity * unitSellingPrice) - revenue).toLocaleString('fr-FR')} F</td>
        <td className="py-4 px-3">
          <input 
            type="number" 
            value={revenue} 
            onChange={e => setRevenue(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm text-right"
          />
        </td>
        <td className="py-4 px-3 text-right text-slate-600 whitespace-nowrap">- {(quantity * unitCostPrice).toLocaleString('fr-FR')} F</td>
        <td className="py-4 px-3">
          <input 
            type="number" 
            value={adSpend} 
            onChange={e => setAdSpend(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm text-right"
          />
        </td>
        <td colSpan={2} className="py-4 px-3 text-right space-x-2 whitespace-nowrap">
          <button 
            onClick={handleSave} 
            disabled={isUpdating}
            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 font-medium"
          >
            {isUpdating ? '...' : 'Sauver'}
          </button>
          <button 
            onClick={() => {
              setIsEditing(false)
              setQuantity(perf.quantity)
              setRevenue(initialRevenueWithoutShipping)
              setAdSpend(perf.ad_spend)
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Annuler
          </button>
        </td>
        <td className="py-4 px-2"></td>
      </tr>
    )
  }

  // Normal view calculations
  const generalRevenue = perf.quantity * unitSellingPrice;
  const shippingCost = perf.shipping_cost;
  const revenueWithoutShipping = generalRevenue - shippingCost;
  const productsCost = perf.quantity * unitCostPrice;
  const profit = revenueWithoutShipping - productsCost - perf.ad_spend;
  const margin = revenueWithoutShipping > 0 ? (profit / revenueWithoutShipping) * 100 : 0;

  return (
    <tr className="hover:bg-slate-50 transition text-sm">
      <td className="py-4 px-3 text-slate-700 whitespace-nowrap">{formattedDate}</td>
      <td className="py-4 px-3 font-medium text-slate-900">
        {perf.product_markets.products.name}
        <span className="block text-xs text-slate-500 font-normal">{perf.product_markets.country}</span>
      </td>
      <td className="py-4 px-3 text-center text-slate-900 font-bold bg-slate-50/50">{perf.quantity}</td>
      <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">{unitSellingPrice.toLocaleString('fr-FR')} F</td>
      <td className="py-4 px-3 text-right font-medium text-slate-900 whitespace-nowrap">{generalRevenue.toLocaleString('fr-FR')} F</td>
      <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">- {shippingCost.toLocaleString('fr-FR')} F</td>
      <td className="py-4 px-3 text-right font-medium text-slate-900 bg-indigo-50/30 whitespace-nowrap">{revenueWithoutShipping.toLocaleString('fr-FR')} F</td>
      <td className="py-4 px-3 text-right text-slate-600 whitespace-nowrap">- {productsCost.toLocaleString('fr-FR')} F</td>
      <td className="py-4 px-3 text-right text-slate-600 whitespace-nowrap">- {perf.ad_spend.toLocaleString('fr-FR')} F</td>
      
      <td className={`py-4 px-3 text-right font-bold whitespace-nowrap ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {profit > 0 ? '+' : ''}{profit.toLocaleString('fr-FR')} F
      </td>
      
      <td className="py-4 px-3 text-center">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${margin >= 20 ? 'bg-green-100 text-green-800' : margin >= 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
          {margin.toFixed(1)}%
        </span>
      </td>

      <td className="py-4 px-2 text-right whitespace-nowrap space-x-1">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-blue-600 transition p-1" title="Modifier"
        >
          ✏️
        </button>
        <form className="inline-block" action={async () => {
          await deletePerformance(perf.id);
        }}>
          <button type="submit" className="text-slate-400 hover:text-red-600 transition p-1" title="Supprimer">
            🗑️
          </button>
        </form>
      </td>
    </tr>
  )
}
