'use client'

import { deleteSupply } from "./actions";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function SupplyRow({ supply }: { supply: any }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const currency = supply.product_markets?.currency || 'FCFA'
  
  const totalCost = Number(supply.total_purchase_price) + Number(supply.shipping_cost) + Number(supply.other_costs)
  const unitCost = totalCost / supply.quantity

  async function confirmDelete() {
    setIsDeleting(true)
    try {
      await deleteSupply(supply.id)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression")
    }
    setIsDeleting(false)
    setShowDeleteModal(false)
  }

  const dateFormatee = new Date(supply.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4 whitespace-nowrap text-slate-600">{dateFormatee}</td>
      <td className="py-3 px-4 font-medium text-slate-900">
        {supply.product_markets?.products?.name} <span className="text-slate-500 font-normal">({supply.product_markets?.country})</span>
      </td>
      <td className="py-3 px-4 text-center font-bold text-slate-800">
        +{supply.quantity}
      </td>
      <td className="py-3 px-4 text-right text-slate-600">
        {Math.round(totalCost).toLocaleString()} {currency}
      </td>
      <td className="py-3 px-4 text-right font-medium text-indigo-600">
        {Math.round(unitCost).toLocaleString()} {currency}
      </td>
      <td className="py-3 px-4 text-right">
        <button 
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 inline-flex items-center"
          title="Supprimer cet approvisionnement"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-left transform transition-all">
              <h3 className="text-lg font-bold text-slate-900">Supprimer cet arrivage ?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Êtes-vous sûr de vouloir supprimer cet approvisionnement de {supply.quantity} pièces ? Cela réduira votre stock actuel et modifiera votre prix moyen. Cette action est irréversible.
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
