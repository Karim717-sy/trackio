'use client'

import { deleteSupply } from "./actions";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function SupplyRow({ supply }: { supply: any }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const currency = supply.product_markets?.currency || 'FCFA'
  
  const totalCost = Number(supply.total_purchase_price) + Number(supply.shipping_cost) + Number(supply.other_costs)
  const unitCost = totalCost / supply.quantity

  async function handleDelete() {
    if (!confirm("Voulez-vous vraiment supprimer cet approvisionnement ? Cela modifiera votre stock actuel.")) return
    
    setIsDeleting(true)
    try {
      await deleteSupply(supply.id)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression")
      setIsDeleting(false)
    }
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
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          title="Supprimer cet approvisionnement"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}
