import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

 
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderLiquidationPage (){ 
 
    const [formData, setFormData] = useState({});  
    const [showLiquidationList, setShowLiquidationList] = useState(false);
 
    const [liquidations, setLiquidations] = useState([
      { id: 1, numero: 'LIQ-2025-001', engagement: 'ENG-2025-001', date: '2025-02-10', montant: 5000000, statut: 'Payé' },
      { id: 2, numero: 'LIQ-2025-002', engagement: 'ENG-2025-002', date: '2025-02-15', montant: 3500000, statut: 'En attente' }
    ]);

     
      const handleAfficherLiquidationList = (e:any) => {
        e.preventDefault();
        const newLiquidation = {
          id: liquidations.length + 1,
          numero: `LIQ-2025-${String(liquidations.length + 1).padStart(3, '0')}`,
          engagement: formData.engagementRef,
          date: formData.dateLiquidation,
          montant: parseFloat(formData.montantLiquidation || 0),
          statut: 'En attente'
        };
        setLiquidations([...liquidations, newLiquidation]);
        setShowLiquidationList(true);
      };

      
      
      return (
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Liquidation de Dépense
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Saisie des informations de liquidation
          </p>
        </div>
      
        <form onSubmit={handleAfficherLiquidationList} className="space-y-8">
      
          {/* Bloc informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercice budgétaire
              </label>
              <select
                disabled
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              >
                <option>2025</option>
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Projet
              </label>
              <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
                <option>Sélectionner un projet</option>
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence engagement
              </label>
              <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
                <option>Sélectionner un engagement</option>
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de liquidation
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
      
            {/* Devise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
                <option>FBU</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
      
            {/* Taux */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux de change
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
      
            {/* Montant liquidé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant liquidé
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
      
            {/* Montant total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant total (FBU)
              </label>
              <input
                type="text"
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
                placeholder="—"
              />
            </div>
          </div>
      
          {/* Bloc récapitulatif visuel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Montant engagé</p>
              <p className="text-lg font-semibold text-gray-800">—</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Montant liquidé</p>
              <p className="text-lg font-semibold text-blue-700">—</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Montant restant</p>
              <p className="text-lg font-semibold text-green-700">—</p>
            </div>
          </div>
      
          {/* Paiement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode de paiement
              </label>
              <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
                <option>Sélectionner</option>
                <option>Virement bancaire</option>
                <option>Chèque</option>
                <option>Espèces</option>
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° de pièce
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
      
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validé par
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
            </div>
          </div>
      
          {/* Observations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              placeholder="Observations..."
            />
          </div>
      
          {/* Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white
                         hover:bg-blue-700 transition"
            >
              Afficher la liste
            </button>
          </div>
        </form>
      </div>
      
      
        ); 
      
}