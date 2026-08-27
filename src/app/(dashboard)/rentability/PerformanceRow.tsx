'use client'

import { useState } from "react"
import { updatePerformance, deletePerformance } from "./actions"
import { Pencil, Trash2 } from "lucide-react"

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
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePerformance(perf.id)
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
    setIsDeleting(false)
    setShowDeleteModal(false)
  }

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
        <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">{unitSellingPrice.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
        <td className="py-4 px-3 text-right font-medium text-slate-900 whitespace-nowrap">{(quantity * unitSellingPrice).toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
        <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">- {Math.max(0, (quantity * unitSellingPrice) - revenue).toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
        <td className="py-4 px-3">
          <input 
            type="number" 
            value={revenue} 
            onChange={e => setRevenue(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm text-right"
          />
        </td>
        <td className="py-4 px-3 text-right text-slate-600 whitespace-nowrap">- {(quantity * unitCostPrice).toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
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
        <td className="py-4 px-3 text-right text-slate-400 whitespace-nowrap text-xs">
          {quantity > 0 ? (Math.max(0, (quantity * unitSellingPrice) - revenue) / quantity).toLocaleString('fr-FR', {maximumFractionDigits: 0}) : 0} {perf.product_markets.currency || 'XOF'}
        </td>
        <td className="py-4 px-3 text-right text-slate-400 whitespace-nowrap text-xs">
          {quantity > 0 ? (adSpend / quantity).toLocaleString('fr-FR', {maximumFractionDigits: 0}) : 0} {perf.product_markets.currency || 'XOF'}
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
      <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">{unitSellingPrice.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
      <td className="py-4 px-3 text-right font-medium text-slate-900 whitespace-nowrap">{generalRevenue.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
      <td className="py-4 px-3 text-right text-slate-500 whitespace-nowrap">- {shippingCost.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
      <td className="py-4 px-3 text-right font-medium text-slate-900 bg-indigo-50/30 whitespace-nowrap">{revenueWithoutShipping.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
      <td className="py-4 px-3 text-right text-slate-600 whitespace-nowrap">- {productsCost.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
      <td className="py-4 px-3 text-right text-slate-600 whitespace-nowrap">- {perf.ad_spend.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}</td>
      
      <td className={`py-4 px-3 text-right font-bold whitespace-nowrap ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {profit > 0 ? '+' : ''}{profit.toLocaleString('fr-FR')} {perf.product_markets.currency || 'XOF'}
      </td>
      
      <td className="py-4 px-3 text-center">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${margin >= 20 ? 'bg-green-100 text-green-800' : margin >= 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
          {margin.toFixed(1)}%
        </span>
      </td>

      <td className="py-4 px-3 text-right text-slate-400 whitespace-nowrap text-xs">{perf.quantity > 0 ? (shippingCost / perf.quantity).toLocaleString('fr-FR', {maximumFractionDigits: 0}) : 0} {perf.product_markets.currency || 'XOF'}</td>
      <td className="py-4 px-3 text-right text-slate-400 whitespace-nowrap text-xs">{perf.quantity > 0 ? (perf.ad_spend / perf.quantity).toLocaleString('fr-FR', {maximumFractionDigits: 0}) : 0} {perf.product_markets.currency || 'XOF'}</td>

      <td className="py-4 px-2 text-right whitespace-nowrap space-x-1 relative">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-blue-600 transition p-1.5 rounded hover:bg-blue-50 inline-flex items-center" 
          title="Modifier"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          className="text-slate-400 hover:text-red-600 transition p-1.5 rounded hover:bg-red-50 inline-flex items-center" 
          title="Supprimer"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-left transform transition-all">
              <h3 className="text-lg font-bold text-slate-900">Supprimer la performance ?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Êtes-vous sûr de vouloir supprimer cette ligne ? Cette action est irréversible.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}
