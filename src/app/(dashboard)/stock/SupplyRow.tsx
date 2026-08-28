'use client'

import { deleteSupply, markSupplyArrived } from "./actions";
import { useState } from "react";
import { Trash2, CheckCircle, AlertCircle, XCircle, PackageCheck } from "lucide-react";

export default function SupplyRow({ supply, isPendingView = false }: { supply: any, isPendingView?: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const [showArrivalModal, setShowArrivalModal] = useState(false)
  const [arrivalQty, setArrivalQty] = useState(supply.quantity - supply.quantity_received)
  const [isArriving, setIsArriving] = useState(false)
  const [additionalShipping, setAdditionalShipping] = useState(0)
  const [additionalOther, setAdditionalOther] = useState(0)

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

  async function confirmArrival(e: React.FormEvent) {
    e.preventDefault()
    setIsArriving(true)
    try {
      const remaining = supply.quantity - supply.quantity_received;
      const totalNowReceived = supply.quantity_received + arrivalQty;
      let newStatus: 'partial' | 'arrived' | 'lost' = 'partial';
      
      if (totalNowReceived >= supply.quantity) {
        newStatus = 'arrived';
      } else if (totalNowReceived === 0 && supply.status === 'pending') {
         // if they submit 0, nothing changes unless they want to mark as lost, but we'll assume they just close modal
      }

      await markSupplyArrived(supply.id, totalNowReceived, newStatus, additionalShipping, additionalOther)
      setShowArrivalModal(false)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la mise à jour")
    }
    setIsArriving(false)
  }

  async function markAsLost() {
    setIsArriving(true)
    try {
      await markSupplyArrived(supply.id, supply.quantity_received, 'lost')
      setShowArrivalModal(false)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la mise à jour")
    }
    setIsArriving(false)
  }

  const dateFormatee = new Date(supply.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  if (isPendingView) {
    const remaining = supply.quantity - supply.quantity_received;
    return (
      <tr className="hover:bg-orange-50/50 transition-colors">
        <td className="py-3 px-4 whitespace-nowrap text-slate-600">{dateFormatee}</td>
        <td className="py-3 px-4 font-medium text-slate-900">
          {supply.product_markets?.products?.name} <span className="text-slate-500 font-normal">({supply.product_markets?.country})</span>
        </td>
        <td className="py-3 px-4 text-center text-slate-600 font-medium">{supply.quantity}</td>
        <td className="py-3 px-4 text-center text-green-600 font-bold">{supply.quantity_received}</td>
        <td className="py-3 px-4 text-center text-orange-600 font-bold">{remaining}</td>
        <td className="py-3 px-4 text-right">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <AlertCircle className="w-3.5 h-3.5" />
            {supply.status === 'partial' ? 'Partiel' : 'Commandé'}
          </span>
        </td>
        <td className="py-3 px-4 text-right">
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowArrivalModal(true)}
              className="text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              title="Marquer comme arrivé"
            >
              <PackageCheck className="w-4 h-4" />
              Réceptionner
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 inline-flex items-center"
              title="Supprimer cet approvisionnement"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Réception */}
          {showArrivalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-left transform transition-all">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Réceptionner la marchandise</h3>
                <form onSubmit={confirmArrival}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Quantité reçue aujourd'hui
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max={remaining}
                      required
                      value={arrivalQty}
                      onChange={e => setArrivalQty(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Reste en attente : {remaining}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Frais de transport ({currency})
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      required
                      value={additionalShipping}
                      onChange={e => setAdditionalShipping(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Autres frais (dédouanement, etc.) ({currency})
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      required
                      value={additionalOther}
                      onChange={e => setAdditionalOther(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      onClick={markAsLost}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                      disabled={isArriving}
                    >
                      Déclarer comme perdu
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowArrivalModal(false)}
                        className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                        disabled={isArriving}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        disabled={isArriving}
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-left transform transition-all">
                <h3 className="text-lg font-bold text-slate-900">Supprimer la commande ?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Cette action supprimera la commande de l'historique et réduira votre capital engagé.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition"
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

  // Historique standard (Arrivé / Perdu / Partiel)
  let statusBadge = null;
  if (supply.status === 'arrived' || supply.status === 'partial') {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
        <CheckCircle className="w-3.5 h-3.5" />
        Arrivé
      </span>
    )
  } else if (supply.status === 'lost') {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3.5 h-3.5" />
        Perdu
      </span>
    )
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-4 whitespace-nowrap text-slate-600">{dateFormatee}</td>
      <td className="py-3 px-4 font-medium text-slate-900">
        {supply.product_markets?.products?.name} <span className="text-slate-500 font-normal">({supply.product_markets?.country})</span>
      </td>
      <td className="py-3 px-4 text-center font-bold text-slate-800">
        {supply.status === 'lost' ? (
           <span className="text-red-500 line-through mr-2">{supply.quantity}</span>
        ) : (
           <span className="text-indigo-600">+{supply.quantity_received}</span>
        )}
      </td>
      <td className="py-3 px-4 text-right text-slate-600">
        {Math.round(totalCost).toLocaleString()} {currency}
      </td>
      <td className="py-3 px-4 text-right font-medium text-indigo-600">
        {Math.round(unitCost).toLocaleString()} {currency}
      </td>
      <td className="py-3 px-4 text-right">
        {statusBadge}
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
